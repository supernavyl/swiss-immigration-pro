'use client'

import type { CVData } from '@/types/cv-builder'

const HEADER_RED = '#be123c'
const PINK_SUB = '#e11d48'
const PINK_BG = '#fce7f3'
const PINK_BORDER = '#ec4899'

export default function MarketingBold({ data }: { data: CVData }) {
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
      <header
        style={{
          backgroundColor: HEADER_RED,
          color: '#fff',
          padding: '28px 32px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>{fullName}</h1>
        {personalInfo.title && (
          <p style={{ margin: '6px 0 0', fontSize: 14, color: PINK_BG, fontWeight: 500 }}>{personalInfo.title}</p>
        )}
      </header>
      <main style={{ padding: '24px 32px' }}>
        {summary && (
          <section style={{ marginBottom: 20 }}>
            <div
              style={{
                backgroundColor: PINK_BG,
                borderLeft: `4px solid ${PINK_BORDER}`,
                padding: '14px 18px',
                borderRadius: '0 6px 6px 0',
              }}
            >
              <h2 style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: HEADER_RED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Summary
              </h2>
              <p style={{ margin: 0, lineHeight: 1.5 }}>{summary}</p>
            </div>
          </section>
        )}
        {workExperience.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: HEADER_RED, borderBottom: `2px solid ${PINK_BORDER}`, paddingBottom: 4 }}>
              Campaign History
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {workExperience.map((job) => (
                <div key={job.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 }}>
                    <strong style={{ fontSize: 12 }}>{job.jobTitle}</strong>
                    <span style={{ color: '#64748b', fontSize: 10 }}>
                      {job.startDate} – {job.isCurrent ? 'Present' : job.endDate}
                    </span>
                  </div>
                  <div style={{ color: PINK_SUB, fontSize: 11 }}>{job.company}{job.location ? ` · ${job.location}` : ''}</div>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            {skills.length > 0 && (
              <section style={{ marginBottom: 18 }}>
                <h2 style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: HEADER_RED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Toolkit
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {skills.map((s) => (
                    <span
                      key={s.id}
                      style={{
                        backgroundColor: PINK_BG,
                        color: HEADER_RED,
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 500,
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {education.length > 0 && (
              <section>
                <h2 style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: HEADER_RED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
          </div>
          <div>
            {languages.length > 0 && (
              <section style={{ marginBottom: 18 }}>
                <h2 style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: HEADER_RED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                <h2 style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: HEADER_RED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Certifications
                </h2>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 10 }}>
                  {certifications.map((c) => (
                    <li key={c.id}>{c.name} · {c.issuer}</li>
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
