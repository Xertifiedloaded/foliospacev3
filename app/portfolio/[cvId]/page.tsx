
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation"
import PortfolioClient from "./PortfolioClient";


const prisma = new PrismaClient();

export default async function CVPage({ 
  params 
}: { 
  params: Promise<{ cvId: string }> 
}) {
  const { cvId } = await params

  const cv = await prisma.cV.findUnique({
    where: { id: cvId },
    include: { user: true }
  })

  if (!cv) return notFound()

  const userData = {
    name: cv.user.name,
    email: cv.user.email,
    username: cv.user.username,
    cvs: [{
      id: cv.id,
      userId: cv.userId,
      title: cv.title,
      personalInfo: typeof cv.personalInfo === "string" ? JSON.parse(cv.personalInfo) : cv.personalInfo,
      educations: typeof cv.educations === "string" ? JSON.parse(cv.educations) : cv.educations,
      experiences: typeof cv.experiences === "string" ? JSON.parse(cv.experiences) : cv.experiences,
      skills: typeof cv.skills === "string" ? JSON.parse(cv.skills) : cv.skills,
      projects: typeof cv.projects === "string" ? JSON.parse(cv.projects) : cv.projects,
      createdAt: cv.createdAt.toISOString(),
      updatedAt: cv.updatedAt.toISOString(),
    }]
  }

  return <PortfolioClient userData={userData} />
}