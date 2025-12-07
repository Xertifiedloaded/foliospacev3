import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-middleware"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PRICING = {
  MONTHLY: {
    amount: 300000, 
    planCode: process.env.PAYSTACK_MONTHLY_PLAN_CODE,
  },
  YEARLY: {
    amount: 3600000, 
    planCode: process.env.PAYSTACK_YEARLY_PLAN_CODE,
  },
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { billingCycle } = await request.json()

    if (!billingCycle || !["MONTHLY", "YEARLY"].includes(billingCycle)) {
      return NextResponse.json({ error: "Invalid billing cycle" }, { status: 400 })
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { email: true, name: true, subscriptionTier: true },
    })

    if (!userDetails) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (userDetails.subscriptionTier === "PREMIUM") {
      return NextResponse.json({ error: "Already subscribed to Premium" }, { status: 400 })
    }

    const pricing = PRICING[billingCycle as keyof typeof PRICING]
    const reference = `cv_${user.userId}_${Date.now()}`

    await prisma.payment.create({
      data: {
        userId: user.userId,
        amount: pricing.amount / 100, 
        currency: "NGN",
        status: "PENDING",
        paystackReference: reference,
        subscriptionTier: "PREMIUM",
        billingCycle: billingCycle,
        description: `Premium Subscription - ${billingCycle}`,
      },
    })


    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userDetails.email,
        amount: pricing.amount,
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        metadata: {
          userId: user.userId,
          billingCycle,
          custom_fields: [
            {
              display_name: "User Name",
              variable_name: "user_name",
              value: userDetails.name,
            },
            {
              display_name: "Plan",
              variable_name: "plan",
              value: `Premium ${billingCycle}`,
            },
          ],
        },
      }),
    })

    const data = await response.json()

    if (!data.status) {
      console.error("[Payment] Paystack error:", data)
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
    }

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    })
  } catch (error) {
    console.error("[Payment] Initialize error:", error)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}
