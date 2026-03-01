import type { CVData } from '@/types/cv-builder'

export default function TechStartup({ data }: { data: CVData }) {
  const pi = data.personalInfo
  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: 'Inter, sans-serif', fontSize: '9.5pt', lineHeight: 1.45, color: '#1e293b' }}>
      {/* Header */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '56px 56px 42px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '20pt', fontWeight: 700 }}>{pi.firstName} {pi.lastName}</div>
            {pi.title && <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '10pt', color: '#818cf8', marginTop: 2 }}>// {pi.title}</div>}
            <div style={{ display: 'flex', gap: 12, marginTop: 10, color: '#94a3b8', fontFamily: 'ui-monospace, monospace', fontSize: '8pt', flexWrap: 'wrap' }}>
              {pi.email && <span>{pi.email}</span>}
              {pi.phone && <span>{pi.phone}</span>}
              {pi.githubUrl && <span>{pi.githubUrl}</span>}
              {pi.linkedinUrl && <span>{pi.linkedinUrl}</span>}
            </div>
          </div>
          {pi.photoUrl && <img src={pi.photoUrl} alt="" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }} />}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 40, padding: '36px 56px' }}>
        {/* Left */}
        <div style={{ flex: 1.3 }}>
          {data.summary && (
            <>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '9pt', color: '#6366f1', borderBottom: '2px solid #6366f1', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', paddingBottom: 3, marginBottom: 8 }}>README</div>
              <p style={{ color: '#334155', marginBottom: 14 }}>{data.summary}</p>
            </>
          )}

          {data.workExperience.length > 0 && (
            <>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '9pt', color: '#6366f1', borderBottom: '2px solid #6366f1', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', paddingBottom: 3, marginTop: 14, marginBottom: 8 }}>EXPERIENCE</div>
              {data.workExperience.map((job) => (
                <div key={job.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>{job.jobTitle}</span>
                    <span style={{ fontSize: '8.5pt', color: '#64748b' }}>{job.startDate} – {job.endDate || 'Present'}</span>
                  </div>
                  <div style={{ color: '#475569', fontWeight: 500 }}>{job.company}</div>
                  {job.achievements.length > 0 && (
                    <ul style={{ margin: '4px 0 0 0', padding: 0, listStyle: 'none' }}>
                      {job.achievements.filter(Boolean).map((a, i) => (
                        <li key={i} style={{ paddingLeft: 14, position: 'relative', marginBottom: 2 }}>
                          <span style={{ position: 'absolute', left: 0, color: '#6366f1' }}>→</span>{a}
                        </li>
                      ))}
                    </ul>
                  )}
                  {job.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
                      {job.tags.map((t, i) => (
                        <span key={i} style={{ fontFamily: 'ui-monospace, monospace', fontSize: '7.5pt', padding: '1px 6px', background: '#f1f5f9', borderRadius: 2, color: '#475569' }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {data.projects.length > 0 && (
            <>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '9pt', color: '#6366f1', borderBottom: '2px solid #6366f1', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', paddingBottom: 3, marginTop: 14, marginBottom: 8 }}>PROJECTS</div>
              {data.projects.map((p) => (
                <div key={p.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                    {p.url && <span style={{ fontSize: '8.5pt', color: '#64748b' }}>{p.url}</span>}
                  </div>
                  <p style={{ fontSize: '8.5pt', color: '#475569' }}>{p.description}</p>
                  {p.technologies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
                      {p.technologies.map((t, i) => (
                        <span key={i} style={{ fontFamily: 'ui-monospace, monospace', fontSize: '7.5pt', padding: '1px 6px', background: '#f1f5f9', borderRadius: 2, color: '#475569' }}>{t}</span>
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
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '9pt', color: '#6366f1', borderBottom: '2px solid #6366f1', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', paddingBottom: 3, marginBottom: 8 }}>STACK</div>
              {data.skills.map((s) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
                  <span style={{ fontSize: '8.5pt', flex: 1 }}>{s.name}</span>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i <= s.proficiency ? '#6366f1' : '#e2e8f0' }} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {data.languages.length > 0 && (
            <>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '9pt', color: '#6366f1', borderBottom: '2px solid #6366f1', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', paddingBottom: 3, marginTop: 14, marginBottom: 8 }}>LANGUAGES</div>
              {data.languages.map((lang) => (
                <div key={lang.id} style={{ fontSize: '8.5pt', padding: '3px 0' }}>{lang.name} <strong style={{ color: '#6366f1' }}>{lang.level}</strong></div>
              ))}
            </>
          )}

          {data.education.length > 0 && (
            <>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '9pt', color: '#6366f1', borderBottom: '2px solid #6366f1', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', paddingBottom: 3, marginTop: 14, marginBottom: 8 }}>EDUCATION</div>
              {data.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 6 }}>
                  <strong style={{ fontSize: '8.5pt' }}>{edu.degree}</strong>
                  <div style={{ fontSize: '8pt', color: '#64748b' }}>{edu.institution}<br />{edu.endDate || edu.startDate}</div>
                </div>
              ))}
            </>
          )}

          {data.certifications.length > 0 && (
            <>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '9pt', color: '#6366f1', borderBottom: '2px solid #6366f1', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', paddingBottom: 3, marginTop: 14, marginBottom: 8 }}>CERTS</div>
              {data.certifications.map((c) => (
                <div key={c.id} style={{ fontSize: '8.5pt', marginBottom: 4 }}>{c.name}</div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
