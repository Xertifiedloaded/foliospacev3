"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Crown, BadgeCheck, CreditCard, CalendarClock, Layers, FileText, Sparkles } from "lucide-react"
import { CVCard } from "@/components/cv/cv-card"

interface CV {
  id: string
  title: string
  updatedAt: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [cvs, setCVs] = useState<CV[]>([])
  const [cvLoading, setCVLoading] = useState(true)
  const [newCVTitle, setNewCVTitle] = useState("")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) fetchCVs()
  }, [user])

  const fetchCVs = async () => {
    try {
      const response = await fetch("/api/cvs")
      if (response.ok) {
        setCVs(await response.json())
      }
    } catch (error) {
      console.error("Failed to fetch CVs:", error)
    } finally {
      setCVLoading(false)
    }
  }

  const handleCreateCV = async () => {
    if (!newCVTitle.trim()) return

    setCreating(true)
    try {
      const response = await fetch("/api/cvs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newCVTitle }),
      })

      if (response.ok) {
        const newCV = await response.json()
        setCVs([newCV, ...cvs])
        setNewCVTitle("")
        router.push(`/cv/${newCV.id}/edit`)
      }
    } catch (error) {
      console.error("Failed to create CV:", error)
    } finally {
      setCreating(false)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const base = await (await fetch(`/api/cvs/${id}`)).json()
      const newCVRes = await fetch("/api/cvs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `${base.title} (Copy)` }),
      })

      if (newCVRes.ok) {
        const newCV = await newCVRes.json()

        await fetch(`/api/cvs/${newCV.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(base),
        })

        fetchCVs()
      }
    } catch (error) {
      console.error("Failed to duplicate CV:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return

    try {
      const res = await fetch(`/api/cvs/${id}`, { method: "DELETE" })
      if (res.ok) setCVs(cvs.filter((cv) => cv.id !== id))
    } catch (error) {
      console.error("Failed to delete CV:", error)
    }
  }

  const handleExport = async (id: string) => {
    try {
      const response = await fetch(`/api/cvs/${id}/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download =
          response.headers
            .get("content-disposition")
            ?.split("filename=")[1]
            ?.replace(/"/g, "") || "cv.pdf"
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Failed to export CV:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="mb-8 sm:mb-12">
            <Skeleton className="h-6 sm:h-8 w-36 sm:w-48 mb-4 sm:mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-3 sm:p-5">
                    <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 mb-2 sm:mb-3" />
                    <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-8 sm:mb-12">
            <Skeleton className="h-6 sm:h-8 w-28 sm:w-32 mb-4 sm:mb-6" />
            <Card className="border-2 border-dashed">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Skeleton className="h-10 sm:h-12 flex-1" />
                  <Skeleton className="h-10 sm:h-12 w-full sm:w-32 md:w-40" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Skeleton className="h-6 sm:h-8 w-28 sm:w-32 mb-4 sm:mb-6" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 sm:h-24 md:h-28 w-full" />
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        
        <section className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            <div className="h-6 sm:h-8 w-0.5 sm:w-1 bg-primary rounded-full" />
            Account Overview
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <Card className="border-border/50 hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                    <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Tier</p>
                <p className="text-sm sm:text-base md:text-lg font-bold">{user.subscriptionTier}</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
                    <BadgeCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Status</p>
                <p className="text-sm sm:text-base md:text-lg font-bold capitalize">{user.subscriptionStatus}</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10">
                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Billing</p>
                <p className="text-sm sm:text-base md:text-lg font-bold capitalize">{user.billingCycle || "N/A"}</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10">
                    <CalendarClock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Expires</p>
                <p className="text-sm sm:text-base md:text-lg font-bold">
                  {user.subscriptionEndDate
                    ? new Date(user.subscriptionEndDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </CardContent>
            </Card>


            <Card className="border-border/50 hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-teal-500/10">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-teal-600" />
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Total CVs</p>
                <p className="text-sm sm:text-base md:text-lg font-bold">{cvs.length}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Create New CV Section */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            <div className="h-6 sm:h-8 w-0.5 sm:w-1 bg-primary rounded-full" />
            Create New CV
          </h2>
          
          <Card className="border-2 border-dashed border-primary/30 bg-primary/5 hover:border-primary/50 transition-all">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Sparkles className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter CV title (e.g., Software Engineer)"
                      value={newCVTitle}
                      onChange={(e) => setNewCVTitle(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors text-sm sm:text-base"
                      onKeyDown={(e) => e.key === "Enter" && handleCreateCV()}
                      disabled={creating}
                    />
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 h-10 sm:h-11 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
                  onClick={handleCreateCV}
                  disabled={!newCVTitle.trim() || creating}
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  {creating ? "Creating..." : "Create CV"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
              <div className="h-6 sm:h-8 w-0.5 sm:w-1 bg-primary rounded-full" />
              Your CVs
            </h2>
            {cvs.length > 0 && (
              <span className="text-xs sm:text-sm text-muted-foreground">
                {cvs.length} {cvs.length === 1 ? "CV" : "CVs"}
              </span>
            )}
          </div>

          {cvLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 sm:h-24 md:h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : cvs.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="p-8 sm:p-10 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
                  <FileText className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2">No CVs yet</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-5 md:mb-6">
                  Create your first CV to get started on your career journey
                </p>
                <Button
                  onClick={() => document.querySelector('input[type="text"]')?.focus()}
                  variant="outline"
                  className="text-sm sm:text-base"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {cvs.map((cv) => (
                <CVCard
                  key={cv.id}
                  id={cv.id}
                  title={cv.title}
                  updatedAt={cv.updatedAt}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onExport={handleExport}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}