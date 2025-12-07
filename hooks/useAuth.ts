"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
interface User {
  id: string
  name: string
  email: string
  username: string
  subscriptionTier: "FREE" | "PREMIUM"
  subscriptionStatus: "ACTIVE" | "CANCELED" | "EXPIRED" | "TRIAL"
  billingCycle?: "MONTHLY" | "YEARLY" | null
  subscriptionEndDate?: string | null
  templatesLimit: number
  templatesUsed: number
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
    const router = useRouter()
  const normalizeUser = (data: any): User => ({
    id: data.userId || data.id,
    name: data.name || data.username || "",
    email: data.email || "",
    username: data.username || "",
    subscriptionTier: data.subscriptionTier || "FREE",
    subscriptionStatus: data.subscriptionStatus || "ACTIVE",
    billingCycle: data.billingCycle || null,
    subscriptionEndDate: data.subscriptionEndDate || null,
    templatesLimit: data.templatesLimit ?? 3,
    templatesUsed: data.templatesUsed ?? 0,
  })

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(normalizeUser(userData))
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("[Auth] /me failed:", error)
      setUser(null)
    }
  }, [])

  // Run once on mount
  useEffect(() => {
    const check = async () => {
      setLoading(true)
      await refreshUser()
      setLoading(false)
    }
    check()
  }, [refreshUser])

  const isPremium = user?.subscriptionTier === "PREMIUM"
  const canCreateTemplate = user ? user.templatesUsed < user.templatesLimit : false

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || "Login failed")
    }

    const data = await response.json()
    setUser(normalizeUser(data))
  }, [])

  const signup = useCallback(
    async (name: string, email: string, password: string, username: string) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, username }),
        credentials: "include",
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Signup failed")
      }

      const data = await response.json()
      setUser(normalizeUser(data))
    },
    []
  )

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    setUser(null)
      router.push("/login")
  }, [])

  return {
    user,
    loading,
    isPremium,
    canCreateTemplate,
    refreshUser,
    login,
    signup,
    logout,
  }
}
