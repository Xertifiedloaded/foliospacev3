"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import type { PersonalInfo } from "@/lib/types"

interface PersonalInfoSectionProps {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <Card className="p-2 lg:p-6">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <Input
            value={data.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={data.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={data.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Location</label>
          <Input
            value={data.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Professional Summary</label>
          <Textarea
            value={data.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="Brief overview of your professional background and goals..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Website</label>
            <Input
              value={data.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium">LinkedIn</label>
            <Input
              value={data.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">GitHub</label>
          <Input
            value={data.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="github.com/johndoe"
          />
        </div>
      </div>
    </Card>
  )
}
