"use client"

import { useState } from "react"
import { Check, Crown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY")
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingCycle }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to initialize payment")
        return
      }

      window.location.href = data.authorizationUrl
    } catch (error) {
      console.error("Payment error:", error)
      alert("Failed to start payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const pricing = {
    MONTHLY: { price: "₦2,999", period: "/month" },
    YEARLY: { price: "₦29,999", period: "/year", savings: "Save ₦5,989" },
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-black py-16 px-4 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Upgrade to <span className="text-amber-400">Premium</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Unlock unlimited CV downloads, premium templates, and more features to supercharge your job search.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 inline-flex border border-gray-700">
            <button
              onClick={() => setBillingCycle("MONTHLY")}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-all",
                billingCycle === "MONTHLY"
                  ? "bg-gray-900 text-white shadow"
                  : "text-gray-300 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("YEARLY")}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-all",
                billingCycle === "YEARLY"
                  ? "bg-gray-900 text-white shadow"
                  : "text-gray-300 hover:text-white"
              )}
            >
              Yearly
            </button>
          </div>

          {billingCycle === "YEARLY" && (
            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/40 text-green-300">
              {pricing.YEARLY.savings}
            </span>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="p-6 border-2 border-gray-700 bg-gray-900/60 backdrop-blur">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Free</h3>
              <p className="text-gray-400 mt-1">Get started with basics</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₦0</span>
              <span className="text-gray-400">/forever</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Download first 3 CVs
              </li>

              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                3 free templates
              </li>

              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Basic support
              </li>
            </ul>

            <Button variant="outline" className="w-full bg-transparent border-gray-600 text-gray-400" disabled>
              Current Plan
            </Button>
          </Card>

          <Card className="p-6 border-2 border-amber-500 bg-gray-900/70 backdrop-blur relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-600 text-white px-4 py-1 text-sm font-medium">
              Popular
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Premium</h3>
              </div>
              <p className="text-gray-400 mt-1">Everything you need</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">{pricing[billingCycle].price}</span>
              <span className="text-gray-400">{pricing[billingCycle].period}</span>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Unlimited CV downloads",
                "All premium templates",
                "Change templates anytime",
                "Priority support",
                "Early access to new features",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-green-400" />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </>
              )}
            </Button>
          </Card>
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Secure payment powered by Paystack. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
