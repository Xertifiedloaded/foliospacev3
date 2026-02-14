"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import RandomNotification from '../components/random-notification';
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
  Star,
  TrendingUp,
  Shield,
  Rocket,
  Users,
  Award,
} from "lucide-react"

export default function Home() {
  const { user } = useAuth()

  const features = [
    {
      icon: FileText,
      title: "Smart CV Builder",
      description:
        "Create CV versions tailored to different roles with our intuitive builder. Each template is ATS-optimized.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Download,
      title: "Professional Export",
      description:
        "Generate polished PDFs instantly with Times New Roman typography and perfect formatting that recruiters love.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Share2,
      title: "Seamless Sharing",
      description:
        "Share your CVs via direct links or download for job applications. Keep everything organized in one place.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Version Control",
      description:
        "Track updates, maintain multiple versions, and never lose your work. See when each CV was last modified.",
      gradient: "from-orange-500 to-red-500",
    },
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
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">

      <div className="fixed inset-0 -z-10">

        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" />
        

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-screen filter blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-screen filter blur-[128px] animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse-slowest" />
        

        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]" />
        

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
        @keyframes pulse-slowest {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 10s ease-in-out infinite;
        }
        .animate-pulse-slowest {
          animation: pulse-slowest 12s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <Navbar />

      <main className="flex-1">

        <section className="relative px-4 sm:px-6 py-16 sm:py-24 md:py-32 lg:py-40 overflow-hidden">

          <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              <div className="space-y-6 sm:space-y-8 lg:space-y-10">
   
                <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-full backdrop-blur-xl">
                  <div className="relative">
                    <Sparkles className="h-3 sm:h-4 w-3 sm:w-4 text-blue-400" />
                    <div className="absolute inset-0 bg-blue-400 blur-md opacity-50" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    AI-Powered Resume Builder
                  </span>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tighter">
                    <span className="block text-white">Land Your</span>
                    <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Dream Job
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-xl font-light">
                    Create stunning, ATS-optimized resumes in minutes. 
                    <span className="text-white font-medium"> Stand out from the crowd.</span>
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                  {user ? (
                    <Link href="/dashboard" className="group w-full sm:w-auto">
                      <Button 
                        size="lg" 
                        className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-10 h-12 sm:h-14 lg:h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl sm:rounded-2xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 border-0"
                      >
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/signup" className="group w-full sm:w-auto">
                        <Button 
                          size="lg" 
                          className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-10 h-12 sm:h-14 lg:h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl sm:rounded-2xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 border-0"
                        >
                          Start Building Free
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link href="#pricing" className="w-full sm:w-auto">
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-10 h-12 sm:h-14 lg:h-16 border-2 border-slate-700 bg-slate-900/50 hover:bg-slate-800/80 text-white backdrop-blur-xl rounded-xl sm:rounded-2xl font-semibold transition-all"
                        >
                          View Pricing
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

  
                <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8 pt-6 sm:pt-8 border-t border-slate-800">
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">5min</p>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-slate-400 font-medium">Build time</p>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">100%</p>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-slate-400 font-medium">ATS ready</p>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">10k+</p>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-slate-400 font-medium">Users</p>
                  </div>
                </div>
              </div>

     
              <div className="hidden lg:block relative">
                <div className="relative animate-float">
      
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20" />
                  
        
                  <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl rounded-3xl p-12 max-w-lg backdrop-blur-xl">
   
                    <div className="space-y-3 mb-8 pb-8 border-b border-slate-800">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Makinde Olaitan
                      </h2>
                      <p className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Full Stack Engineer
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-2">
                        <span className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                          📍 Abeokuta, Nigeria
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                          ✉️ foliospace@gmail.com
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-3 mb-8 pb-8 border-b border-slate-800">
                      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-3">
                        <div className="h-1 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                        Summary
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Full Stack Engineer with 5+ years building scalable web applications using React, Next.js, and
                        Node.js. Proven track record delivering high-impact solutions.
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="space-y-4 mb-8 pb-8 border-b border-slate-800">
                      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-3">
                        <div className="h-1 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                        Experience
                      </h3>
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-base font-semibold text-white">
                            Senior Full Stack Engineer
                          </p>
                          <span className="text-xs font-semibold text-blue-400 whitespace-nowrap bg-blue-500/10 px-3 py-1 rounded-lg">
                            2022 - Present
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">Foliospace, Abeokuta</p>
                        <ul className="text-sm text-slate-300 space-y-2 ml-5 list-disc marker:text-purple-400">
                          <li>Led SaaS platform serving 10K+ users</li>
                          <li>Improved performance by 50%</li>
                        </ul>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-3">
                        <div className="h-1 w-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {["React", "Node.js", "TypeScript", "AWS", "Docker"].map((skill) => (
                          <span
                            key={skill}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-semibold hover:scale-105 transition-transform cursor-default backdrop-blur-xl"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -bottom-8 -right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl px-6 py-4 shadow-2xl shadow-green-500/25">
                    <p className="text-sm font-bold flex items-center gap-2">
                      <Check className="h-5 w-5" /> ATS Optimized
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-4 sm:px-6 py-16 sm:py-24 md:py-32 lg:py-40 relative">
          <div className="max-w-7xl mx-auto">

            <div className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-full backdrop-blur-xl mx-auto">
                <Star className="h-3 sm:h-4 w-3 sm:w-4 text-purple-400" />
                <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Features
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight px-4">
                Everything you need
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto font-light px-4">
                Professional tools designed to help you stand out
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={idx}
                    className="group relative p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 transition-all duration-500 rounded-2xl sm:rounded-3xl overflow-hidden"
                  >
           
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <div className="relative flex items-start gap-4 sm:gap-6">
                      <div className={`shrink-0 h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                      </div>
                      <div className="space-y-2 sm:space-y-3 lg:space-y-4 flex-1">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section - Mobile Optimized */}
        <section id="pricing" className="px-4 sm:px-6 py-16 sm:py-24 md:py-32 lg:py-40 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />
          
          <div className="max-w-7xl mx-auto relative z-10">
       
            <div className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-full backdrop-blur-xl mx-auto">
                <Crown className="h-3 sm:h-4 w-3 sm:w-4 text-yellow-400" />
                <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Pricing
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight px-4">
                Choose your plan
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto font-light px-4">
                Start free, upgrade when you're ready
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, idx) => (
                <Card
                  key={idx}
                  className={`relative flex flex-col p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl transition-all duration-500 ${
                    plan.highlighted
                      ? "bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20 sm:scale-105 hover:scale-110"
                      : "bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 hover:scale-105"
                  }`}
                >
                  {/* Badge */}
                  {(plan.badge || plan.highlighted) && (
                    <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-xl flex items-center gap-1.5 sm:gap-2">
                        {plan.highlighted ? (
                          <>
                            <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Most Popular
                          </>
                        ) : (
                          <>
                            <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {plan.badge}
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  <div className="space-y-6 sm:space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-3 sm:space-y-4 pt-2 sm:pt-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{plan.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                          <span className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            {plan.price}
                          </span>
                          <span className="text-base sm:text-lg lg:text-xl text-slate-400 font-medium">{plan.period}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400">{plan.description}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 sm:space-y-4 flex-1">
                      {plan.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start gap-2 sm:gap-3">
                          <div className={`shrink-0 mt-0.5 sm:mt-1 ${feature.included ? "text-blue-400" : "text-slate-700"}`}>
                            {feature.included ? (
                              <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              </div>
                            ) : (
                              <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </div>
                          <span className={`text-xs sm:text-sm ${feature.included ? "text-slate-300 font-medium" : "text-slate-600"}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link href={plan.href} className="block">
                      <Button
                        className={`w-full h-12 sm:h-14 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 ${
                          plan.highlighted
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
                            : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                        }`}
                        variant="ghost"
                      >
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Mobile Optimized */}
        <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Content */}
              <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-full backdrop-blur-xl">
                  <Rocket className="h-3 sm:h-4 w-3 sm:w-4 text-pink-400" />
                  <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Why FolioSpace
                  </span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                  Trusted by thousands
                </h2>
                
                <p className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed font-light">
                  Join job seekers worldwide who are landing their dream roles with professionally crafted resumes.
                </p>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2 sm:pt-4">
                  {[
                    { label: "Success Rate", value: "98%", icon: Target, color: "from-blue-500 to-cyan-500" },
                    { label: "ATS Pass Rate", value: "100%", icon: Shield, color: "from-green-500 to-emerald-500" },
                    { label: "Time Saved", value: "2hrs", icon: Clock, color: "from-purple-500 to-pink-500" },
                    { label: "User Rating", value: "4.9★", icon: Award, color: "from-orange-500 to-red-500" },
                  ].map((stat, idx) => {
                    const Icon = stat.icon
                    return (
                      <Card key={idx} className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl sm:rounded-2xl transition-all hover:scale-105">
                        <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} mb-3 sm:mb-4`}>
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1 sm:mb-2">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</p>
                      </Card>
                    )
                  })}
                </div>
              </div>

    
              <Card className="p-8 sm:p-10 lg:p-12 bg-linear-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 border border-slate-800 rounded-2xl sm:rounded-3xl backdrop-blur-xl">
                <div className="space-y-8 sm:space-y-10">

                  <div className="flex items-center justify-between pb-6 sm:pb-8 border-b border-slate-800">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 mb-2 sm:mb-3 font-medium uppercase tracking-wider">Success Rate</p>
                      <p className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        98%
                      </p>
                    </div>
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                      <div className="absolute inset-0 rounded-full bg-linear-to-br from-blue-500 to-purple-500 blur-xl opacity-50" />
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Target className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <span className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">ATS Compatibility</span>
                        <span className="text-xl sm:text-2xl font-bold text-white">100%</span>
                      </div>
                      <div className="h-2 sm:h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: "100%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <span className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">User Satisfaction</span>
                        <span className="text-xl sm:text-2xl font-bold text-white">4.9/5</span>
                      </div>
                      <div className="h-2 sm:h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-linear-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: "98%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-32 lg:py-40 relative">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-950/20 to-transparent" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-full backdrop-blur-xl mx-auto">
                <Zap className="h-3 sm:h-4 w-3 sm:w-4 text-yellow-400" />
                <span className="text-xs sm:text-sm font-semibold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  How it Works
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight px-4">
                Three simple steps
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto font-light px-4">
                From signup to download in minutes
              </p>
            </div>


            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  step: "1",
                  title: "Sign Up",
                  description: "Create your free account and get instant access to our CV builder.",
                  icon: Sparkles,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  step: "2",
                  title: "Build",
                  description: "Add your experience, skills, and education with our intuitive editor.",
                  icon: FileText,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  step: "3",
                  title: "Export",
                  description: "Download your professional PDF and start applying immediately.",
                  icon: Download,
                  color: "from-green-500 to-emerald-500",
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <Card
                    key={idx}
                    className="relative p-6 sm:p-8 lg:p-10 text-center bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl sm:rounded-3xl transition-all duration-500 hover:scale-105 group overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <div className="relative space-y-4 sm:space-y-6">

                      <div className={`inline-flex items-center justify-center h-16 w-16 sm:h-18 sm:w-18 lg:h-20 lg:w-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} text-white font-black text-2xl sm:text-3xl shadow-2xl mx-auto`}>
                        {item.step}
                      </div>
                      
                      {/* Icon */}
                      <div className="flex justify-center">
                        <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{item.title}</h3>
                      <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

      
        <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-32 lg:py-40">
          <div className="max-w-5xl mx-auto">
            <Card className="relative overflow-hidden border-0 shadow-2xl rounded-2xl sm:rounded-3xl">
    
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
              

              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slower" />
              </div>

              <div className="relative z-10 p-8 sm:p-12 md:p-16 lg:p-24 text-center text-white space-y-6 sm:space-y-8 lg:space-y-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight px-2">
                  Ready to land your dream job?
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-95 max-w-2xl mx-auto font-light px-2">
                  Join thousands who've successfully landed interviews with our professional resume builder
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6">
                  {user ? (
                    <Link href="/dashboard" className="group w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base px-8 sm:px-10 h-12 sm:h-14 lg:h-16 bg-white text-purple-600 hover:bg-slate-100 font-semibold rounded-xl sm:rounded-2xl shadow-2xl hover:scale-105 transition-all">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/signup" className="group w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base px-8 sm:px-10 h-12 sm:h-14 lg:h-16 bg-white text-purple-600 hover:bg-slate-100 font-semibold rounded-xl sm:rounded-2xl shadow-2xl hover:scale-105 transition-all">
                          Get Started Free
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link href="#pricing" className="w-full sm:w-auto">
                        <Button
                          size="lg"
                          className="w-full sm:w-auto text-sm sm:text-base px-8 sm:px-10 h-12 sm:h-14 lg:h-16 bg-white/10 border-2 border-white text-white hover:bg-white hover:text-purple-600 backdrop-blur-xl rounded-xl sm:rounded-2xl font-semibold transition-all hover:scale-105"
                        >
                          View Plans
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 pt-4 sm:pt-6 text-xs sm:text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <span>3 free CVs included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
<RandomNotification/>
      <Footer />
    </div>
  )
}