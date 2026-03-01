'use client'

import type { CVData } from '@/types/cv-builder'

const ACCENT = '#3b82f6'
const SIDEBAR_BG = '#0f172a'

export default function ConsultantElite({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperience, education, skills, languages, certifications } = data
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ') || 'Name'
  const hasContact = personalInfo.email || personalInfo.phone || personalInfo.address || personalInfo.city

  return (
    <div
      style={{
        width: 794,
        minHeight: 1123,
        display: 'flex',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 11,
        color: '#1e293b',
      }}
    >
      <aside
        style={{
          width: 256,
          minHeight: 1123,
          backgroundColor: SIDEBAR_BG,
          color: '#fff',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {personalInfo.photoUrl && (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto',
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
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>{fullName}</h1>
          {personalInfo.title && (
            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>{personalInfo.title}</p>
          )}
        </div>
        {hasContact && (
          <section>
            <h2 style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contact
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, color: '#cbd5e1' }}>
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {(personalInfo.address || personalInfo.city) && (
                <span>
                  {[personalInfo.address, personalInfo.postalCode, personalInfo.city].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </section>
        )}
        {skills.length > 0 && (
          <section>
            <h2 style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Skills
            </h2>
            <ul style={{ margin: 0, paddingLeft: 16, color: '#cbd5e1' }}>
              {skills.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </section>
        )}
        {languages.length > 0 && (
          <section>
            <h2 style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Languages
            </h2>
            <ul style={{ margin: 0, paddingLeft: 16, color: '#cbd5e1' }}>
              {languages.map((l) => (
                <li key={l.id}>{l.name} – {l.level}</li>
              ))}
            </ul>
          </section>
        )}
        {certifications.length > 0 && (
          <section>
            <h2 style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Certifications
            </h2>
            <ul style={{ margin: 0, paddingLeft: 16, color: '#cbd5e1', fontSize: 10 }}>
              {certifications.map((c) => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
          </section>
        )}
      </aside>
      <main
        style={{
          flex: 1,
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {summary && (
          <section>
            <h2 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: ACCENT, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 4 }}>
              Executive Summary
            </h2>
            <p style={{ margin: 0, lineHeight: 1.5 }}>{summary}</p>
          </section>
        )}
        {workExperience.length > 0 && (
          <section>
            <h2 style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: ACCENT, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 4 }}>
              Engagement History
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
                  <div style={{ color: '#475569', fontSize: 11 }}>{job.company}{job.location ? ` · ${job.location}` : ''}</div>
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
          <section>
            <h2 style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: ACCENT, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 4 }}>
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 }}>
                    <strong style={{ fontSize: 11 }}>{edu.degree}</strong>
                    <span style={{ color: '#64748b', fontSize: 10 }}>
                      {edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate}
                    </span>
                  </div>
                  <div style={{ color: '#475569' }}>{edu.institution}{edu.location ? ` · ${edu.location}` : ''}</div>
                  {edu.honors.length > 0 && (
                    <div style={{ marginTop: 4, fontSize: 10, color: '#64748b' }}>{edu.honors.join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
