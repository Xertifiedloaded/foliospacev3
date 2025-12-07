import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-paystack-signature")

    const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY).update(body).digest("hex")

    if (hash !== signature) {
      console.error("[Webhook] Invalid signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)
    console.log("[Webhook] Event received:", event.event)

    switch (event.event) {
      case "charge.success":
        await handleChargeSuccess(event.data)
        break

      case "subscription.create":
        await handleSubscriptionCreate(event.data)
        break

      case "subscription.disable":
      case "subscription.not_renew":
        await handleSubscriptionCancel(event.data)
        break

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data)
        break

      default:
        console.log("[Webhook] Unhandled event:", event.event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[Webhook] Error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleChargeSuccess(data: any) {
  const reference = data.reference
  const payment = await prisma.payment.findFirst({
    where: { paystackReference: reference },
  })

  if (!payment || payment.status === "COMPLETED") {
    return
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
      paystackAuthorizationCode: data.authorization?.authorization_code,
    },
  })

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
}

async function handleSubscriptionCreate(data: any) {
  const customerCode = data.customer?.customer_code

  if (!customerCode) return

  const subscription = await prisma.subscription.findFirst({
    where: { paystackCustomerCode: customerCode },
  })

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        paystackSubscriptionCode: data.subscription_code,
        paystackPlanCode: data.plan?.plan_code,
        status: "ACTIVE",
      },
    })
  }
}

async function handleSubscriptionCancel(data: any) {
  const subscriptionCode = data.subscription_code

  if (!subscriptionCode) return

  const subscription = await prisma.subscription.findFirst({
    where: { paystackSubscriptionCode: subscriptionCode },
  })

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "CANCELED",
        cancelAtPeriodEnd: true,
      },
    })
    await prisma.user.update({
      where: { id: subscription.userId },
      data: {
        subscriptionStatus: "CANCELED",
      },
    })
  }
}

async function handlePaymentFailed(data: any) {
  const customerCode = data.customer?.customer_code

  if (!customerCode) return

  const subscription = await prisma.subscription.findFirst({
    where: { paystackCustomerCode: customerCode },
  })

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "EXPIRED" },
    })

    await prisma.user.update({
      where: { id: subscription.userId },
      data: {
        subscriptionTier: "FREE",
        subscriptionStatus: "EXPIRED",
        templatesLimit: 3,
      },
    })
  }
}
