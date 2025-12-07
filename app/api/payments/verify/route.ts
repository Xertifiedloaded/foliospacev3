import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-middleware"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

// Type definitions for Paystack response
interface PaystackTransaction {
  id: number
  status: string
  reference: string
  amount: number
  currency: string
  channel: string
  authorization?: {
    authorization_code: string
    card_type: string
    last4: string
    bank: string
  }
  customer?: {
    id: number
    customer_code: string
    email: string
  }
  plan?: {
    id: number
    plan_code: string
    name: string
  }
  receipt_url?: string
  paid_at: string
}

interface PaystackResponse {
  status: boolean
  message: string
  data: PaystackTransaction
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      console.error("[Payment] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { reference } = await request.json()

    if (!reference) {
      console.error("[Payment] Missing reference in request")
      return NextResponse.json({ error: "Reference is required" }, { status: 400 })
    }

    console.log("[Payment] Verifying reference:", reference)

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      console.error("[Payment] Paystack API error:", response.status, response.statusText)
      return NextResponse.json(
        { error: "Failed to verify with Paystack" },
        { status: 500 }
      )
    }

    const data: PaystackResponse = await response.json()

    if (!data.status) {
      console.error("[Payment] Paystack verification failed:", data.message)
      return NextResponse.json(
        { error: data.message || "Verification failed" },
        { status: 400 }
      )
    }

    const transaction = data.data

    console.log("[Payment] Paystack transaction status:", transaction.status)
    if (transaction.status !== "success") {
      console.error("[Payment] Transaction not successful:", transaction.status)
      await prisma.payment.updateMany({
        where: { paystackReference: reference },
        data: { 
          status: "FAILED",
          updatedAt: new Date()
        },
      })

      return NextResponse.json(
        { error: "Payment was not successful", transactionStatus: transaction.status },
        { status: 400 }
      )
    }
    const payment = await prisma.payment.findFirst({
      where: { paystackReference: reference },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            subscriptionTier: true,
            subscriptionStatus: true,
          }
        }
      }
    })

    if (!payment) {
      console.error("[Payment] Payment record not found for reference:", reference)
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      )
    }

    console.log("[Payment] Found payment record:", payment.id)
    if (payment.status === "COMPLETED") {
      console.log("[Payment] Payment already processed:", payment.id)
      return NextResponse.json({
        success: true,
        message: "Payment already processed",
        alreadyProcessed: true,
        subscription: {
          tier: payment.user.subscriptionTier,
          status: payment.user.subscriptionStatus,
        }
      })
    }
    if (payment.userId !== user.id) {
      console.error("[Payment] Payment user mismatch. Payment userId:", payment.userId, "Auth userId:", user.id)
      return NextResponse.json(
        { error: "Unauthorized: Payment does not belong to user" },
        { status: 403 }
      )
    }
    const now = new Date()
    const startDate = new Date(now)
    const endDate = new Date(now)
    
    if (payment.billingCycle === "MONTHLY") {
      endDate.setMonth(endDate.getMonth() + 1)
    } else if (payment.billingCycle === "YEARLY") {
      endDate.setFullYear(endDate.getFullYear() + 1)
    } else {
      console.error("[Payment] Invalid billing cycle:", payment.billingCycle)
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 }
      )
    }

    console.log("[Payment] Subscription period:", startDate, "to", endDate)
    const result = await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          paystackAuthorizationCode: transaction.authorization?.authorization_code,
          receiptUrl: transaction.receipt_url,
          paymentMethod: transaction.channel,
          updatedAt: new Date(),
        },
      })
      console.log("[Payment] Payment updated to COMPLETED:", updatedPayment.id)

      const updatedUser = await tx.user.update({
        where: { id: payment.userId },
        data: {
          subscriptionTier: "PREMIUM",
          subscriptionStatus: "ACTIVE",
          billingCycle: payment.billingCycle,
          subscriptionStartDate: startDate,
          subscriptionEndDate: endDate,
          templatesLimit: 999999,
          updatedAt: new Date(),
        },
      })
      console.log("[Payment] User subscription updated:", updatedUser.id)

      const subscription = await tx.subscription.upsert({
        where: { userId: payment.userId },
        update: {
          tier: "PREMIUM",
          status: "ACTIVE",
          billingCycle: payment.billingCycle,
          paystackCustomerCode: transaction.customer?.customer_code || null,
          paystackSubscriptionCode: transaction.authorization?.authorization_code || null,
          paystackPlanCode: transaction.plan?.plan_code || null,
          currentPeriodStart: startDate,
          currentPeriodEnd: endDate,
          cancelAtPeriodEnd: false,
          updatedAt: new Date(),
        },
        create: {
          userId: payment.userId,
          tier: "PREMIUM",
          status: "ACTIVE",
          billingCycle: payment.billingCycle,
          paystackCustomerCode: transaction.customer?.customer_code || null,
          paystackSubscriptionCode: transaction.authorization?.authorization_code || null,
          paystackPlanCode: transaction.plan?.plan_code || null,
          currentPeriodStart: startDate,
          currentPeriodEnd: endDate,
          cancelAtPeriodEnd: false,
        },
      })
      console.log("[Payment] Subscription upserted:", subscription.id)

      return {
        payment: updatedPayment,
        user: updatedUser,
        subscription,
      }
    })

    console.log("[Payment] Transaction completed successfully")
    return NextResponse.json({
      success: true,
      message: "Payment verified and subscription activated",
      payment: {
        id: result.payment.id,
        status: result.payment.status,
        amount: result.payment.amount,
        currency: result.payment.currency,
      },
      subscription: {
        tier: result.subscription.tier,
        status: result.subscription.status,
        billingCycle: result.subscription.billingCycle,
        startDate: result.subscription.currentPeriodStart,
        endDate: result.subscription.currentPeriodEnd,
      },
      user: {
        subscriptionTier: result.user.subscriptionTier,
        subscriptionStatus: result.user.subscriptionStatus,
        templatesLimit: result.user.templatesLimit,
      }
    })

  } catch (error) {
    console.error("[Payment] Verify error:", error)
  
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "Duplicate payment processing detected" },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { 
          error: "Failed to verify payment",
          details: process.env.NODE_ENV === "development" ? error.message : undefined
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}