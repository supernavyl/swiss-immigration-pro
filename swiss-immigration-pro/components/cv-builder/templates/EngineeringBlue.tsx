import type { CVData } from '@/types/cv-builder'

export default function EngineeringBlue({ data }: { data: CVData }) {
  const pi = data.personalInfo
  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: 'Inter, sans-serif', fontSize: '9.5pt', lineHeight: 1.45, color: '#1e293b' }}>
      {/* Header */}
      <div style={{ background: '#1e3a5f', color: '#fff', padding: '50px 56px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '20pt', fontWeight: 700 }}>{pi.firstName} {pi.lastName}</div>
            {pi.title && <div style={{ fontSize: '10pt', color: '#93c5fd' }}>{pi.title}</div>}
            <div style={{ display: 'flex', gap: 12, marginTop: 8, color: '#bfdbfe', fontSize: '8.5pt', flexWrap: 'wrap' }}>
              {pi.email && <span>{pi.email}</span>}
              {pi.phone && <span>{pi.phone}</span>}
              {pi.city && <span>{pi.city}</span>}
            </div>
          </div>
          {pi.photoUrl && <img src={pi.photoUrl} alt="" style={{ width: 110, height: 140, borderRadius: 4, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }} />}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 40, padding: '36px 56px' }}>
        {/* Left */}
        <div style={{ flex: 1.3 }}>
          {data.summary && (
            <>
              <div style={{ fontSize: '9.5pt', color: '#1e3a5f', borderBottom: '2px solid #2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: 4, marginBottom: 8 }}>Profile</div>
              <p style={{ color: '#334155', marginBottom: 14 }}>{data.summary}</p>
            </>
          )}

          {data.workExperience.length > 0 && (
            <>
              <div style={{ fontSize: '9.5pt', color: '#1e3a5f', borderBottom: '2px solid #2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: 4, marginTop: 14, marginBottom: 8 }}>Engineering Experience</div>
              {data.workExperience.map((job) => (
                <div key={job.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>{job.jobTitle}</span>
                    <span style={{ fontSize: '8.5pt', color: '#64748b' }}>{job.startDate} – {job.endDate || 'Present'}</span>
                  </div>
                  <div style={{ color: '#475569', fontWeight: 500 }}>{job.company}</div>
                  {job.achievements.length > 0 && (
                    <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none' }}>
                      {job.achievements.filter(Boolean).map((a, i) => (
                        <li key={i} style={{ paddingLeft: 14, position: 'relative', marginBottom: 2 }}>
                          <span style={{ position: 'absolute', left: 0, color: '#2563eb' }}>▸</span>{a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}

          {data.projects.length > 0 && (
            <>
              <div style={{ fontSize: '9.5pt', color: '#1e3a5f', borderBottom: '2px solid #2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: 4, marginTop: 14, marginBottom: 8 }}>Key Projects</div>
              {data.projects.map((p) => (
                <div key={p.id} style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                  <p style={{ fontSize: '8.5pt', color: '#475569' }}>{p.description}</p>
                  {p.technologies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 3 }}>
                      {p.technologies.map((t, i) => (
                        <span key={i} style={{ fontSize: '7.5pt', padding: '1px 6px', background: '#eff6ff', color: '#1e40af', borderRadius: 3 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right */}
        <div style={{ flex: 0.7 }}>
          {data.skills.length > 0 && (
            <>
              <div style={{ fontSize: '9.5pt', color: '#1e3a5f', borderBottom: '2px solid #2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: 4, marginBottom: 8 }}>Technical Skills</div>
              {data.skills.map((s) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '2px 0', fontSize: '8.5pt' }}>
                  <span>{s.name}</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} style={{ width: 10, height: 10, borderRadius: 1, background: i <= s.proficiency ? '#2563eb' : '#e2e8f0' }} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {data.education.length > 0 && (
            <>
              <div style={{ fontSize: '9.5pt', color: '#1e3a5f', borderBottom: '2px solid #2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: 4, marginTop: 14, marginBottom: 8 }}>Education</div>
              {data.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 6 }}>
                  <strong style={{ fontSize: '8.5pt' }}>{edu.degree}</strong>
                  <div style={{ fontSize: '8pt', color: '#64748b' }}>{edu.institution}<br />{edu.endDate}</div>
                </div>
              ))}
            </>
          )}

          {data.certifications.length > 0 && (
            <>
              <div style={{ fontSize: '9.5pt', color: '#1e3a5f', borderBottom: '2px solid #2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: 4, marginTop: 14, marginBottom: 8 }}>Certifications</div>
              {data.certifications.map((c) => (
                <div key={c.id} style={{ fontSize: '8.5pt', marginBottom: 3 }}>{c.name}</div>
              ))}
            </>
          )}

          {data.languages.length > 0 && (
            <>
              <div style={{ fontSize: '9.5pt', color: '#1e3a5f', borderBottom: '2px solid #2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: 4, marginTop: 14, marginBottom: 8 }}>Languages</div>
              {data.languages.map((lang) => (
                <div key={lang.id} style={{ fontSize: '8.5pt', padding: '2px 0' }}>{lang.name} — {lang.level}</div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
