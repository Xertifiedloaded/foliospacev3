"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { FileText, Download, Share2, BarChart3, CheckCircle2, ArrowRight, Sparkles, Target, Zap } from "lucide-react"

export default function Home() {
  const { user } = useAuth()

  const features = [
    {
      icon: FileText,
      title: "Smart CV Builder",
      description: "Create unlimited CV versions tailored to different roles with our intuitive builder. Each template is ATS-optimized.",
    },
    {
      icon: Download,
      title: "Professional Export",
      description: "Generate polished PDFs instantly with Times New Roman typography and perfect formatting that recruiters love.",
    },
    {
      icon: Share2,
      title: "Seamless Sharing",
      description: "Share your CVs via direct links or download for job applications. Keep everything organized in one place.",
    },
    {
      icon: BarChart3,
      title: "Version Control",
      description: "Track updates, maintain multiple versions, and never lose your work. See when each CV was last modified.",
    },
  ]

  const benefits = [
    "ATS-friendly templates that pass automated screening",
    "Professional formatting with Times New Roman font",
    "Unlimited CV versions for different job applications",
    "One-click PDF export with perfect formatting",
    "Secure cloud storage for all your CVs",
    "Mobile-responsive design for on-the-go editing",
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 lg:py-40 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>Professional CV Management Platform</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Craft Your
                  <span className="block text-primary mt-2">Perfect Resume</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Build impressive, ATS-optimized CVs that get you noticed. Manage multiple versions, export professional PDFs, and land your dream job faster.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {user ? (
                    <Link href="/dashboard">
                      <Button size="lg" className="w-full sm:w-auto group">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/signup" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full group">
                          Start Building Free
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link href="/login" className="w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-semibold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">Join thousands of professionals</p>
                    <p className="text-muted-foreground">who landed their dream jobs</p>
                  </div>
                </div>
              </div>
              
              {/* Visual Element */}
              <div className="hidden lg:block relative">
                <div className="relative bg-card border rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-primary/20 rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                    <div className="space-y-2 pt-4">
                      <div className="h-3 w-full bg-muted rounded" />
                      <div className="h-3 w-5/6 bg-muted rounded" />
                      <div className="h-3 w-4/6 bg-muted rounded" />
                    </div>
                    <div className="pt-4 space-y-2">
                      <div className="h-3 w-full bg-muted rounded" />
                      <div className="h-3 w-3/4 bg-muted rounded" />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-primary/10 backdrop-blur-sm border rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">ATS Optimized</p>
                      <p className="text-xs text-muted-foreground">100% Pass Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-24 bg-secondary/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Target className="h-4 w-4" />
                <span>Powerful Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Professional tools designed to help you create standout CVs that get results
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <Card key={idx} className="group p-8 hover:shadow-xl transition-all hover:scale-105 duration-300 border-2 hover:border-primary/20">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  <span>Why Choose FolioSpace</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Stand Out From The Competition
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our platform is built with one goal: helping you create professional CVs that get past automated systems and impress hiring managers.
                </p>
                <div className="space-y-4 pt-4">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-3xl font-bold">98%</p>
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
                      <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-muted-foreground">User Satisfaction</span>
                      <span className="font-semibold">4.9/5.0</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="px-6 py-24 bg-secondary/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Simple 3-Step Process</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get started in minutes and have your professional CV ready in no time
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection lines for desktop */}
              <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-border" />
              
              {[
                {
                  step: "1",
                  title: "Sign Up Free",
                  description: "Create your account in seconds. No credit card required. Start building immediately.",
                  icon: Sparkles,
                },
                {
                  step: "2",
                  title: "Build Your CV",
                  description: "Use our intuitive builder to add your experience, education, skills, and projects. Customize for each role.",
                  icon: FileText,
                },
                {
                  step: "3",
                  title: "Export & Apply",
                  description: "Download professional PDFs with perfect formatting. Apply with confidence to any opportunity.",
                  icon: Download,
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="relative">
                    <Card className="p-8 text-center hover:shadow-xl transition-all hover:scale-105 duration-300 bg-card relative z-10">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-6 shadow-lg">
                        {item.step}
                      </div>
                      <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden p-12 md:p-16 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground text-center border-0 shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Ready to Land Your Dream Job?
                </h2>
                <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                  Join thousands of professionals who've transformed their careers with FolioSpace. Create your first CV today and take control of your future.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  {user ? (
                    <Link href="/dashboard">
                      <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 group">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/signup" className="w-full sm:w-auto">
                        <Button size="lg" variant="secondary" className="w-full text-lg px-8 group">
                          Get Started Free
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link href="/login" className="w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="w-full text-lg px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                          Sign In
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
                <p className="text-sm opacity-75 pt-4">
                  No credit card required • Free forever • Cancel anytime
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