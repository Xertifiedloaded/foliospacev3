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
  const parseJson = (value: unknown, fallback: unknown) => {
    if (!value) return fallback
    if (typeof value === "string") {
      try { return JSON.parse(value) } catch { return fallback }
    }
    return value
  }

  const userData = {
    name:     cv.user.name,
    email:    cv.user.email,
    username: cv.user.username,
    cvs: [{
      id:          cv.id,
      userId:      cv.userId,
      title:       cv.title,
      templateId:  cv.templateId ?? undefined,
      personalInfo: parseJson(cv.personalInfo, {}),
      educations:   parseJson(cv.educations,   []),
      experiences:  parseJson(cv.experiences,  []),
      skills:       parseJson(cv.skills,        []),
      projects:     parseJson(cv.projects,      []),
      certificates: parseJson(cv.certificates, []),
      awards:       parseJson(cv.awards,        []),
      showProjects:     cv.showProjects,
      showCertificates: cv.showCertificates,
      showAwards:       cv.showAwards,
      createdAt: cv.createdAt.toISOString(),
      updatedAt: cv.updatedAt.toISOString(),
    }]
  }

  return <PortfolioClient userData={userData} />
}