"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import {
  FileText,
  Download,
  Share2,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Clock,
  Crown,
  Check,
  X,
} from "lucide-react"

export default function Home() {
  const { user } = useAuth()

  const features = [
    {
      icon: FileText,
      title: "Smart CV Builder",
      description:
        "Create CV versions tailored to different roles with our intuitive builder. Each template is ATS-optimized.",
    },
    {
      icon: Download,
      title: "Professional Export",
      description:
        "Generate polished PDFs instantly with Times New Roman typography and perfect formatting that recruiters love.",
    },
    {
      icon: Share2,
      title: "Seamless Sharing",
      description:
        "Share your CVs via direct links or download for job applications. Keep everything organized in one place.",
    },
    {
      icon: BarChart3,
      title: "Version Control",
      description:
        "Track updates, maintain multiple versions, and never lose your work. See when each CV was last modified.",
    },
  ]

  const benefits = [
    "ATS-friendly templates that pass automated screening",
    "Professional formatting with Times New Roman font",
    "Multiple CV versions for different job applications",
    "One-click PDF export with perfect formatting",
    "Secure cloud storage for all your CVs",
    "Mobile-responsive design for on-the-go editing",
  ]

  const pricingPlans = [
    {
      name: "Free",
      price: "₦0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        { text: "Create up to 3 CVs", included: true },
        { text: "Download up to 3 CVs", included: true },
        { text: "Default template only", included: true },
        { text: "ATS-optimized format", included: true },
        { text: "Premium templates", included: false },
        { text: "Unlimited CVs", included: false },
        { text: "Template customization", included: false },
      ],
      cta: "Get Started",
      href: "/signup",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "₦2,999",
      period: "/month",
      description: "For serious job seekers",
      features: [
        { text: "Unlimited CV creation", included: true },
        { text: "Unlimited downloads", included: true },
        { text: "All premium templates", included: true },
        { text: "ATS-optimized format", included: true },
        { text: "Template customization", included: true },
        { text: "Priority support", included: true },
        { text: "Early access to new features", included: true },
      ],
      cta: "Upgrade to Pro",
      href: "/signup?plan=pro",
      highlighted: true,
    },
    {
      name: "Pro Yearly",
      price: "₦29,999",
      period: "/year",
      description: "Best value - Save 20%",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "2 months free", included: true },
        { text: "Unlimited CV creation", included: true },
        { text: "All premium templates", included: true },
        { text: "Template customization", included: true },
        { text: "Priority support", included: true },
        { text: "Early access to new features", included: true },
      ],
      cta: "Get Pro Yearly",
      href: "/signup?plan=pro-yearly",
      highlighted: false,
      badge: "Best Value",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="relative px-6 py-20 md:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                    Create your
                    <span className="block text-primary">standout resume</span>
                  </h1>

                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                    Build professional resumes that get past ATS systems and impress recruiters. Simple, fast, and
                    effective.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {user ? (
                    <Link href="/dashboard">
                      <Button size="lg" className="w-full sm:w-auto text-base px-8 h-12 group">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/signup" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full text-base px-8 h-12 group">
                          Start Building
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link href="#pricing" className="w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="w-full text-base px-8 h-12 bg-transparent">
                          View Pricing
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-8 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">5 minutes</p>
                      <p className="text-xs text-muted-foreground">to create</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">ATS-friendly</p>
                      <p className="text-xs text-muted-foreground">100% compatible</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">3 Free CVs</p>
                      <p className="text-xs text-muted-foreground">To get started</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <div className="relative">
                  <div className="absolute -inset-4 bg-linear-to-r from-primary/20 to-primary/5 rounded-2xl blur-2xl" />
                  <div className="relative bg-white dark:bg-gray-950 border shadow-2xl rounded-xl p-10 max-w-lg">
                    <div className="space-y-2 mb-6 pb-6 border-b-2 border-gray-200 dark:border-gray-800">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Makinde Olaitan</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Full Stack Engineer</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 pt-1">
                        <span>Abeokuta, Nigeria</span>
                        <span>•</span>
                        <span>makindeolaitan01@email.com</span>
                      </div>
                    </div>


                    <div className="space-y-2 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                        Summary
                      </h3>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        Full Stack Engineer with 5+ years building scalable web applications using React, Next.js, and
                        Node.js. Proven track record delivering high-impact solutions.
                      </p>
                    </div>
                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                        Experience
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              Senior Full Stack Engineer
                            </p>
                            <span className="text-xs text-gray-500 whitespace-nowrap">2022 - Present</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Foliospace, Abeokuta</p>
                          <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-0.5 ml-4 list-disc">
                            <li>Led SaaS platform serving 10K+ users</li>
                            <li>Improved performance by 50%</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium">
                          React
                        </span>
                        <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium">
                          Node.js
                        </span>
                        <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium">
                          TypeScript
                        </span>
                        <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium">
                          AWS
                        </span>
                        <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium">
                          Docker
                        </span>
                      </div>
                    </div>
                  </div>

          
                  <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-lg px-4 py-2 shadow-lg">
                    <p className="text-sm font-semibold flex items-center gap-1">
                      <Check className="h-4 w-4" /> ATS Optimized
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-20 md:py-28 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Everything you need</h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Professional tools to create standout resumes that get results
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <Card key={idx} className="p-8 hover:shadow-lg transition-shadow bg-card">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-6 py-20 md:py-28">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Simple, transparent pricing</h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Start free with 3 CVs, upgrade when you need more
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, idx) => (
                <Card
                  key={idx}
                  className={`p-8 relative flex flex-col ${
                    plan.highlighted ? "border-2 border-primary shadow-xl scale-105" : "bg-card"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <Crown className="h-3 w-3" /> Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-primary shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/50 shrink-0" />
                        )}
                        <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href} className="mt-auto">
                    <Button className="w-full" variant={plan.highlighted ? "default" : "outline"} size="lg">
                      {plan.cta}
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Why choose FolioSpace</h2>
                <p className="text-base text-muted-foreground">
                  Built to help you create professional resumes that get past ATS systems and impress hiring managers.
                </p>
                <div className="space-y-4 pt-4">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                      <p className="text-base text-muted-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="p-8 bg-linear-to-br from-primary/5 to-primary/10 border-2">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-4xl font-bold">98%</p>
                    </div>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ATS Compatibility</span>
                      <span className="font-semibold">100%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "100%" }} />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-muted-foreground">User Satisfaction</span>
                      <span className="font-semibold">4.9/5.0</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "98%" }} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Create your professional resume in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Sign Up",
                  description: "Create your account and get 3 free CV downloads to start.",
                  icon: Sparkles,
                },
                {
                  step: "2",
                  title: "Build",
                  description: "Add your experience, education, and skills using our intuitive builder.",
                  icon: FileText,
                },
                {
                  step: "3",
                  title: "Export",
                  description: "Download your professional PDF and start applying to jobs.",
                  icon: Download,
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <Card key={idx} className="p-8 text-center hover:shadow-lg transition-shadow bg-card">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-6">
                      {item.step}
                    </div>
                    <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{item.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden p-12 md:p-16 bg-linear-to-br from-primary to-primary/90 text-primary-foreground text-center border-0 shadow-xl">
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Start building your resume today</h2>
                <p className="text-base opacity-95 max-w-2xl mx-auto">
                  Join thousands of job seekers who've landed their dream roles with FolioSpace
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  {user ? (
                    <Link href="/dashboard">
                      <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base px-8 h-12 group">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/signup" className="w-full sm:w-auto">
                        <Button size="lg" variant="secondary" className="w-full text-base px-8 h-12 group">
                          Get Started
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link href="#pricing" className="w-full sm:w-auto">
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full text-base px-8 h-12 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                        >
                          View Plans
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
                <p className="text-sm opacity-90 pt-2">
                  3 free CVs included • No credit card required • Upgrade anytime
                </p>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
