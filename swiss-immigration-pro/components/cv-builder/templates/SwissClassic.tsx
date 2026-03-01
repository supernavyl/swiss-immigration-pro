import type { CVData } from '@/types/cv-builder'

const PADDING = 68
const PHOTO_SIZE = 120
const PRIMARY = '#1a1a2e'

export default function SwissClassic({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperience, education, skills, languages, certifications, references } = data
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ')
  const contactParts = [personalInfo.email, personalInfo.phone, personalInfo.address ? [personalInfo.address, personalInfo.postalCode, personalInfo.city].filter(Boolean).join(', ') : null].filter(Boolean)

  return (
    <div
      className="bg-white text-slate-800"
      style={{
        width: 794,
        minHeight: 1123,
        padding: PADDING,
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between gap-4"
        style={{ backgroundColor: PRIMARY, color: 'white', margin: `0 -${PADDING}px`, padding: '20px 68px' }}
      >
        <div className="flex items-center gap-4">
          {personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt=""
              width={PHOTO_SIZE}
              height={PHOTO_SIZE}
              className="object-cover flex-shrink-0"
              style={{ borderRadius: 4 }}
            />
          )}
          <div>
            {fullName && <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>{fullName}</h1>}
            {personalInfo.title && <p className="text-white/90 text-sm mt-0.5">{personalInfo.title}</p>}
          </div>
        </div>
      </div>

      {/* Contact row */}
      {contactParts.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-4 text-slate-600 border-b border-slate-200 pb-3">
          {contactParts.map((part, i) => (
            <span key={i}>{part}</span>
          ))}
        </div>
      )}

      {/* Swiss info grid */}
      {(personalInfo.dateOfBirth || personalInfo.nationality || personalInfo.maritalStatus || personalInfo.permitType) && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm mt-4">
          {personalInfo.dateOfBirth && <div><span className="text-slate-500">Date of birth:</span> {personalInfo.dateOfBirth}</div>}
          {personalInfo.nationality && <div><span className="text-slate-500">Nationality:</span> {personalInfo.nationality}</div>}
          {personalInfo.maritalStatus && <div><span className="text-slate-500">Marital status:</span> {personalInfo.maritalStatus}</div>}
          {personalInfo.permitType && <div><span className="text-slate-500">Permit:</span> {personalInfo.permitType}</div>}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Summary</h2>
          <p className="text-sm italic text-slate-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {workExperience.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Experience</h2>
          <div className="space-y-4">
            {workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <div>
                    <span className="font-semibold text-slate-900">{exp.jobTitle}</span>
                    {exp.company && <span className="text-slate-600"> — {exp.company}</span>}
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {exp.startDate}{exp.endDate ? ` – ${exp.isCurrent ? 'Present' : exp.endDate}` : ''}
                  </span>
                </div>
                {exp.location && <p className="text-xs text-slate-500 mt-0.5">{exp.location}</p>}
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

      {/* Education */}
      {education.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-slate-900">{edu.degree}</span>
                  <span className="text-xs text-slate-500">
                    {edu.startDate}{edu.endDate ? ` – ${edu.isCurrent ? 'Present' : edu.endDate}` : ''}
                  </span>
                </div>
                {edu.institution && <p className="text-sm text-slate-600">{edu.institution}</p>}
                {edu.location && <p className="text-xs text-slate-500">{edu.location}</p>}
                {edu.honors.length > 0 && (
                  <p className="text-xs text-slate-600 mt-1">{edu.honors.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s.id}
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: '#f1f5f9' }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Languages</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between">
                <span className="font-medium text-slate-700">{lang.name}</span>
                <span className="text-slate-500">{lang.level}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Certifications</h2>
          <div className="space-y-1 text-sm">
            {certifications.map((c) => (
              <div key={c.id}>
                <span className="font-medium text-slate-800">{c.name}</span>
                {c.issuer && <span className="text-slate-600"> — {c.issuer}</span>}
                {c.date && <span className="text-slate-500 text-xs"> ({c.date})</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {references.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">References</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {references.map((ref) => (
              <div key={ref.id}>
                <p className="font-medium text-slate-800">{ref.name}, {ref.title}</p>
                {ref.company && <p className="text-slate-600">{ref.company}</p>}
                {ref.email && <p className="text-slate-500 text-xs">{ref.email}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
