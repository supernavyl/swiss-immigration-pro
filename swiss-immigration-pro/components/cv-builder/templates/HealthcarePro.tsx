import type { CVData } from '@/types/cv-builder'

export default function HealthcarePro({ data }: { data: CVData }) {
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
      }}
    >
      <header
        className="px-10 pt-8 pb-6 border-b-[3px] border-cyan-700"
        style={{ backgroundColor: '#ecfeff', borderBottomWidth: 3 }}
      >
        <h1 className="text-2xl font-semibold text-cyan-900">{fullName || 'Full Name'}</h1>
        {data.personalInfo.title && (
          <p className="text-cyan-800 text-sm mt-1">{data.personalInfo.title}</p>
        )}
        {contact.length > 0 && (
          <p className="text-cyan-700 text-sm mt-2">{contact.join(' · ')}</p>
        )}
      </header>

      <div className="flex" style={{ padding: 40 }}>
        <div className="pr-8" style={{ width: '60%' }}>
          {data.summary && (
            <section className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-800 mb-2">Professional Profile</h2>
              <p className="text-sm leading-relaxed">{data.summary}</p>
            </section>
          )}

          {data.workExperience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-800 mb-3">Clinical Experience</h2>
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
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-800 mb-3">Medical Education</h2>
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
        </div>

        <div style={{ width: '40%' }}>
          {data.certifications.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-800 mb-2">Licenses & Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {data.certifications.map((c) => (
                  <span
                    key={c.id}
                    className="text-xs px-2.5 py-1 rounded border border-cyan-200 bg-cyan-50 text-cyan-800 font-medium"
                  >
                    {c.name}
                    {c.issuer ? ` (${c.issuer})` : ''}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-800 mb-2">Specializations</h2>
              <ul className="text-sm space-y-0.5">
                {data.skills.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </section>
          )}

          {data.languages.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-800 mb-2">Languages</h2>
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
    </div>
  )
}
