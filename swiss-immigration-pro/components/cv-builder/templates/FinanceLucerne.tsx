import type { CVData } from '@/types/cv-builder'

export default function FinanceLucerne({ data }: { data: CVData }) {
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
        fontFamily: 'system-ui, sans-serif',
        padding: 48,
      }}
    >
      <header
        className="pb-4 border-b-[3px] border-[#0d4f4f]"
        style={{ borderBottomWidth: 3, borderColor: '#0d4f4f' }}
      >
        <h1 className="text-2xl font-semibold text-[#0d4f4f]">{fullName || 'Full Name'}</h1>
        {data.personalInfo.title && (
          <p className="text-zinc-600 text-sm mt-1">{data.personalInfo.title}</p>
        )}
        {contact.length > 0 && (
          <p className="text-zinc-500 text-sm mt-2">{contact.join(' · ')}</p>
        )}
      </header>

      {data.summary && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0d4f4f] mb-2">Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.workExperience.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0d4f4f] mb-3">Professional Experience</h2>
          <ul className="space-y-4">
            {data.workExperience.map((exp) => (
              <li key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{exp.jobTitle}</span>
                  <span className="text-zinc-500 text-xs">
                    {exp.startDate}
                    {exp.endDate ? ` – ${exp.isCurrent ? 'Present' : exp.endDate}` : ''}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 mt-0.5">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
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

      {data.education.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0d4f4f] mb-3">Education & Qualifications</h2>
          <ul className="space-y-3">
            {data.education.map((edu) => (
              <li key={edu.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{edu.degree}</span>
                  <span className="text-zinc-500 text-xs">
                    {edu.startDate}
                    {edu.endDate ? ` – ${edu.isCurrent ? 'Present' : edu.endDate}` : ''}
                  </span>
                </div>
                <p className="text-sm mt-0.5">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {(edu.gpa || edu.honors.length > 0) && (
                  <p className="text-xs text-zinc-600 mt-1">{[edu.gpa, ...edu.honors].filter(Boolean).join(' · ')}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0d4f4f] mb-3">Professional Certifications</h2>
          <div className="flex flex-wrap gap-2">
            {data.certifications.map((c) => (
              <span
                key={c.id}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ backgroundColor: '#f0fdfa', color: '#0d4f4f' }}
              >
                {c.name}
                {c.issuer ? ` — ${c.issuer}` : ''}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8 mt-6">
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0d4f4f] mb-2">Core Skills</h2>
            <ul className="text-sm space-y-0.5">
              {data.skills.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0d4f4f] mb-2">Languages</h2>
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
    </div>
  )
}
