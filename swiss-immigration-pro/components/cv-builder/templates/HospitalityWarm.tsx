'use client'

import type { CVData } from '@/types/cv-builder'

const AMBER = '#b45309'
const AMBER_LIGHT = '#fef3c7'
const AMBER_GRADIENT = 'linear-gradient(90deg, #f59e0b 0%, #d97706 50%, #b45309 100%)'

const CEFR_TO_PERCENT: Record<string, number> = {
  A1: 16, A2: 33, B1: 50, B2: 66, C1: 83, C2: 100, Native: 100,
}

export default function HospitalityWarm({ data }: { data: CVData }) {
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
          borderTop: `4px solid ${AMBER}`,
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {personalInfo.photoUrl && (
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={personalInfo.photoUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1c1917' }}>{fullName}</h1>
          {personalInfo.title && (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: AMBER }}>{personalInfo.title}</p>
          )}
          {(personalInfo.email || personalInfo.phone) && (
            <p style={{ margin: '6px 0 0', fontSize: 10, color: '#64748b' }}>
              {[personalInfo.email, personalInfo.phone].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </header>
      <main style={{ padding: '0 32px 28px' }}>
        {languages.length > 0 && (
          <section style={{ marginBottom: 22 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: AMBER }}>
              Languages
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {languages.map((l) => {
                const pct = CEFR_TO_PERCENT[l.level] ?? 50
                return (
                  <div key={l.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 500 }}>{l.name}</span>
                      <span style={{ fontSize: 10, color: '#64748b' }}>{l.level}</span>
                    </div>
                    <div
                      style={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: AMBER_LIGHT,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: AMBER_GRADIENT,
                          borderRadius: 5,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
        {summary && (
          <section style={{ marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: AMBER }}>
              Summary
            </h2>
            <p style={{ margin: 0, lineHeight: 1.5 }}>{summary}</p>
          </section>
        )}
        {workExperience.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: AMBER }}>
              Service Experience
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
            <h2 style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: AMBER }}>
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
              <h2 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: AMBER }}>
                Service Skills
              </h2>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {skills.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </section>
          )}
          {certifications.length > 0 && (
            <section>
              <h2 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: AMBER }}>
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
      </main>
    </div>
  )
}
