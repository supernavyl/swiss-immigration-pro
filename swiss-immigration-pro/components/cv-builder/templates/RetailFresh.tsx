'use client'

import type { CVData } from '@/types/cv-builder'

const GREEN = '#14532d'
const GREEN_GRADIENT = 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)'
const GREEN_SOFT = '#dcfce7'

export default function RetailFresh({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperience, education, skills, languages, certifications } = data
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ') || 'Name'

  return (
    <div
      style={{
        width: 794,
        minHeight: 1123,
        fontFamily: 'system-ui, sans-serif',
        fontSize: 11,
        color: '#1e293b',
      }}
    >
      <header style={{ padding: '24px 32px 16px' }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: GREEN }}>{fullName}</h1>
        {personalInfo.title && (
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>{personalInfo.title}</p>
        )}
      </header>
      <div
        style={{
          height: 6,
          background: GREEN_GRADIENT,
          margin: '0 32px',
          borderRadius: 3,
        }}
      />
      <main style={{ padding: '24px 32px', maxWidth: 794 }}>
        {summary && (
          <section style={{ marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: GREEN }}>
              Summary
            </h2>
            <p style={{ margin: 0, lineHeight: 1.5 }}>{summary}</p>
          </section>
        )}
        {workExperience.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: GREEN }}>
              Retail Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {workExperience.map((job) => (
                <div key={job.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 }}>
                    <strong style={{ fontSize: 11 }}>{job.jobTitle}</strong>
                    <span style={{ color: '#64748b', fontSize: 10 }}>
                      {job.startDate} – {job.isCurrent ? 'Present' : job.endDate}
                    </span>
                  </div>
                  <div style={{ color: '#475569' }}>{job.company}{job.location ? ` · ${job.location}` : ''}</div>
                  {job.achievements.length > 0 && (
                    <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                      {job.achievements.map((a, i) => (
                        <li key={i} style={{ marginBottom: 2 }}>{a}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        {education.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: GREEN }}>
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <strong style={{ fontSize: 11 }}>{edu.degree}</strong>
                  <div style={{ color: '#64748b', fontSize: 10 }}>{edu.institution} · {edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {skills.length > 0 && (
            <section>
              <h2 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: GREEN }}>
                Key Skills
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skills.map((s) => (
                  <span
                    key={s.id}
                    style={{
                      backgroundColor: GREEN_SOFT,
                      color: GREEN,
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 10,
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}
          <div>
            {languages.length > 0 && (
              <section style={{ marginBottom: 12 }}>
                <h2 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: GREEN }}>
                  Languages
                </h2>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {languages.map((l) => (
                    <li key={l.id}>{l.name} – {l.level}</li>
                  ))}
                </ul>
              </section>
            )}
            {certifications.length > 0 && (
              <section>
                <h2 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: GREEN }}>
                  Certifications
                </h2>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 10 }}>
                  {certifications.map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
