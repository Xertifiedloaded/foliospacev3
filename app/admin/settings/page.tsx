"use client"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPage() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your admin preferences</p>
          </div>

          <Card className="p-6 max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Blog Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium">Posts per page</label>
                <select className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Default post visibility</label>
                <select className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>

              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
