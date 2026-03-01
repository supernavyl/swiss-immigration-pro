// Enhanced Module: IMM-03 - Swiss CV Templates and Examples
// Based on Swiss professional standards and SEM employment documentation requirements

export const imm03Enhanced = {
  id: 'imm-03-enhanced',
  title: 'Swiss CV Templates and Interactive Builder',
  description: 'Access comprehensive Swiss CV templates for every career level and industry. Includes ready-to-use formats with real example content, Swiss vs. international format comparison, ATS optimization checklist, and sector-specific templates for tech, finance, pharma, and consulting.',
  estimatedReadTime: '75-95 minutes',
  lastUpdated: 'February 2026',
  sections: [
    {
      id: 'swiss-cv-standards',
      title: 'Swiss CV Standards: What Makes a Swiss CV Different',
      content: `## Swiss CV Standards: Key Differences from US/UK CVs

A Swiss CV (Lebenslauf in German, Curriculum Vitae in French) follows specific conventions that differ significantly from American résumés and British CVs. Ignoring these conventions marks you immediately as inexperienced with Swiss hiring culture — and in a job market where recruiters screen 200+ applicants for a single position, that first impression matters.

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 2rem 0;">
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">2–3 Pages</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Standard Length</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">Photo Required</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Professional Headshot</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">DOB + Nationality</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Always Included</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">Gaps Explained</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">No Unexplained Breaks</div>
  </div>
</div>

### Swiss CV vs. US Résumé vs. UK CV: Side-by-Side Comparison

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Element</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Swiss CV</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">US Résumé</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">UK CV</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Length</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">2–3 pages (always)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">1 page (strict)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">2 pages</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Photo</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Required (professional, top right)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Never</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Optional</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Date of Birth</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Required</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Illegal to request</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Not included</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Nationality</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Required + permit status</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Work authorization only</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Optional</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Marital Status</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Common (optional but normal)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Never</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Not included</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Employment Gaps</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Must explain every gap (e.g., "Sprachaufenthalt", "Elternzeit")</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Functional format hides gaps</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Brief explanation expected</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Hobbies/Interests</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Expected — shows character</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Rarely included</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Sometimes included</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">References</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">"References upon request" or list at end</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">"References available"</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Referees listed</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Objective Statement</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Rarely used; profile paragraph more common</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Common</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Personal statement common</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Language Certificates</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Prominently listed with CEFR levels</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Listed briefly</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Listed</td>
    </tr>
  </tbody>
</table>

### Swiss CV Section Order (Standard)

1. **Personal details** (name, address, phone, email, photo) — top right
2. **Professional profile** (3–5 sentence summary) — optional but increasingly common
3. **Professional experience** (reverse chronological) — main body
4. **Education and training** (reverse chronological)
5. **Additional qualifications** (certifications, courses, licenses)
6. **Language skills** (with CEFR levels where possible)
7. **IT/technical skills**
8. **Personal interests/hobbies** (Persönliches/Freizeitaktivitäten)
9. **References** (Referenzen/Zeugnisse upon request, or listed)
10. **Date and signature** — bottom right (formal requirement in many companies)

### Photo Requirements

- Professional headshot, not casual (no beach photos, group shots, or selfies)
- Passport-style recommended: neutral background, business attire
- Size: 3×4 cm, top right corner of page 1
- Widely accepted photographers: Foto Müller, FotoStudio chains (CHF 30–80 for CV photos)
- Digital format: embed in Word/PDF — do not attach as separate file`,
      keyPoints: [
        'Swiss CVs are 2–3 pages (never 1 page) and must include a professional photo, date of birth, and nationality',
        'All employment gaps must be explained — "Sprachaufenthalt" (language stay), "Elternzeit" (parental leave), "Krankheit" (illness) are all acceptable',
        'Hobbies and personal interests are expected, not optional — they signal cultural fit and character',
        'Include permit status clearly (e.g., "Aufenthaltsbewilligung B, Kanton Zürich") — witholding this information raises red flags',
        'Unlike US résumés, Swiss CVs include marital status, number of children, and other personal details routinely (legal in Switzerland)'
      ],
      legalReferences: [
        'DSG — Bundesgesetz über den Datenschutz (new version, SR 235.1, in force since Sep 2023)',
        'OR Art. 319–362 — Swiss Code of Obligations (employment contract provisions)',
        'GlG — Gleichstellungsgesetz (Gender Equality Act, SR 151.1)',
        'AuG/LEI Art. 21 — Priority of domestic workers (documented labour market test)'
      ],
      officialLinks: [
        { title: 'SEM — Employment of Foreign Nationals', url: 'https://www.sem.admin.ch/sem/de/home/themen/arbeit.html' },
        { title: 'SECO — Swiss Job Platform (job-room.ch)', url: 'https://www.job-room.ch' },
        { title: 'Swiss Employer Certificate Standards (Arbeitszeugnis)', url: 'https://www.arbeit.swiss/seeker/tools-ratgeber/arbeitszeugnis.html' }
      ],
      subsections: [
        {
          id: 'entry-level-template',
          title: 'Entry-Level CV Template: Technology (Recent Graduate)',
          content: `## Entry-Level Swiss CV — Complete Example

**Profile:** Lena Meier, Computer Science BSc graduate from ETH Zürich, applying for a Junior Software Engineer position at a Zurich tech company.

---

<div style="border: 2px solid #3b82f6; border-radius: 0.5rem; padding: 1.5rem; margin: 1.5rem 0; background: #f8fafc;">

<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
<div>
<div style="font-size: 1.5rem; font-weight: 700; color: #1e40af;">Lena Meier</div>
<div style="color: #374151; margin-top: 0.25rem;">Seefeldstrasse 47, 8008 Zürich</div>
<div style="color: #374151;">+41 79 456 78 90 · lena.meier@gmail.com</div>
<div style="color: #374151;">linkedin.com/in/lena-meier · github.com/lena-meier</div>
</div>
<div style="width: 70px; height: 90px; background: #e5e7eb; border: 1px solid #9ca3af; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: #6b7280; text-align: center;">[CV Photo 3×4cm]</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Persönliche Angaben</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem; font-size: 0.875rem; color: #374151;">
  <div><strong>Geburtsdatum:</strong> 12. März 2001</div>
  <div><strong>Zivilstand:</strong> Ledig</div>
  <div><strong>Nationalität:</strong> Schweizerin</div>
  <div><strong>Heimatort:</strong> Winterthur ZH</div>
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Berufsprofil</div>
<div style="font-size: 0.875rem; color: #374151; line-height: 1.6;">Engagierte Software-Ingenieurin mit Bachelor-Abschluss in Informatik von der ETH Zürich (Note: 5.2). Schwerpunkte in maschinellem Lernen, verteilten Systemen und Web-Entwicklung. Erste praktische Erfahrung durch Internship bei Zühlke Engineering AG und selbständige Projekte auf GitHub (1,200+ Stars). Suche nach einer Junior-Position, in der ich meine technischen Fähigkeiten in einem agilen Team einbringen und weiterentwickeln kann.</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Berufliche Erfahrung</div>

<div style="margin-bottom: 1rem;">
  <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
    <div><strong>Software Engineer Intern</strong> — Zühlke Engineering AG, Schlieren</div>
    <div style="color: #6b7280;">Aug 2023 – Feb 2024</div>
  </div>
  <ul style="font-size: 0.875rem; color: #374151; margin-top: 0.5rem; padding-left: 1.5rem; line-height: 1.6;">
    <li>Entwicklung von RESTful APIs in Python/FastAPI für ein Medizintechnik-Datenerfassungssystem (reguliertes Umfeld, ISO 13485)</li>
    <li>Refaktorierung eines Legacy-Dienstes (15'000 Zeilen Java) auf Microservices-Architektur — Reduktion der Latenz um 40%</li>
    <li>Implementierung von Unit- und Integrationstests (pytest, coverage 87%), CI/CD-Pipeline in GitLab</li>
    <li>Teilnahme an 2-wöchigen Sprints; Code-Reviews mit erfahrenen Senior Engineers</li>
  </ul>
</div>

<div style="margin-bottom: 1rem;">
  <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
    <div><strong>Hilfsassistentin Informatik</strong> — ETH Zürich, Institut für Maschinelles Lernen</div>
    <div style="color: #6b7280;">Sep 2022 – Jun 2023</div>
  </div>
  <ul style="font-size: 0.875rem; color: #374151; margin-top: 0.5rem; padding-left: 1.5rem; line-height: 1.6;">
    <li>Betreuung von 45 Studierenden im Kurs «Machine Learning» (Prof. Krause); Korrektur von Programmieraufgaben (Python, PyTorch)</li>
    <li>Erstellung von 12 Übungsblättern und Musterlösungen für neuronale Netze und Optimierungsalgorithmen</li>
  </ul>
</div>

<div>
  <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
    <div><strong>Werkstudentin Web-Entwicklung</strong> — LocalHelper GmbH, Zürich (Start-up)</div>
    <div style="color: #6b7280;">Okt 2021 – Jul 2022</div>
  </div>
  <ul style="font-size: 0.875rem; color: #374151; margin-top: 0.5rem; padding-left: 1.5rem; line-height: 1.6;">
    <li>Entwicklung von Frontend-Komponenten (React, TypeScript) für eine Dienstleistungsplattform mit 8'000 aktiven Nutzern</li>
    <li>Integration von Stripe-Zahlungsabwicklung; Implementierung von Datenschutz-Compliance gemäss nDSG</li>
  </ul>
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Ausbildung</div>

<div style="margin-bottom: 0.75rem; font-size: 0.875rem;">
  <div style="display: flex; justify-content: space-between;">
    <div><strong>Bachelor of Science Informatik</strong> — ETH Zürich</div>
    <div style="color: #6b7280;">Sep 2020 – Feb 2024</div>
  </div>
  <div style="color: #374151; margin-top: 0.25rem;">Notendurchschnitt: 5.2/6.0 · Vertiefung: Maschinelles Lernen</div>
  <div style="color: #374151;">Bachelorarbeit: «Efficient Transformer Architectures for Resource-Constrained Edge Devices» (Note: 5.75)</div>
</div>

<div style="font-size: 0.875rem;">
  <div style="display: flex; justify-content: space-between;">
    <div><strong>Kantonsschule Rychenberg</strong> — Winterthur, Matura</div>
    <div style="color: #6b7280;">Aug 2016 – Jun 2020</div>
  </div>
  <div style="color: #374151; margin-top: 0.25rem;">Schwerpunktfach: Physik und Anwendungen der Mathematik · Gesamtnote: 5.4</div>
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Technische Kenntnisse</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem; color: #374151;">
  <div><strong>Programmiersprachen:</strong> Python (expert), Java (fortgeschritten), TypeScript/JavaScript (fortgeschritten), SQL, Go (Grundkenntnisse)</div>
  <div><strong>Frameworks/Libraries:</strong> FastAPI, Django, React, PyTorch, TensorFlow, scikit-learn</div>
  <div><strong>Tools/Infrastruktur:</strong> Docker, Kubernetes, AWS (EC2/S3/Lambda), GitLab CI/CD, PostgreSQL, Redis</div>
  <div><strong>Methodik:</strong> Agile/Scrum, TDD, Clean Code, Microservices-Architektur</div>
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Sprachkenntnisse</div>
<div style="font-size: 0.875rem; color: #374151;">
  Deutsch (Muttersprache) · Englisch (C1, IELTS 7.5, 2023) · Französisch (B2, DELF) · Mandarin (A2)
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Freizeitaktivitäten</div>
<div style="font-size: 0.875rem; color: #374151; line-height: 1.6;">
  Bergsteigen (Mitglied SAC Sektion Zürich; Touren in den Walliser Alpen) · Open-Source-Entwicklung (github.com/lena-meier, 1'200+ Stars auf «swiss-transit-api»-Projekt) · Cello (Kammermusikensemble Hochschule der Künste Zürich)
</div>
</div>

<div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: #374151; border-top: 1px solid #e5e7eb; padding-top: 1rem;">
  <div><strong>Referenzen:</strong> Dr. Thomas Brucker (Zühlke Engineering AG), Prof. Andreas Krause (ETH Zürich) — auf Anfrage</div>
  <div>Zürich, Februar 2026 · <em>Lena Meier</em></div>
</div>

</div>

**Key formatting notes for this template:**
- Note the Swiss convention: dates written as «12. März 2001» not "12/03/2001"
- Numbers use apostrophe as thousands separator: 15'000 not 15,000
- Job titles in German even when company is English-speaking
- Signature line at bottom right (Ort, Datum · Unterschrift)`,
          keyPoints: [
            'Swiss CVs for entry-level positions emphasize GPA, internship specifics, and academic projects — not generic "team player" claims',
            'Personal interests section is substantive: "Bergsteigen (SAC Mitglied)" beats "I enjoy hiking" — specificity signals genuine engagement',
            'Language certifications must include CEFR levels (B2, C1) and certificate name/date — self-assessment only acceptable for native/heritage languages',
            'Swiss date format: "12. März 2001" or "12.03.2001" — never "March 12, 2001" or "12/03/2001"',
            'GitHub profile or portfolio link is now expected for tech roles — include it in the header alongside phone/email'
          ]
        },
        {
          id: 'mid-career-template',
          title: 'Mid-Career CV Template: Finance / Banking',
          content: `## Mid-Career Swiss CV — Finance Sector Example

**Profile:** Marco Ferretti, 6 years in asset management, applying for Senior Portfolio Manager at a Geneva private bank.

---

<div style="border: 2px solid #3b82f6; border-radius: 0.5rem; padding: 1.5rem; margin: 1.5rem 0; background: #f8fafc;">

<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
<div>
<div style="font-size: 1.5rem; font-weight: 700; color: #1e40af;">Marco Ferretti, CFA</div>
<div style="color: #374151; margin-top: 0.25rem;">Route de Chêne 180, 1224 Chêne-Bougeries, Genève</div>
<div style="color: #374151;">+41 78 234 56 78 · marco.ferretti@protonmail.ch</div>
<div style="color: #374151;">linkedin.com/in/marco-ferretti-cfa</div>
</div>
<div style="width: 70px; height: 90px; background: #e5e7eb; border: 1px solid #9ca3af; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: #6b7280; text-align: center;">[Photo]</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Données Personnelles</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem; font-size: 0.875rem; color: #374151;">
  <div><strong>Date de naissance:</strong> 8 juin 1991</div>
  <div><strong>État civil:</strong> Marié, 1 enfant</div>
  <div><strong>Nationalité:</strong> Italienne / Suisse (double)</div>
  <div><strong>Permis:</strong> Citoyen suisse (naturalisé 2021)</div>
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Profil Professionnel</div>
<div style="font-size: 0.875rem; color: #374151; line-height: 1.6;">Gestionnaire de portefeuille CFA avec 6 ans d'expérience en gestion d'actifs institutionnels et en gestion de fortune privée. Spécialisation en obligations d'entreprises investment-grade et stratégies multi-actifs. AUM gérés: USD 340 millions. Historique de surperformance: +2.3% annualisé vs. benchmark sur 4 ans (2020–2024). Cherche poste de Senior Portfolio Manager dans un établissement de gestion de fortune genevois orienté clientèle UHNWI.</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Expérience Professionnelle</div>

<div style="margin-bottom: 1rem;">
  <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
    <div><strong>Portfolio Manager — Obligataire</strong> · Pictet Asset Management, Genève</div>
    <div style="color: #6b7280;">Avr 2021 – présent</div>
  </div>
  <ul style="font-size: 0.875rem; color: #374151; margin-top: 0.5rem; padding-left: 1.5rem; line-height: 1.6;">
    <li>Gestion de deux fonds obligataires (EUR Investment Grade, Global High Yield) avec AUM combinés de USD 340M</li>
    <li>Surperformance nette de +2.3%/an vs. Bloomberg Global Aggregate benchmark sur 4 ans (2020–2024, déclaration GIPS disponible)</li>
    <li>Construction de portefeuilles: sélection de 180+ émetteurs corporate, analyse crédit, modélisation des risques duration/spread</li>
    <li>Coordination avec clients institutionnels (caisses de pension suisses, family offices) — reporting mensuel, appels trimestriels</li>
    <li>Mentoring de 2 analystes juniors; contribution aux présentations au Comité d'investissement mensuel</li>
  </ul>
</div>

<div style="margin-bottom: 1rem;">
  <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
    <div><strong>Analyste Crédit Senior</strong> · UBS Asset Management, Zurich</div>
    <div style="color: #6b7280;">Sep 2018 – Mar 2021</div>
  </div>
  <ul style="font-size: 0.875rem; color: #374151; margin-top: 0.5rem; padding-left: 1.5rem; line-height: 1.6;">
    <li>Couverture de 45 émetteurs corporate (secteurs TMT et industrie, zone euro) pour fonds obligataires (AUM EUR 1.2Mrd)</li>
    <li>Rédaction de 60+ notes d'analyse crédit annuelles; modélisation financière (DCF, LBO, comparables)</li>
    <li>Participation au lancement d'un nouveau fonds ESG obligataire (EUR 180M collectés au premier closing)</li>
  </ul>
</div>

<div>
  <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
    <div><strong>Analyste Crédit</strong> · Mediobanca, Milan (Italie)</div>
    <div style="color: #6b7280;">Sep 2016 – Aug 2018</div>
  </div>
  <ul style="font-size: 0.875rem; color: #374151; margin-top: 0.5rem; padding-left: 1.5rem; line-height: 1.6;">
    <li>Analyse crédit de PME italiennes pour activité leverage finance; participation à 8 transactions (EUR 50–300M)</li>
    <li>Modélisation financière, due diligence, rédaction de mémos crédit pour comités de crédit senior</li>
  </ul>
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Formation</div>

<div style="margin-bottom: 0.75rem; font-size: 0.875rem;">
  <div style="display: flex; justify-content: space-between;">
    <div><strong>CFA Charterholder</strong> (Level III passed) · CFA Institute</div>
    <div style="color: #6b7280;">2022</div>
  </div>
</div>

<div style="font-size: 0.875rem;">
  <div style="display: flex; justify-content: space-between;">
    <div><strong>Master in Finance (MScF)</strong> · HEC Lausanne (UNIL)</div>
    <div style="color: #6b7280;">Sep 2014 – Jun 2016</div>
  </div>
  <div style="color: #374151; margin-top: 0.25rem;">Mention: Très bien · Mémoire: «Credit Default Swap Pricing During Crisis Periods» (note: 5.8/6)</div>
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Langues</div>
<div style="font-size: 0.875rem; color: #374151;">
  Italien (langue maternelle) · Français (C2, bilingue effectif) · Anglais (C1, CFA exams) · Allemand (B2, cours Migros Klubschule 2019–2020)
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Loisirs</div>
<div style="font-size: 0.875rem; color: #374151; line-height: 1.6;">
  Ski de randonnée (Vallée de Chamonix, Verbier) · Lecture de philosophie stoïcienne · Bénévolat comme coach financier auprès de migrants (ONG Caritas Genève, 4h/mois depuis 2022)
</div>
</div>

<div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: #374151; border-top: 1px solid #e5e7eb; padding-top: 1rem;">
  <div><strong>Références:</strong> Fournies sur demande (2 references Pictet + 1 UBS disponibles)</div>
  <div>Genève, février 2026 · <em>Marco Ferretti</em></div>
</div>

</div>

**Finance-specific notes:**
- AUM figures (USD 340M) must be accurate and verifiable — Swiss employers will check
- GIPS compliance reference signals professionalism to asset management recruiters
- CFA designation belongs next to name: "Marco Ferretti, CFA"
- Volunteer work (Caritas) shows social integration — important for naturalized citizens or long-term residents`,
          keyPoints: [
            'Finance CVs must quantify: USD 340M AUM, +2.3% annualized outperformance, EUR 1.2Mrd fund size — vague descriptions are rejected',
            'GIPS (Global Investment Performance Standards) reference is a credibility signal for asset management roles in Switzerland',
            'CFA designation belongs in the name header and is one of the most respected credentials in Geneva/Zurich finance',
            'French-language CV for Geneva roles is not optional — submitting a German or English CV to a Geneva private bank signals poor cultural awareness',
            'Volunteer work in Switzerland (coaching, charitable activity) signals integration and is weighted positively in hiring decisions'
          ]
        },
        {
          id: 'senior-executive-template',
          title: 'Senior/Executive CV Template: Pharma R&D Director',
          content: `## Senior Executive Swiss CV — Life Sciences Example

**Profile:** Dr. Sophie Hirsch, 14 years pharma experience, applying for VP Research & Development at a Roche/Novartis affiliate. German-language CV for Basel.

---

<div style="border: 2px solid #3b82f6; border-radius: 0.5rem; padding: 1.5rem; margin: 1.5rem 0; background: #f8fafc;">

<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
<div>
<div style="font-size: 1.5rem; font-weight: 700; color: #1e40af;">Dr. Sophie Hirsch</div>
<div style="color: #374151; margin-top: 0.25rem;">Rittergasse 22, 4051 Basel · +41 76 678 90 12</div>
<div style="color: #374151;">sophie.hirsch@gmail.com · linkedin.com/in/dr-sophie-hirsch</div>
</div>
<div style="width: 70px; height: 90px; background: #e5e7eb; border: 1px solid #9ca3af; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: #6b7280; text-align: center;">[Photo]</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Persönliche Angaben</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem; font-size: 0.875rem; color: #374151;">
  <div><strong>Geburtsdatum:</strong> 3. September 1983</div>
  <div><strong>Nationalität:</strong> Deutsche / Niederlassungsbewilligung C, Kanton Basel-Stadt</div>
  <div><strong>Zivilstand:</strong> Verheiratet, 2 Kinder</div>
  <div><strong>Heimatadresse:</strong> Basel, seit 2015</div>
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Executive Summary</div>
<div style="font-size: 0.875rem; color: #374151; line-height: 1.6;">Erfahrene R&D-Führungskraft mit 14 Jahren in der pharmazeutischen Industrie (Roche, Novartis, Lonza). Nachgewiesener Erfolg bei der Führung multidisziplinärer Forschungsteams (bis 45 Personen) und der Steuerung von 12 Wirkstoffkandidaten durch Phase-I bis Phase-III-Studien, davon 3 mit erfolgreicher Marktzulassung (EMA, FDA). Budget-Verantwortung bis CHF 120M. 28 Peer-reviewed Publikationen (H-Index: 18), 8 erteilte Patente. Suche nach einer VP R&D-Funktion, in der ich strategische Forschungsprogramme in einem innovativen Pharmaunternehmen leiten kann.</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Berufliche Erfahrung</div>

<div style="margin-bottom: 1rem;">
  <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
    <div><strong>Director, Oncology Research</strong> · Roche, Basel (Global HQ)</div>
    <div style="color: #6b7280;">Jan 2019 – heute</div>
  </div>
  <ul style="font-size: 0.875rem; color: #374151; margin-top: 0.5rem; padding-left: 1.5rem; line-height: 1.6;">
    <li>Leitung eines 38-köpfigen globalen Forschungsteams (Basel, San Francisco, Shanghai) im Bereich Onkologie/Immuntherapie</li>
    <li>Verantwortung für Portfolio von 7 präklinischen Kandidaten und 3 Phase-I/II-Studien; Jahresbudget CHF 120M</li>
    <li>Erfolgreiche IND-Einreichung für 2 Moleküle (2021, 2023); Überführung in Phase-II (FDA Fast Track Designation erhalten 2022)</li>
    <li>Aufbau einer neuen Biomarker-Forschungsplattform (CRISPR-Screening) — Reduktion der Hit-to-Lead-Zeit um 35%</li>
    <li>Externe Partnerschaften: 4 akademische Kollaborationen (ETHZ, UCSF, Harvard Medical School), Vertragswert CHF 8.5M</li>
  </ul>
</div>

<div style="margin-bottom: 1rem;">
  <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
    <div><strong>Senior Scientist / Group Leader</strong> · Novartis Institutes for BioMedical Research, Basel</div>
    <div style="color: #6b7280;">Jun 2015 – Dez 2018</div>
  </div>
  <ul style="font-size: 0.875rem; color: #374151; margin-top: 0.5rem; padding-left: 1.5rem; line-height: 1.6;">
    <li>Leitung einer 12-köpfigen Gruppe in der Wirkstoffentwicklung (Small Molecules, Autoimmunerkrankungen)</li>
    <li>2 Wirkstoffkandidaten erfolgreich in Phase-I überführt; Koordination mit klinischen Teams in 6 Ländern</li>
    <li>Einführung von Computer-Aided Drug Design (CADD)-Methoden — Effizienzsteigerung in der Lead-Optimierung um 25%</li>
  </ul>
</div>

<div>
  <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
    <div><strong>Postdoctoral Research Fellow</strong> · ETH Zürich, Institut für pharmazeutische Wissenschaften</div>
    <div style="color: #6b7280;">Sep 2012 – Mai 2015</div>
  </div>
  <ul style="font-size: 0.875rem; color: #374151; margin-top: 0.5rem; padding-left: 1.5rem; line-height: 1.6;">
    <li>SNF-Forschungsprojekt (CHF 450'000): Mechanismen der Tumor-Immunevasion; 8 Publikationen in Journals (Nature Chemical Biology, JACS)</li>
  </ul>
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Ausbildung</div>

<div style="margin-bottom: 0.75rem; font-size: 0.875rem;">
  <div style="display: flex; justify-content: space-between;">
    <div><strong>Dr. rer. nat. Biochemie</strong> (summa cum laude) · Ludwig-Maximilians-Universität München</div>
    <div style="color: #6b7280;">2009–2012</div>
  </div>
  <div style="color: #374151; margin-top: 0.25rem;">Dissertation: «Allosteric Mechanisms in Kinase Signaling Networks» · DFG-Stipendium</div>
</div>

<div style="font-size: 0.875rem;">
  <div style="display: flex; justify-content: space-between;">
    <div><strong>Diplom Biochemie</strong> (Sehr gut) · Universität Heidelberg</div>
    <div style="color: #6b7280;">2002–2008</div>
  </div>
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Auszeichnungen & Zusatzqualifikationen</div>
<div style="font-size: 0.875rem; color: #374151; line-height: 1.6;">
  EMBO Young Investigator Award (2017) · 8 erteilte Patente (EP/US) · H-Index 18, 28 Peer-reviewed Publikationen · ICH Q8/Q9/Q10 Guidelines (Pharmazeutische Entwicklung) · GxP/GMP Compliance-Zertifizierung (Roche internal, 2020)
</div>
</div>

<div style="margin-bottom: 1.5rem;">
<div style="font-weight: 700; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; margin-bottom: 0.75rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Sprachen</div>
<div style="font-size: 0.875rem; color: #374151;">
  Deutsch (Muttersprache) · Englisch (Verhandlungssicher, C2) · Französisch (B2) · Mandarin (A2, Kurs laufend)
</div>
</div>

<div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: #374151; border-top: 1px solid #e5e7eb; padding-top: 1rem;">
  <div><strong>Referenzen:</strong> Prof. Dr. M. Knauer (ETH Zürich), Dr. J. Baumann (Roche) · Vollständige Publikationsliste und Patentübersicht auf Anfrage</div>
  <div>Basel, Februar 2026 · <em>Dr. Sophie Hirsch</em></div>
</div>

</div>

**Executive CV notes:**
- Executive summary front-loads the most compelling metrics: AUM/budget, team size, patents, publications
- Permit status (Niederlassungsbewilligung C) reassures employers — no work permit sponsorship needed
- "summa cum laude" is universally understood in Switzerland (German academic system shared)
- Two-page limit doesn't apply at executive level — 3 pages is standard when credentials justify it`,
          keyPoints: [
            'Executive summaries must quantify: 38-person team, CHF 120M budget, 3 EMA/FDA approvals, H-Index 18 — these replace lengthy descriptions',
            'Include permit status prominently for non-Swiss candidates: C permit signals no sponsorship burden for the employer',
            'Patents and publication metrics (H-Index, journals) are expected in academic/pharma CVs — include them explicitly',
            'German-language CVs for Basel pharma companies signal fluency and cultural fit — English CVs suggest you haven\'t adapted to the Swiss market',
            'EMBO, DFG, SNF awards are well-recognized in Swiss academia/pharma — don\'t abbreviate them in international CVs without explanation'
          ]
        }
      ]
    },
    {
      id: 'ats-optimization',
      title: 'ATS Optimization and Digital Application Strategy',
      content: `## ATS Optimization: Getting Past Automated Screening

Major Swiss employers (UBS, Credit Suisse/UBS post-merger, Roche, Novartis, ABB, Zurich Insurance, Swiss Re, Nestlé) all use Applicant Tracking Systems to pre-screen CVs. Your CV must satisfy both the ATS algorithm and the human recruiter who reads the shortlisted results.

### ATS Optimization Checklist

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Element</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">ATS Requirement</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Common Mistake</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">File Format</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">PDF (from Word) or .docx</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">PDF exported from InDesign/Canva — text not extractable</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Font</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Standard: Arial, Calibri, Times New Roman</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Custom fonts that don't embed properly</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Tables/Columns</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Single-column layout preferred</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Multi-column layouts scramble text order in ATS parsing</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Headers/Footers</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Avoid placing key info in headers/footers</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Name/contact in header — ATS may not parse it</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Keywords</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Mirror exact phrases from job posting</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Paraphrasing: "machine learning" vs. "ML" — system may not equate</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Section Titles</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Use standard titles in posting language</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">"Professional Journey" instead of "Berufliche Erfahrung"</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Dates</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Month + Year consistently</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Year-only dates confuse duration calculations</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Graphics</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Avoid skill bar charts, logos, icons</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Visual "skill meters" (★★★★☆) are invisible to ATS</td>
    </tr>
  </tbody>
</table>

### Swiss Job Portal Strategy

**Primary platforms for Switzerland:**
- **job-room.ch** — Official SECO portal; mandatory for labour market test postings under permit applications
- **jobs.ch** — Largest Swiss job portal; used by SMEs and major corporations
- **LinkedIn** — Essential for professional networking; 85%+ of Swiss professional roles have LinkedIn component
- **Indeed.ch** — Broad coverage; duplicates many jobs.ch postings
- **Jobup.ch** — Strong in French-speaking Switzerland (Romandy)
- **jobscout24.ch** — Tech and engineering focus
- **Jobagent.ch** — Startup/tech focus

**Application email best practices:**
- Subject line: "Bewerbung als [exact job title] — [name]" (never "Job Application" in English for German-language posting)
- Attach CV as "Lebenslauf_Vorname_Nachname.pdf" (not "cv_final_v3.pdf")
- Cover letter (Motivationsschreiben) is still expected for 80%+ of Swiss job postings — digital-only platforms are exceptions
- Arbeitszeugnis (work certificate from last employer) should be attached for senior roles; request it before leaving current employer`,
      keyPoints: [
        'PDF from Word or .docx are ATS-safe; PDFs exported from Canva/InDesign fail because text is not machine-readable',
        'Multi-column CV templates look attractive but scramble text order in ATS parsing — single column is safer for large employers',
        'Mirror exact keyword phrases from the job posting: "Python" not "Python programming language", "ISO 13485" not "medical device standards"',
        'Swiss employers still expect a cover letter (Motivationsschreiben) for 80%+ of applications — it is not optional as in the US',
        'Request your Arbeitszeugnis (work reference letter) from every employer before you leave — Swiss law requires employers to provide one (OR Art. 330a)'
      ],
      legalReferences: [
        'OR Art. 330a — Employee\'s right to receive a work reference letter (Arbeitszeugnis) at any time',
        'DSG (nDSG, SR 235.1) — Data protection requirements for CV data submitted to employers',
        'GlG Art. 6 — Equal pay transparency; employers cannot ask for salary history in hiring',
        'AVG — Arbeitsvermittlungsgesetz (placement agency regulations for recruiters)'
      ],
      officialLinks: [
        { title: 'job-room.ch — Official Swiss Job Platform', url: 'https://www.job-room.ch' },
        { title: 'SECO — Labour Market Information', url: 'https://www.seco.admin.ch/seco/de/home/Arbeit/Arbeitsbedingungen.html' },
        { title: 'OR Art. 330a — Arbeitszeugnis legal basis', url: 'https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de' }
      ],
      subsections: []
    }
  ]
}
