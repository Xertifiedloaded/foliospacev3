import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-middleware"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 })
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    })

    const data = await response.json()

    if (!data.status) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 })
    }

    const transaction = data.data

    if (transaction.status !== "success") {
      await prisma.payment.updateMany({
        where: { paystackReference: reference },
        data: { status: "FAILED" },
      })

      return NextResponse.json({ error: "Payment was not successful" }, { status: 400 })
    }
    const payment = await prisma.payment.findFirst({
      where: { paystackReference: reference },
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 })
    }

    if (payment.status === "COMPLETED") {
      return NextResponse.json({ message: "Payment already processed", alreadyProcessed: true })
    }

    const now = new Date()
    const endDate = new Date(now)
    if (payment.billingCycle === "MONTHLY") {
      endDate.setMonth(endDate.getMonth() + 1)
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        paystackAuthorizationCode: transaction.authorization?.authorization_code,
        receiptUrl: transaction.receipt_url,
      },
    })

    // Update user subscription
    await prisma.user.update({
      where: { id: payment.userId },
      data: {
        subscriptionTier: "PREMIUM",
        subscriptionStatus: "ACTIVE",
        billingCycle: payment.billingCycle,
        subscriptionStartDate: now,
        subscriptionEndDate: endDate,
        templatesLimit: 999999, 
      },
    })

    await prisma.subscription.upsert({
      where: { userId: payment.userId },
      update: {
        tier: "PREMIUM",
        status: "ACTIVE",
        billingCycle: payment.billingCycle,
        paystackCustomerCode: transaction.customer?.customer_code,
        paystackSubscriptionCode: transaction.authorization?.authorization_code,
        currentPeriodStart: now,
        currentPeriodEnd: endDate,
      },
      create: {
        userId: payment.userId,
        tier: "PREMIUM",
        status: "ACTIVE",
        billingCycle: payment.billingCycle,
        paystackCustomerCode: transaction.customer?.customer_code,
        paystackSubscriptionCode: transaction.authorization?.authorization_code,
        currentPeriodStart: now,
        currentPeriodEnd: endDate,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Payment verified and subscription activated",
      subscription: {
        tier: "PREMIUM",
        billingCycle: payment.billingCycle,
        endDate,
      },
    })
  } catch (error) {
    console.error("[Payment] Verify error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
