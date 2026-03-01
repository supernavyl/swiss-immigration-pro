import type { CVData } from '@/types/cv-builder'

export default function MinimalBasel({ data }: { data: CVData }) {
  const fullName = [data.personalInfo.firstName, data.personalInfo.lastName].filter(Boolean).join(' ')
  const contact = [
    data.personalInfo.email,
    data.personalInfo.phone,
    [data.personalInfo.address, data.personalInfo.postalCode, data.personalInfo.city].filter(Boolean).join(', '),
  ].filter(Boolean)

  return (
    <div
      className="bg-white text-[#18181b]"
      style={{
        width: 794,
        minHeight: 1123,
        fontFamily: 'Inter, sans-serif',
        padding: 84,
      }}
    >
      <header className="border-b border-[#18181b] pb-4" style={{ borderWidth: 1 }}>
        <h1 className="text-[28pt] font-light tracking-tight" style={{ fontWeight: 300 }}>
          {fullName || 'Full Name'}
        </h1>
        {data.personalInfo.title && (
          <p className="text-[#a1a1aa] text-sm uppercase tracking-widest mt-1">{data.personalInfo.title}</p>
        )}
        {contact.length > 0 && (
          <p className="text-[#a1a1aa] text-xs mt-2">{contact.join(' · ')}</p>
        )}
      </header>

      {data.summary && (
        <>
          <div className="border-b border-[#e4e4e7] my-6" style={{ borderWidth: 1 }} />
          <section>
            <h2 className="text-[#a1a1aa] text-xs uppercase tracking-widest mb-2">Summary</h2>
            <p className="text-sm leading-relaxed">{data.summary}</p>
          </section>
        </>
      )}

      {data.workExperience.length > 0 && (
        <>
          <div className="border-b border-[#e4e4e7] my-6" style={{ borderWidth: 1 }} />
          <section>
            <h2 className="text-[#a1a1aa] text-xs uppercase tracking-widest mb-3">Experience</h2>
            <ul className="space-y-4">
              {data.workExperience.map((exp) => (
                <li key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-medium text-sm">{exp.jobTitle}</span>
                    <span className="text-[#a1a1aa] text-xs shrink-0">
                      {exp.startDate}
                      {exp.endDate ? ` – ${exp.isCurrent ? 'Present' : exp.endDate}` : ''}
                    </span>
                  </div>
                  <p className="text-[#a1a1aa] text-xs mt-0.5">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  {exp.achievements.length > 0 && (
                    <ul className="mt-2 text-sm text-[#18181b] list-disc list-inside space-y-0.5">
                      {exp.achievements.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {data.education.length > 0 && (
        <>
          <div className="border-b border-[#e4e4e7] my-6" style={{ borderWidth: 1 }} />
          <section>
            <h2 className="text-[#a1a1aa] text-xs uppercase tracking-widest mb-3">Education</h2>
            <ul className="space-y-4">
              {data.education.map((edu) => (
                <li key={edu.id}>
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-medium text-sm">{edu.degree}</span>
                    <span className="text-[#a1a1aa] text-xs shrink-0">
                      {edu.startDate}
                      {edu.endDate ? ` – ${edu.isCurrent ? 'Present' : edu.endDate}` : ''}
                    </span>
                  </div>
                  <p className="text-[#a1a1aa] text-xs mt-0.5">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                  {(edu.gpa || edu.honors.length > 0) && (
                    <p className="text-sm mt-1">
                      {[edu.gpa, ...edu.honors].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <div className="border-b border-[#e4e4e7] my-6" style={{ borderWidth: 1 }} />
      <div className="grid grid-cols-2 gap-12 mt-6">
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-[#a1a1aa] text-xs uppercase tracking-widest mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span
                  key={s.id}
                  className="text-xs px-2 py-1 border border-[#18181b] rounded"
                  style={{ borderWidth: 1 }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            <h2 className="text-[#a1a1aa] text-xs uppercase tracking-widest mb-3">Languages</h2>
            <ul className="space-y-1 text-sm">
              {data.languages.map((lang) => (
                <li key={lang.id}>
                  <span className="font-medium">{lang.name}</span>
                  {lang.level && <span className="text-[#a1a1aa]"> — {lang.level}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
