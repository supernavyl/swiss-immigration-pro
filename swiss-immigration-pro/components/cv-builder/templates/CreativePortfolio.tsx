import type { CVData } from '@/types/cv-builder'

export default function CreativePortfolio({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperience, education, skills, languages, projects } = data
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ')
  const nameParts = fullName ? fullName.split(/\s+/) : []
  const line1 = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(' ')
  const line2 = nameParts.slice(Math.ceil(nameParts.length / 2)).join(' ')

  return (
    <div
      className="bg-white text-slate-800"
      style={{ width: 794, minHeight: 1123 }}
    >
      {/* Gradient header (purple to pink) */}
      <div
        className="px-10 py-8 text-white flex items-center justify-between gap-6"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        }}
      >
        <div className="flex items-center gap-6">
          {personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt=""
              width={100}
              height={100}
              className="object-cover rounded-full flex-shrink-0 ring-2 ring-white/30"
            />
          )}
          <div>
            {line1 && (
              <h1 className="font-bold tracking-tight leading-tight" style={{ fontSize: 26 }}>
                {line1}
              </h1>
            )}
            {line2 && (
              <h1 className="font-bold tracking-tight leading-tight" style={{ fontSize: 26 }}>
                {line2}
              </h1>
            )}
            {personalInfo.title && (
              <p className="text-white/90 text-sm mt-2">{personalInfo.title}</p>
            )}
          </div>
        </div>
        <div className="text-right text-sm text-white/90">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {(personalInfo.websiteUrl || personalInfo.linkedinUrl) && (
            <p>{personalInfo.websiteUrl || personalInfo.linkedinUrl}</p>
          )}
        </div>
      </div>

      <div className="px-10 py-8">
        {summary && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">About Me</h2>
            <p className="text-slate-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {workExperience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Experience</h2>
            <div className="space-y-4">
              {workExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-semibold text-slate-900">{exp.jobTitle}</span>
                    <span className="text-xs text-slate-500">
                      {exp.startDate}{exp.endDate ? ` – ${exp.isCurrent ? 'Present' : exp.endDate}` : ''}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  {exp.achievements.length > 0 && (
                    <ul className="mt-2 text-sm text-slate-700 list-disc pl-4 space-y-1">
                      {exp.achievements.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Portfolio</h2>
            <div className="grid grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <span className="font-semibold text-slate-900">{proj.name}</span>
                  {proj.description && (
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{proj.description}</p>
                  )}
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills and Languages side by side */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="text-sm px-2 py-1 rounded-full bg-pink-50 text-pink-800 border border-pink-200"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Languages</h2>
              <div className="space-y-2 text-sm">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="font-medium text-slate-800">{lang.name}</span>
                    <span className="text-slate-600">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <span className="font-semibold text-slate-900">{edu.degree}</span>
                  {edu.institution && <span className="text-slate-600"> — {edu.institution}</span>}
                  <p className="text-sm text-slate-500">
                    {edu.startDate}{edu.endDate ? ` – ${edu.isCurrent ? 'Present' : edu.endDate}` : ''}
                    {edu.location ? ` · ${edu.location}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
