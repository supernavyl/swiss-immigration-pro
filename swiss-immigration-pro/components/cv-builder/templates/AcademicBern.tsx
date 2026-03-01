import type { CVData } from '@/types/cv-builder'

export default function AcademicBern({ data }: { data: CVData }) {
  const fullName = [data.personalInfo.firstName, data.personalInfo.lastName].filter(Boolean).join(' ')
  const contact = [
    data.personalInfo.email,
    data.personalInfo.phone,
    [data.personalInfo.city, data.personalInfo.country].filter(Boolean).join(', '),
  ].filter(Boolean)

  return (
    <div
      className="bg-white text-zinc-800"
      style={{
        width: 794,
        minHeight: 1123,
        fontFamily: 'Georgia, serif',
        padding: 48,
      }}
    >
      <header className="text-center pb-4 border-b-2 border-[#0369a1]" style={{ borderBottomWidth: 2 }}>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
          {fullName || 'Full Name'}
          {data.personalInfo.title ? ` — ${data.personalInfo.title}` : ''}
        </h1>
        {contact.length > 0 && (
          <p className="text-sm text-zinc-600 mt-2">{contact.join(' · ')}</p>
        )}
      </header>

      {data.summary && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0369a1] mb-2">Research Interests</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0369a1] mb-3">Education</h2>
          <ul className="space-y-4">
            {data.education.map((edu) => (
              <li key={edu.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{edu.degree}</span>
                  <span className="text-zinc-600 text-xs">
                    {edu.startDate}
                    {edu.endDate ? ` – ${edu.isCurrent ? 'Present' : edu.endDate}` : ''}
                  </span>
                </div>
                <p className="text-sm mt-0.5">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {(edu.gpa || edu.honors.length > 0) && (
                  <p className="text-xs text-zinc-600 mt-1">
                    {[edu.gpa, ...edu.honors].filter(Boolean).join(' · ')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.workExperience.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0369a1] mb-3">Academic Positions</h2>
          <ul className="space-y-4">
            {data.workExperience.map((exp) => (
              <li key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{exp.jobTitle}</span>
                  <span className="text-zinc-600 text-xs">
                    {exp.startDate}
                    {exp.endDate ? ` – ${exp.isCurrent ? 'Present' : exp.endDate}` : ''}
                  </span>
                </div>
                <p className="text-sm mt-0.5">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                {exp.achievements.length > 0 && (
                  <ul className="mt-2 text-sm list-disc list-inside space-y-0.5">
                    {exp.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0369a1] mb-3">Publications & Research</h2>
          <ul className="space-y-3">
            {data.projects.map((proj) => (
              <li key={proj.id}>
                <span className="font-semibold text-sm">{proj.name}</span>
                {(proj.startDate || proj.endDate) && (
                  <span className="text-zinc-600 text-xs ml-2">
                    {[proj.startDate, proj.endDate].filter(Boolean).join(' – ')}
                  </span>
                )}
                {proj.description && <p className="text-sm mt-0.5">{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <p className="text-xs text-zinc-600 mt-1">{proj.technologies.join(', ')}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8 mt-6">
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0369a1] mb-2">Expertise</h2>
            <ul className="text-sm space-y-0.5">
              {data.skills.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0369a1] mb-2">Languages</h2>
            <ul className="text-sm space-y-0.5">
              {data.languages.map((lang) => (
                <li key={lang.id}>
                  {lang.name}{lang.level ? ` (${lang.level})` : ''}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {data.certifications.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0369a1] mb-3">Awards & Certifications</h2>
          <ul className="space-y-2 text-sm">
            {data.certifications.map((c) => (
              <li key={c.id}>
                <span className="font-medium">{c.name}</span>
                {c.issuer && <span className="text-zinc-600"> — {c.issuer}</span>}
                {c.date && <span className="text-zinc-600 text-xs"> ({c.date})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
