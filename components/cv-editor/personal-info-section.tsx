"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import type { PersonalInfo } from "@/lib/types"
import { User, Mail, Phone, MapPin, FileText, Globe, Linkedin, Github } from "lucide-react"

interface PersonalInfoSectionProps {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <Card className="p-4 sm:p-5 md:p-6 border-border/50 hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6 pb-3 sm:pb-4 border-b">
        <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-bold">Personal Information</h2>
      </div>

      <div className="grid gap-3 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1.5">
            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
            Full Name
          </label>
          <Input
            value={data.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="John Doe"
            className="h-9 sm:h-10 text-sm sm:text-base"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1.5">
              <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
              Email
            </label>
            <Input
              type="email"
              value={data.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
              className="h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1.5">
              <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
              Phone
            </label>
            <Input
              value={data.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1.5">
            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
            Location
          </label>
          <Input
            value={data.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="San Francisco, CA"
            className="h-9 sm:h-10 text-sm sm:text-base"
          />
        </div>

        {/* Professional Summary */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1.5">
            <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
            Professional Summary
          </label>
          <Textarea
            value={data.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="Brief overview of your professional background and goals..."
            rows={4}
            className="text-sm sm:text-base resize-none"
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            A concise summary of your experience, skills, and career objectives
          </p>
        </div>

        {/* Divider */}
        <div className="border-t pt-3 sm:pt-4">
          <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
            Online Presence
          </h3>

          {/* Website & LinkedIn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1.5">
                <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                Website
              </label>
              <Input
                value={data.website || ""}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://example.com"
                className="h-9 sm:h-10 text-sm sm:text-base"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1.5">
                <Linkedin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                LinkedIn
              </label>
              <Input
                value={data.linkedin || ""}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                placeholder="linkedin.com/in/johndoe"
                className="h-9 sm:h-10 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1.5">
              <Github className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
              GitHub
            </label>
            <Input
              value={data.github || ""}
              onChange={(e) => handleChange("github", e.target.value)}
              placeholder="github.com/johndoe"
              className="h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}