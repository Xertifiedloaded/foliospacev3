"use client"

import { useState, useEffect, useCallback } from "react"

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

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me")
      console.log("[Auth] Response status:", response.status)
      
      if (response.ok) {
        const userData = await response.json()
    
        
        const processedUser = {
          id: userData.userId || userData.id,
          name: userData.name || userData.username,
          email: userData.email,
          username: userData.username,
          subscriptionTier: userData.subscriptionTier || "FREE",
          subscriptionStatus: userData.subscriptionStatus || "ACTIVE",
          billingCycle: userData.billingCycle || null,
          subscriptionEndDate: userData.subscriptionEndDate || null,
          templatesLimit: userData.templatesLimit || 3,
          templatesUsed: userData.templatesUsed || 0,
        }

        
        setUser(processedUser)
      } else {
        console.log("[Auth] Auth check failed")
        setUser(null)
      }
    } catch (error) {
      console.error("[Auth] Check failed:", error)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true)
      await refreshUser()
      setLoading(false)
    }
    checkAuth()
  }, [refreshUser])

  const isPremium = user?.subscriptionTier === "PREMIUM"
  
  useEffect(() => {
    console.log("[Auth] isPremium updated:", isPremium, "for user:", user?.email)
  }, [isPremium, user?.email])

  const canCreateTemplate = user ? user.templatesUsed < user.templatesLimit : false

  return { 
    user, 
    loading, 
    isPremium,
    canCreateTemplate,
    refreshUser,
  }
}