"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface BlogHeroProps {
  onSearch: (query: string) => void
}

export function BlogHero({ onSearch }: BlogHeroProps) {
  return (
    <section className="px-6 py-16 bg-muted/50">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground mb-8">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search articles..." className="pl-10" onChange={(e) => onSearch(e.target.value)} />
        </div>
      </div>
    </section>
  )
}
