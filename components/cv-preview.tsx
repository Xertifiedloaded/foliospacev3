"use client"

import type { CVData } from "@/lib/types"

interface CVPreviewProps {
  cv: CVData
}
function yearOnly(dateString?: string) {
  if (!dateString) return null;
  const year = new Date(dateString).getFullYear();
  return isNaN(year) ? null : year;
}



export function CVPreview({ cv }: CVPreviewProps) {
  const { personalInfo, educations, experiences, skills, projects } = cv

  return (
    <div className=" bg-white text-black p-8 space-y-6">
      <div className="border-b-2 border-slate-300 pb-6">
        {personalInfo?.fullName && <h1 className="text-4xl font-bold">{personalInfo.fullName}</h1>}
        {personalInfo?.summary && <p className="text-sm text-slate-600 mt-2">{personalInfo.summary}</p>}
        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          {personalInfo?.email && (
            <a href={`mailto:${personalInfo.email}`} className="text-blue-600 hover:underline">
              {personalInfo.email}
            </a>
          )}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.website && (
            <a href={personalInfo.website} className="text-blue-600 hover:underline">
              {personalInfo.website}
            </a>
          )}
          {personalInfo?.linkedin && (
            <a href={`https://${personalInfo.linkedin}`} className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          )}
          {personalInfo?.github && (
            <a href={`https://${personalInfo.github}`} className="text-blue-600 hover:underline">
              GitHub
            </a>
          )}
        </div>
      </div>

      {experiences && experiences.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-3">Experience</h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{exp.position}</p>
                    <p className="text-sm text-slate-600">{exp.company}</p>
                  </div>
                  <p className="text-xs text-slate-600 text-right">
                    {yearOnly(exp.startDate)} - {yearOnly(exp.endDate) || "Present"}
                  </p>
                </div>
                {exp.description && <p className="text-sm mt-2 text-slate-700">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {educations && educations.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-3">Education</h2>
          <div className="space-y-4">
            {educations.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{edu.degree}</p>
                    <p className="text-sm text-slate-600">{edu.school}</p>
                    {edu.field && <p className="text-xs text-slate-600">Field: {edu.field}</p>}
                  </div>
                  <p className="text-xs text-slate-600 text-right">
                    {new Date(edu.startDate).getFullYear()}
                    {edu.endDate ? ` - ${new Date(edu.endDate).getFullYear()}` : " - Present"}

                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="px-3 py-1 bg-slate-200 text-slate-800 rounded text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-3">Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <p className="font-bold">{project.name}</p>
                {project.description && <p className="text-sm text-slate-700 mt-1">{project.description}</p>}
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-xs text-slate-600 mt-1">Technologies: {project.technologies.join(", ")}</p>
                )}
                {project.url && (
                  <a href={project.url} className="text-xs text-blue-600 hover:underline">
                    {project.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
