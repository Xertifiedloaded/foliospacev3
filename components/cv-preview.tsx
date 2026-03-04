"use client"
import UserProfile from '../assets/images/man2.png'
import type { CVData } from "@/lib/types"
import Image from 'next/image'

interface CVPreviewProps {
  cv: CVData
}

function fmt(dateString?: string) {
  if (!dateString) return null
  const d = new Date(dateString)
  return isNaN(d.getFullYear()) ? null : d.getFullYear()
}

function descLines(text?: string): string[] {
  if (!text) return []
  return text
    .split('\n')
    .map(l => l.trim().replace(/^[•\-]\s*/, '').replace(/\.+$/, ''))
    .filter(Boolean)
}

export function CVPreview({ cv }: CVPreviewProps) {
  const {
    personalInfo,
    educations = [],
    experiences = [],
    skills = [],
    projects = [],
    certificates = [],
    awards = [],
    showCertificates,
    showProjects,
    showAwards,
  } = cv

  const byDate = (items: any[]) =>
    [...items].sort((a, b) => {
      const ae = a.endDate ? new Date(a.endDate).getFullYear() : Infinity
      const be = b.endDate ? new Date(b.endDate).getFullYear() : Infinity
      return be - ae
    })

  const exps = byDate(experiences)
  const edus = byDate(educations)
  const projs = byDate(projects)
  const certs = byDate(certificates)
  const awds = byDate(awards)

  return (
    <article className="bg-[#F7F5F0] min-h-screen font-serif text-[#1a1a1a]">

      <header className="relative bg-[#111] text-white overflow-hidden">
        <div className="flex items-center justify-between px-6 md:px-10 py-3 border-b border-white/8">
          <span className="text-[9px] font-sans tracking-[0.35em] uppercase text-white/30">Portfolio</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E8C547]" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="w-2 h-2 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] md:grid-cols-[300px_1fr] min-h-55 md:min-h-65">

          <div className=" relative overflow-hidden">
            <Image
              src={UserProfile}
              alt="Profile"
              fill
              className="object-cover object-top grayscale"
              sizes="(max-width:768px) 100px, 180px"
            />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#111]/80" />
          </div>
          <div className="px-5 py-6 md:px-10 md:py-8 flex flex-col justify-between">
            <div>

              {personalInfo?.fullName && (
                <h1 className="text-xl sm:text-3xl md:text-5xl font-black leading-[1.05] tracking-tight text-white">
                  {personalInfo.fullName}
                </h1>
              )}

              {personalInfo?.summary && (
                <p className="mt-3 text-[9px] md:text-sm text-white/50 max-w-2xl leading-relaxed font-sans ">
                  {personalInfo.summary}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {personalInfo?.email && (
                <a href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-1.5 bg-white/8 hover:bg-white/14 transition rounded-sm px-2.5 py-1">
                  <svg className="w-2.5 h-2.5 text-[#E8C547] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[8px] md:text-[9px] font-sans text-white/60 truncate max-w-[140px]">{personalInfo.email}</span>
                </a>
              )}
              {personalInfo?.phone && (
                <span className="flex items-center gap-1.5 bg-white/8 rounded-sm px-2.5 py-1">
                  <svg className="w-2.5 h-2.5 text-[#E8C547] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-[8px] md:text-[9px] font-sans text-white/60">{personalInfo.phone}</span>
                </span>
              )}
              {personalInfo?.location && (
                <span className="flex items-center gap-1.5 bg-white/8 rounded-sm px-2.5 py-1">
                  <svg className="w-2.5 h-2.5 text-[#E8C547] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[8px] md:text-[9px] font-sans text-white/60">{personalInfo.location}</span>
                </span>
              )}
              {personalInfo?.linkedin && (
                <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#0A66C2]/40 hover:bg-[#0A66C2]/60 transition rounded-sm px-2.5 py-1">
                  <svg className="w-2.5 h-2.5 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-[8px] md:text-[9px] font-sans text-white/70">LinkedIn</span>
                </a>
              )}
              {personalInfo?.github && (
                <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-white/8 hover:bg-white/14 transition rounded-sm px-2.5 py-1">
                  <svg className="w-2.5 h-2.5 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  <span className="text-[8px] md:text-[9px] font-sans text-white/70">GitHub</span>
                </a>
              )}
              {personalInfo?.website && (
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-white/8 hover:bg-white/14 transition rounded-sm px-2.5 py-1">
                  <svg className="w-2.5 h-2.5 text-[#E8C547] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="text-[8px] md:text-[9px] font-sans text-white/70">Website</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── "Let's Talk" CTA strip ── */}
        {personalInfo?.email && (
          <div className="border-t border-white/8 px-6 md:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* animated pulse dot */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8C547] opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E8C547]" />
              </span>
              <p className="text-[10px] md:text-xs font-sans text-white/40 tracking-wide">
                Open to opportunities &amp; collaborations
              </p>
            </div>
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-2 bg-[#E8C547] text-[#111] px-4 py-2 rounded-sm font-sans font-black text-[9px] md:text-[10px] tracking-widest uppercase hover:bg-white transition-colors"
            >
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Let's Talk
            </a>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px]">
        <main className="px-6 py-10 md:px-12 md:py-12 space-y-12 border-r border-[#E0DDD5]">

          {exps.length > 0 && (
            <Section label="Experience">
              {exps.map((exp: any, i: number) => (
                <ExpBlock key={exp.id ?? i} item={exp} />
              ))}
            </Section>
          )}

          {edus.length > 0 && (
            <Section label="Education">
              {edus.map((edu: any, i: number) => (
                <EduBlock key={edu.id ?? i} item={edu} />
              ))}
            </Section>
          )}

          {showProjects && projs.length > 0 && (
            <Section label="Projects">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projs.map((p: any, i: number) => (
                  <ProjectCard key={p.id ?? i} project={p} />
                ))}
              </div>
            </Section>
          )}

        </main>

        {/* SIDEBAR */}
        <aside className="bg-[#EDEAE4] px-6 py-10 md:px-8 md:py-12 space-y-10">

          {skills.length > 0 && (
            <SideSection label="Skills">
              <div className="flex flex-wrap gap-2">
                {skills.map((s: any) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-1 bg-[#111] text-white text-[9px] md:text-[10px] font-sans font-semibold rounded-sm tracking-wide"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </SideSection>
          )}

          {showCertificates && certs.length > 0 && (
            <SideSection label="Certificates">
              <div className="space-y-4">
                {certs.map((cert: any, i: number) => (
                  <div key={cert.id ?? i} className="border-l-[3px] border-[#E8C547] pl-3">
                    <p className="text-[10px] md:text-xs font-bold font-sans">{cert.name}</p>
                    {cert.issuer && (
                      <p className="text-[9px] font-sans text-[#666] mt-0.5">{cert.issuer}</p>
                    )}
                    {(cert.issueDate || cert.expiryDate) && (
                      <p className="text-[8px] font-sans text-[#999] mt-0.5">
                        {fmt(cert.issueDate)}{cert.expiryDate ? ` – ${fmt(cert.expiryDate)}` : ''}
                      </p>
                    )}
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-sans text-[#E8C547] hover:underline"
                      >
                        View credential ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </SideSection>
          )}

          {showAwards && awds.length > 0 && (
            <SideSection label="Awards">
              <div className="space-y-4">
                {awds.map((award: any, i: number) => (
                  <div key={award.id ?? i} className="border-l-[3px] border-[#111] pl-3">
                    <p className="text-[10px] md:text-xs font-bold font-sans">{award.title}</p>
                    {award.issuer && (
                      <p className="text-[9px] font-sans text-[#666] mt-0.5">{award.issuer}</p>
                    )}
                    {award.date && (
                      <p className="text-[8px] font-sans text-[#999] mt-0.5">{fmt(award.date)}</p>
                    )}
                    {award.description && (
                      <p className="text-[9px] font-sans text-[#444] mt-1 leading-relaxed">
                        {award.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </SideSection>
          )}

        </aside>
      </div>
      <footer className="text-center text-sm text-gray-500 py-4 space-y-2">
        <p>
          © {new Date().getFullYear()}{" "}
          {personalInfo?.fullName && `${personalInfo.fullName}. `}
          All rights reserved.
        </p>

        <p className='text-xs'>
          Create your portfolio at{" "}
          <a
            href="https://foliospace.live"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            foliospace.live
          </a>
        </p>
      </footer>
    </article>
  )
}



function ContactChip({ href, label }: { href?: string; label: string }) {
  const cls = "text-[9px] md:text-[10px] font-sans text-white/45 hover:text-[#E8C547] transition-colors tracking-wide"
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{label}</a>
    : <span className={cls}>{label}</span>
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-7">
        <div className="w-5 h-0.5 bg-[#E8C547]" />
        <h2 className="text-[9px] md:text-[10px] font-sans font-black uppercase tracking-[0.3em] text-[#999]">
          {label}
        </h2>
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  )
}

function SideSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[9px] md:text-[10px] font-sans font-black uppercase tracking-[0.25em] text-[#999] pb-2 mb-4 border-b border-[#D5D2CC]">
        {label}
      </h3>
      {children}
    </section>
  )
}

function ExpBlock({ item }: { item: any }) {
  const lines = descLines(item.description)
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm md:text-[15px] font-black leading-snug">{item.position}</h3>
          <p className="text-[10px] md:text-xs font-sans text-[#777] mt-0.5">{item.company}</p>
        </div>
        <span className="inline-flex items-center self-start px-2.5 py-0.5 bg-[#E8C547] text-[#111] text-[9px] md:text-[10px] font-sans font-bold rounded-sm whitespace-nowrap shrink-0">
          {fmt(item.startDate)} — {fmt(item.endDate) ?? 'Present'}
        </span>
      </div>
      {lines.length > 0 && (
        <div className="pl-4 border-l-2 border-[#E0DDD5] space-y-1.5">
          {lines.map((line, i) => (
            <p key={i} className="text-[10px] md:text-xs font-sans text-[#555] leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function EduBlock({ item }: { item: any }) {
  const lines = descLines(item.description)
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm md:text-[15px] font-black leading-snug">{item.degree}</h3>
          <p className="text-[10px] md:text-xs font-sans text-[#777] mt-0.5">
            {item.school}{item.field ? ` — ${item.field}` : ''}
          </p>
        </div>
        <span className="inline-flex items-center self-start px-2.5 py-0.5 bg-[#111] text-white text-[9px] md:text-[10px] font-sans font-bold rounded-sm whitespace-nowrap shrink-0">
          {fmt(item.startDate)} — {fmt(item.endDate) ?? 'Present'}
        </span>
      </div>
      {lines.length > 0 && (
        <div className="pl-4 border-l-2 border-[#E0DDD5] space-y-1.5">
          {lines.map((line, i) => (
            <p key={i} className="text-[10px] md:text-xs font-sans text-[#555] leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: any }) {
  const lines = descLines(project.description)
  return (
    <div className="bg-[#111] text-white p-5 rounded-sm hover:shadow-2xl transition-all duration-300 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xs md:text-sm font-black capitalize leading-snug">{project.name}</h3>
        {(project.startDate || project.endDate) && (
          <span className="text-[8px] md:text-[9px] font-sans text-[#E8C547] whitespace-nowrap shrink-0">
            {fmt(project.startDate)}
            {project.endDate
              ? ` – ${fmt(project.endDate)}`
              : project.startDate ? ' – Now' : ''}
          </span>
        )}
      </div>

      {lines.length > 0 && (
        <div className="space-y-1">
          {lines.slice(0, 3).map((line, i) => (
            <p key={i} className="text-[9px] md:text-[10px] font-sans text-white/55 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      )}

      {project.technologies?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.technologies.map((t: string, i: number) => (
            <span
              key={i}
              className="px-1.5 py-0.5 border border-white/15 text-[8px] md:text-[9px] font-sans text-white/60 rounded-sm"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] font-sans text-[#E8C547] hover:underline mt-auto"
        >
          View project ↗
        </a>
      )}
    </div>
  )
}