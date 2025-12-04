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


  const sortByDate = (items: any[]) => {
    return [...items].sort((a, b) => {
      const aEnd = a.endDate ? new Date(a.endDate).getFullYear() : Infinity
      const bEnd = b.endDate ? new Date(b.endDate).getFullYear() : Infinity
      return bEnd - aEnd
    })
  }

  const sortedExperiences = experiences ? sortByDate(experiences) : []
  const sortedEducations = educations ? sortByDate(educations) : []
  const sortedProjects = projects ? sortByDate(projects) : []

  return (
    <div className=" bg-white text-black p-4 space-y-6">
      <div className="border-b-2 border-slate-300 pb-6">
        <div className="flex mb-2 items-center gap-2"> <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-xl sm:text-2xl font-bold text-orange-300">
            {personalInfo.fullName.charAt(0).toUpperCase()}
          </span>
        </div>
          {personalInfo?.fullName && <h1 className="text-xl font-bold">{personalInfo.fullName}</h1>}
        </div>
        {personalInfo?.summary && <p className="text-xs text-slate-600 mt-2">{personalInfo.summary}</p>}
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

      {sortedExperiences && sortedExperiences.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-3">Experience</h2>
          <div className="space-y-4">
            {sortedExperiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">{exp.position}</p>
                    <p className="text-xs text-slate-600">{exp.company}</p>
                  </div>
                  <p className="text-xs text-slate-600 text-right">
                    {yearOnly(exp.startDate)} - {yearOnly(exp.endDate) || "Present"}
                  </p>
                </div>
                {exp.description && (
                  <ul className="text-xs font-medium mt-2 text-slate-700 list-disc list-inside space-y-1">
                    {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                      <li key={idx}>{line.trim().replace(/^[•\-]\s*/, '').replace(/\.+$/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {sortedEducations && sortedEducations.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-3">Education</h2>
          <div className="space-y-4">
            {sortedEducations.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-xs">{edu.degree}</p>
                    <p className="text-xs font-medium text-slate-600">{edu.school}</p>
                    {edu.field && <p className="text-xs text-slate-600">Field: {edu.field}</p>}
                  </div>
                  <small className="text-xs text-slate-600 text-right">
                    {new Date(edu.startDate).getFullYear()}
                    {edu.endDate ? ` - ${new Date(edu.endDate).getFullYear()}` : " - Present"}

                  </small>
                </div>
                {edu.description && (
                  <ul className="text-xs mt-2 text-slate-700 list-disc list-inside space-y-1">
                    {edu.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                      <li key={idx}>{line.trim().replace(/^[•\-]\s*/, '').replace(/\.+$/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* {skills && skills.length > 0 && (
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
      )} */}

      {sortedProjects && sortedProjects.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-3">Projects</h2>
          <div className="space-y-4">
            {sortedProjects.map((project) => (
              <div key={project.id}>
                <div className="flex capitalize justify-between items-start">
                  <p className="font-bold">{project.name}</p>
                  {(project.startDate || project.endDate) && (
                    <p className="text-xs text-slate-600 text-right">
                      {project.startDate && yearOnly(project.startDate)}
                      {project.startDate && project.endDate && ' - '}
                      {project.endDate ? yearOnly(project.endDate) : (project.startDate ? ' - Present' : '')}
                    </p>
                  )}
                </div>
                {project.description && (
                  <ul className="text-xs text-slate-700 mt-1 list-disc list-inside space-y-1">
                    {project.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                      <li key={idx}>{line.trim().replace(/^[•\-]\s*/, '').replace(/\.+$/, '')}</li>
                    ))}
                  </ul>
                )}
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