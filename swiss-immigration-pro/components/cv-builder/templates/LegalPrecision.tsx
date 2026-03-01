import type { CVData } from '@/types/cv-builder'

export default function LegalPrecision({ data }: { data: CVData }) {
  const fullName = [data.personalInfo.firstName, data.personalInfo.lastName].filter(Boolean).join(' ')
  const contact = [
    data.personalInfo.email,
    data.personalInfo.phone,
    [data.personalInfo.address, data.personalInfo.postalCode, data.personalInfo.city].filter(Boolean).join(', '),
  ].filter(Boolean)

  return (
    <div
      className="bg-white text-zinc-800"
      style={{
        width: 794,
        minHeight: 1123,
        fontFamily: 'Georgia, serif',
        padding: 44,
      }}
    >
      <header className="text-center pb-3 border-b-2 border-zinc-800">
        <h1 className="text-xl font-semibold uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
          {fullName || 'Full Name'}
        </h1>
        {data.personalInfo.title && (
          <p className="text-sm text-zinc-600 mt-1 normal-case">{data.personalInfo.title}</p>
        )}
        {contact.length > 0 && (
          <p className="text-xs text-zinc-500 mt-2">{contact.join(' · ')}</p>
        )}
      </header>

      {data.workExperience.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-700 mb-2">Legal Experience</h2>
          <ul className="space-y-3 text-sm" style={{ textAlign: 'justify' }}>
            {data.workExperience.map((exp) => (
              <li key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold">{exp.jobTitle}</span>
                  <span className="text-zinc-500 text-xs shrink-0">
                    {exp.startDate}
                    {exp.endDate ? ` – ${exp.isCurrent ? 'Present' : exp.endDate}` : ''}
                  </span>
                </div>
                <p className="text-zinc-600 mt-0.5">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                {exp.achievements.length > 0 && (
                  <ul className="mt-1.5 list-disc list-inside space-y-0.5 text-zinc-700">
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

      {data.education.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-700 mb-2">Education</h2>
          <ul className="space-y-2.5 text-sm" style={{ textAlign: 'justify' }}>
            {data.education.map((edu) => (
              <li key={edu.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold">{edu.degree}</span>
                  <span className="text-zinc-500 text-xs">
                    {edu.startDate}
                    {edu.endDate ? ` – ${edu.isCurrent ? 'Present' : edu.endDate}` : ''}
                  </span>
                </div>
                <p className="text-zinc-600 mt-0.5">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {(edu.gpa || edu.honors.length > 0) && (
                  <p className="text-xs text-zinc-600 mt-0.5">{[edu.gpa, ...edu.honors].filter(Boolean).join(' · ')}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-700 mb-2">Bar Admissions & Certifications</h2>
          <ul className="space-y-1 text-sm" style={{ textAlign: 'justify' }}>
            {data.certifications.map((c) => (
              <li key={c.id}>
                <span className="font-medium">{c.name}</span>
                {c.issuer && <span className="text-zinc-600"> — {c.issuer}</span>}
                {c.date && <span className="text-zinc-500 text-xs"> ({c.date})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-2 gap-10 mt-5">
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-700 mb-2">Practice Areas</h2>
            <ul className="text-sm space-y-0.5" style={{ textAlign: 'justify' }}>
              {data.skills.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-700 mb-2">Languages</h2>
            <ul className="text-sm space-y-0.5" style={{ textAlign: 'justify' }}>
              {data.languages.map((lang) => (
                <li key={lang.id}>
                  {lang.name}{lang.level ? ` (${lang.level})` : ''}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
