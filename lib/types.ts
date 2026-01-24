
export interface PersonalInfo {
  fullName?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
  website?: string
  linkedin?: string
  github?: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Skill {
  id: string
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
}

export interface Project {
  id: string
  name: string
  description: string
  url?: string
  technologies: string[]
}

export interface CVData {
  id: string
  userId: string
  title: string
  personalInfo: Record<string, unknown>
  educations: unknown[]
  experiences: unknown[]
  skills: unknown[]
  projects: unknown[]
  certificates: unknown[]
  awards: unknown[]
  showProjects?: boolean
  showCertificates?: boolean
  showAwards?: boolean
  createdAt: string
  updatedAt: string
}
