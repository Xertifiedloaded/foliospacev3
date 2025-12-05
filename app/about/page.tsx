import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Target, Users, Zap, Heart } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To empower job seekers with professional tools that help them stand out in competitive job markets."
    },
    {
      icon: Users,
      title: "Our Team",
      description: "A passionate group of developers and career experts dedicated to simplifying the job application process."
    },
    {
      icon: Zap,
      title: "Our Approach",
      description: "We believe in creating simple, effective tools that deliver real results without unnecessary complexity."
    },
    {
      icon: Heart,
      title: "Our Values",
      description: "User-focused design, accessibility for all, and continuous improvement based on real feedback."
    }
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">About FolioSpace</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're on a mission to help job seekers create professional resumes that open doors to new opportunities.
              </p>
            </div>

            <div className="prose prose-lg max-w-none mb-16">
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                FolioSpace was created to solve a common problem: creating multiple versions of your resume for different job applications is time-consuming and frustrating. We built a platform that makes it easy to maintain, customize, and export professional resumes that get results.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Whether you're a recent graduate, career changer, or seasoned professional, our tools help you present your best self to potential employers. Every template is ATS-optimized to ensure your resume gets past automated screening systems and into the hands of real decision-makers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, idx) => {
                const Icon = value.icon
                return (
                  <Card key={idx} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{value.title}</h3>
                        <p className="text-base text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}