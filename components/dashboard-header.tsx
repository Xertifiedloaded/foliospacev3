"use client"

import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import { useState } from "react"
import { Menu, X, LogOut, FileText, Plus } from "lucide-react"

export function DashboardHeader() {
  const { user, logout, isPremium } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="shrink-0 font-bold text-xl text-foreground hover:text-accent transition-colors"
          >
         Foliospace
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/blog" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
              <FileText size={18} />
              <span>Blog</span>
            </Link>

            {user && isPremium && (
              <Link
                href="/blog/new"
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
              >
                <Plus size={18} />
                <span>New Post</span>
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    {isPremium && <p className="text-xs text-accent">Premium</p>}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-muted text-foreground transition-colors border border-border"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-foreground hover:bg-card transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/blog"
              className="block text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>

            {user && isPremium && (
              <Link
                href="/blog/new"
                className="block text-foreground hover:text-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                New Post
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-muted text-foreground transition-colors border border-border text-left"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-accent text-center font-medium"
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




