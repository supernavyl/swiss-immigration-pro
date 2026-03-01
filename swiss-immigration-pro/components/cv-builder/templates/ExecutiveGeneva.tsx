import type { CVData } from '@/types/cv-builder'

const GOLD = '#d4af37'

export default function ExecutiveGeneva({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperience, education, skills, languages, certifications, references } = data
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ')

  return (
    <div
      className="bg-white text-slate-800"
      style={{ width: 794, minHeight: 1123 }}
    >
      {/* Dark gradient header */}
      <div
        className="px-12 py-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        }}
      >
        <div className="flex items-center justify-between gap-6">
          <div>
            {fullName && (
              <h1
                className="text-3xl font-bold tracking-tight"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', color: GOLD }}
              >
                {fullName}
              </h1>
            )}
            {personalInfo.title && (
              <p className="text-white/90 text-lg mt-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {personalInfo.title}
              </p>
            )}
          </div>
          {personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt=""
              width={100}
              height={100}
              className="object-cover rounded-lg flex-shrink-0"
            />
          )}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-sm text-white/80">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.city || personalInfo.country) && (
            <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
          )}
        </div>
      </div>

      <div className="px-12 py-8">
        {summary && (
          <section className="mb-8">
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-2"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              Executive Summary
            </h2>
            <p className="text-slate-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {workExperience.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-4 border-b pb-2"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              Leadership Experience
            </h2>
            <div className="space-y-6">
              {workExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2">
                    <div>
                      <span className="font-semibold text-slate-900 text-lg">{exp.jobTitle}</span>
                      {exp.company && <span className="text-slate-600"> — {exp.company}</span>}
                    </div>
                    <span className="text-sm text-slate-500 whitespace-nowrap">
                      {exp.startDate}{exp.endDate ? ` – ${exp.isCurrent ? 'Present' : exp.endDate}` : ''}
                    </span>
                  </div>
                  {exp.location && <p className="text-sm text-slate-500 mt-0.5">{exp.location}</p>}
                  {exp.achievements.length > 0 && (
                    <ul className="mt-3 text-slate-700 list-disc pl-5 space-y-1">
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

        {/* Two-column bottom: skills and languages */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {skills.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-2"
                style={{ borderColor: GOLD, color: GOLD }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="text-sm px-2 py-1 rounded border"
                    style={{ borderColor: GOLD, color: '#1a1a2e' }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-2"
                style={{ borderColor: GOLD, color: GOLD }}
              >
                Languages
              </h2>
              <div className="space-y-2">
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

        {/* Certifications inline */}
        {certifications.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-2"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              Certifications
            </h2>
            <p className="text-slate-700">
              {certifications.map((c, i) => (
                <span key={c.id}>
                  <span className="font-medium text-slate-800">{c.name}</span>
                  {(c.issuer || c.date) && (
                    <span className="text-slate-600">
                      {' '}({c.issuer}{c.issuer && c.date ? ', ' : ''}{c.date})
                    </span>
                  )}
                  {i < certifications.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </p>
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-2"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <span className="font-semibold text-slate-900">{edu.degree}</span>
                  {edu.institution && <span className="text-slate-600"> — {edu.institution}</span>}
                  <p className="text-sm text-slate-500">
                    {edu.startDate}{edu.endDate ? ` – ${edu.isCurrent ? 'Present' : edu.endDate}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {references.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-2"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              References
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {references.map((ref) => (
                <div key={ref.id}>
                  <p className="font-medium text-slate-800">{ref.name}, {ref.title}</p>
                  {ref.company && <p className="text-slate-600">{ref.company}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
