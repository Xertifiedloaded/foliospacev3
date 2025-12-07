"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Clock, Download ,Crown, BadgeCheck, CreditCard, CalendarClock, Layers, FileText} from "lucide-react"
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
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full sm:w-32" />
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">

  <Card>
    <CardContent className="p-3">
      <div className="flex items-center gap-3">
        <Crown className="h-4 w-4 text-primary" />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Tier</p>
          <p className="text-sm font-bold">{user.subscriptionTier}</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-3">
      <div className="flex items-center gap-3">
        <BadgeCheck className="h-4 w-4 text-primary" />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Status</p>
          <p className="text-sm font-bold">{user.subscriptionStatus}</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-3">
      <div className="flex items-center gap-3">
        <CreditCard className="h-4 w-4 text-primary" />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Billing</p>
          <p className="text-sm font-bold">{user.billingCycle || "N/A"}</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-3">
      <div className="flex items-center gap-3">
        <CalendarClock className="h-4 w-4 text-primary" />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Expires</p>
          <p className="text-sm font-bold">
            {user.subscriptionEndDate
              ? new Date(user.subscriptionEndDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-3">
      <div className="flex items-center gap-3">
        <Layers className="h-4 w-4 text-primary" />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Templates</p>
          <p className="text-sm font-bold">
            {user.templatesUsed}/{user.templatesLimit}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-3">
      <div className="flex items-center gap-3">
        <FileText className="h-4 w-4 text-primary" />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total CVs</p>
          <p className="text-sm font-bold">{cvs.length}</p>
        </div>
      </div>
    </CardContent>
  </Card>

</div>





        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="CV Title (e.g., Software Engineer)"
              value={newCVTitle}
              onChange={(e) => setNewCVTitle(e.target.value)}
              className="w-full placeholder:text-sm text-base px-4 py-2 rounded-lg border bg-background"
              onKeyDown={(e) => e.key === "Enter" && handleCreateCV()}
              disabled={creating}
            />

            <Button
              className="w-full sm:w-auto"
              onClick={handleCreateCV}
              disabled={!newCVTitle.trim() || creating}
            >
              <Plus className="h-4 w-4 mr-2" /> Create CV
            </Button>
          </div>
        </div>

        {cvLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : cvs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No CVs yet. Create one!</p>
          </div>
        ) : (
          <div className="">
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
      </main>
    </div>
  )
}