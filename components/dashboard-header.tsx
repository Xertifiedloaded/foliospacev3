"use client"

import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import { useState } from "react"
import { Menu, X, LogOut, Home, Crown, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const { user, logout, isPremium } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="shrink-0 font-bold text-xl bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/40 transition-all"
          >
            Foliospace
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home size={16} />
              <span>Dashboard</span>
            </Link>
            
            <button 
              disabled
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
            >
              <span>Blog</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Coming Soon
              </Badge>
            </button>
          </div>

  
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-card border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-sm font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-foreground">
                          {user.username}
                        </p>
                        {isPremium && (
                          <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground capitalize">
                        {user.subscriptionTier}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-muted text-foreground transition-all border border-border/50 hover:border-border text-sm font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-foreground hover:bg-card transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {user && (
              <div className="pb-4 border-b border-border/50">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-foreground">
                        {user.username}
                      </p>
                      {isPremium && (
                        <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.subscriptionTier}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Link
              href="/"
              className="flex items-center gap-3 text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>

            <div className="flex items-center gap-3 text-muted-foreground/50">
              <span className="font-medium">Blog</span>
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                Coming Soon
              </Badge>
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-background hover:bg-muted text-foreground transition-all border border-border/50 hover:border-border font-medium"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="block w-full mt-4 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-center font-medium shadow-lg shadow-primary/25"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}