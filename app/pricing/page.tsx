"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Check } from "lucide-react"

export default function PricingPage() {
  const features = [
    "Unlimited CV versions",
    "ATS-optimized templates",
    "Professional PDF export",
    "Cloud storage",
    "Mobile responsive",
    "Regular updates",
    "Email support",
    "No credit card required"
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <main className="flex-1">
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">Simple, Transparent Pricing</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to create professional resumes. Always free.
              </p>
            </div>

            <Card className="p-8 md:p-12 max-w-2xl mx-auto border-2 border-primary/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Free Forever</h2>
                <div className="mb-4">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-base text-muted-foreground">
                  Full access to all features, no hidden fees
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-base">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/signup" className="block">
                <Button size="lg" className="w-full text-base">
                  Get Started Free
                </Button>
              </Link>

              <p className="text-center text-sm text-muted-foreground mt-6">
                No credit card required • Cancel anytime • Free forever
              </p>
            </Card>

            <div className="mt-16 text-center">
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                We believe everyone deserves access to professional resume tools. That's why FolioSpace is completely free with no limits on the number of resumes you can create.
              </p>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}