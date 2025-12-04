// Type definitions for CV sections
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
  personalInfo: PersonalInfo
  educations: Education[]
  experiences: Experience[]
  skills: Skill[]
  projects: Project[]
  createdAt: string
  updatedAt: string
}
