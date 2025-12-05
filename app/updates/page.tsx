import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Bug, ArrowUpCircle } from "lucide-react"

export default function UpdatesPage() {
  const updates = [
    {
      version: "2.1.0",
      date: "December 2024",
      type: "feature",
      icon: Sparkles,
      title: "New Template Options",
      description: "Added three new professional templates optimized for different industries including tech, creative, and corporate sectors.",
      changes: [
        "Modern template with accent colors",
        "Minimalist single-column layout",
        "Executive format for senior roles"
      ]
    },
    {
      version: "2.0.5",
      date: "November 2024",
      type: "improvement",
      icon: ArrowUpCircle,
      title: "Performance Enhancements",
      description: "Improved PDF generation speed and overall application performance.",
      changes: [
        "50% faster PDF export",
        "Reduced page load times",
        "Optimized cloud storage sync"
      ]
    },
    {
      version: "2.0.0",
      date: "October 2024",
      type: "feature",
      icon: Zap,
      title: "Major Platform Update",
      description: "Complete redesign with enhanced features and better user experience.",
      changes: [
        "New modern interface",
        "Improved mobile experience",
        "Enhanced ATS optimization",
        "Real-time preview updates"
      ]
    },
    {
      version: "1.9.2",
      date: "September 2024",
      type: "bugfix",
      icon: Bug,
      title: "Bug Fixes & Stability",
      description: "Addressed various issues and improved overall stability.",
      changes: [
        "Fixed PDF formatting issues",
        "Resolved login problems",
        "Improved error handling"
      ]
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "improvement":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "bugfix":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">Product Updates</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stay up to date with new features, improvements, and fixes
              </p>
            </div>

            <div className="space-y-8">
              {updates.map((update, idx) => {
                const Icon = update.icon
                return (
                  <Card key={idx} className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="outline" className={getTypeColor(update.type)}>
                            {update.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">v{update.version}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{update.date}</span>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold mb-2">{update.title}</h3>
                          <p className="text-base text-muted-foreground">{update.description}</p>
                        </div>

                        <ul className="space-y-2">
                          {update.changes.map((change, changeIdx) => (
                            <li key={changeIdx} className="flex items-start gap-2 text-base text-muted-foreground">
                              <span className="text-primary mt-1">•</span>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="mt-12 text-center">
              <p className="text-base text-muted-foreground">
                Want to suggest a feature or report a bug? <a href="/contact" className="text-primary hover:underline">Contact us</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}