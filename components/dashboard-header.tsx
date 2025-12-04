"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { LogOut, Settings, User, Menu } from "lucide-react"
import { useState } from "react"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              FS
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                FolioSpace
              </h1>
              <p className="hidden sm:block text-xs text-muted-foreground">
                Professional CV Management
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <p className="text-xs capitalize font-medium max-w-[200px] truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-muted-foreground">Active User</p>
                </div>
              </div>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full"
            >
              <Settings className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            {user && (
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-10 w-10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>


        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-3 animate-in slide-in-from-top-2">
            {user && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium truncate max-w-[200px]">
                       {user.username}
                  </p>
                  <p className="text-xs text-muted-foreground">Active User</p>
                </div>
              </div>
            )}

            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start gap-3"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}