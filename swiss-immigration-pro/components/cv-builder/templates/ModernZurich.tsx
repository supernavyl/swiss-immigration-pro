import type { CVData } from '@/types/cv-builder'

const PRIMARY = '#1e3a5f'
const ACCENT = '#2563eb'

export default function ModernZurich({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperience, education, skills, languages, certifications, references, projects } = data
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ')

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    const cat = s.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})

  return (
    <div
      className="bg-white text-slate-800"
      style={{ width: 794, minHeight: 1123 }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between gap-6 px-10 py-6 text-white"
        style={{ backgroundColor: PRIMARY }}
      >
        <div className="flex items-center gap-4">
          {personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt=""
              width={100}
              height={100}
              className="object-cover flex-shrink-0 rounded-full"
            />
          )}
          <div>
            {fullName && <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>}
            {personalInfo.title && <p className="text-white/90 text-sm mt-1">{personalInfo.title}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {personalInfo.nationality && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">{personalInfo.nationality}</span>
              )}
              {personalInfo.permitType && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">{personalInfo.permitType}</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right text-sm text-white/90">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {(personalInfo.city || personalInfo.country) && (
            <p>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</p>
          )}
        </div>
      </div>

      {/* Body: 60/40 two-column */}
      <div className="flex" style={{ minHeight: 800 }}>
        <div className="flex-shrink-0 px-8 py-6 border-r border-slate-200" style={{ width: '60%' }}>
          {summary && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: PRIMARY }}>Summary</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
            </section>
          )}

          {workExperience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: PRIMARY }}>Experience</h2>
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

          {education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: PRIMARY }}>Education</h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <span className="font-semibold text-slate-900">{edu.degree}</span>
                    <p className="text-sm text-slate-600">{edu.institution}</p>
                    <p className="text-xs text-slate-500">
                      {edu.startDate}{edu.endDate ? ` – ${edu.isCurrent ? 'Present' : edu.endDate}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: PRIMARY }}>Projects</h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <span className="font-semibold text-slate-900">{proj.name}</span>
                    {proj.description && <p className="text-sm text-slate-600 mt-0.5">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((t, i) => (
                          <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex-shrink-0 px-8 py-6 bg-slate-50/50" style={{ width: '40%' }}>
          {Object.keys(skillsByCategory).length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: PRIMARY }}>Skills</h2>
              <div className="space-y-3">
                {Object.entries(skillsByCategory).map(([cat, list]) => (
                  <div key={cat}>
                    <p className="text-xs font-medium text-slate-500 capitalize mb-1">{cat}</p>
                    <div className="flex flex-wrap gap-1">
                      {list.map((s) => (
                        <span
                          key={s.id}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: 'white', color: ACCENT, border: `1px solid ${ACCENT}` }}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: PRIMARY }}>Languages</h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-800">{lang.name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: ACCENT, color: 'white' }}
                    >
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: PRIMARY }}>Certifications</h2>
              <div className="space-y-2 text-sm">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <span className="font-medium text-slate-800">{c.name}</span>
                    {c.issuer && <p className="text-xs text-slate-600">{c.issuer}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {references.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: PRIMARY }}>References</h2>
              <div className="space-y-2 text-sm">
                {references.map((ref) => (
                  <div key={ref.id}>
                    <p className="font-medium text-slate-800">{ref.name}, {ref.title}</p>
                    {ref.company && <p className="text-xs text-slate-600">{ref.company}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
