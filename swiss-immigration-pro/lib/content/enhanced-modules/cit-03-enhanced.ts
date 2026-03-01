// Enhanced Module: CIT-03 - Third-Generation Accelerated Path
// Based on official LN Art. 24-26 (revised 2018) and third-generation naturalization provisions

export const cit03Enhanced = {
  id: 'cit-03-enhanced',
  title: 'Third-Generation Accelerated Path',
  description: 'Master the accelerated naturalization pathway for third-generation immigrants born in Switzerland. Covers LN Art. 24-26 eligibility (must be under 25), parent and grandparent residence requirements, complete document checklist, eligibility decision tree, application procedure, and key pitfalls. In force since February 15, 2018.',
  estimatedReadTime: '90-115 minutes',
  lastUpdated: 'February 2026',
  sections: [
    {
      id: 'third-generation-overview',
      title: 'Understanding Third-Generation Naturalization',
      content: `## Third-Generation Accelerated Path: Special Naturalization for Swiss-Born Young Adults

Third-generation naturalization (naturalisation facilitée pour la troisième génération / Erleichterte Einbürgerung für die dritte Generation) has been available since February 15, 2018 under LN Art. 24-26. It provides a significantly simplified pathway to citizenship for young people born in Switzerland whose families have multi-generation ties to the country.

**Key fact: The age limit is 25.** You must be under 25 years old at the time of application. This is the most commonly missed eligibility requirement.

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 2rem 0;">
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">Under 25</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Age Limit at Application</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">Born in CH</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Or Age 5 if Not Born Here</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">CHF 100</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Federal Fee (Very Low)</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">Since 2018</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">In Force Feb 15, 2018</div>
  </div>
</div>

### Legal Framework: LN Art. 24-26

**LN Art. 24 — Eligibility Conditions (all must be met):**

1. **Age:** Under 25 years old at time of application submission
2. **Birth/Early Arrival:** Born in Switzerland — OR — living in Switzerland since age 5 or younger
3. **Parent's connection:** At least one parent was born in Switzerland OR held a residence permit B, C, or F at the time of the applicant's birth
4. **Grandparent's connection:** At least one grandparent was born in Switzerland OR held Swiss citizenship at any time OR held a residence permit B or C for at least 10 years
5. **School:** Completed at least 5 years of mandatory Swiss schooling
6. **Current permit:** Currently holds B permit or C permit

**LN Art. 25 — Simplified Conditions:**
No minimum residence duration requirement beyond school years; simplified integration assessment; no mandatory language test certificate (assessed during interview instead)

**LN Art. 26 — Federal Procedure:**
Application submitted directly to SEM (no commune-level procedure); cantonal authority consulted but does not conduct separate interview; SEM issues final decision

### Generational Structure

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Generation</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Who</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Required Connection</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Evidence Needed</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">1st Generation (Grandparent)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Your grandfather or grandmother</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Born in Switzerland, OR Swiss citizen at any time, OR held B/C permit for ≥10 years</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Birth certificate, or old permit documents, or Swiss passport copies, or cantonal civil registry extract</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">2nd Generation (Parent)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Your mother or father</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Born in Switzerland, OR held B, C, or F permit at time of applicant's birth</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Parent's birth certificate (Swiss) or their permit valid on applicant's birth date (Meldebestätigung)</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">3rd Generation (Applicant)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">YOU (the applicant)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Born in Switzerland (or arrived ≤age 5) + 5 years Swiss school + current B/C permit + under 25</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Birth certificate, school certificates, current permit, Meldebestätigung</td>
    </tr>
  </tbody>
</table>`,
      keyPoints: [
        'Age limit: under 25 at time of application — the most commonly missed requirement (LN Art. 24 lit. a)',
        'In force since February 15, 2018 — people who turned 25 before this date missed the window permanently',
        'Both a parent connection AND a grandparent connection are required — one generation is not enough',
        'F permit (provisional admission) counts for the parent generation but NOT for the grandparent generation',
        'Federal fee is only CHF 100 — no commune or cantonal fees apply (unlike ordinary naturalization)'
      ],
      legalReferences: [
        'LN Art. 24 — Third-generation eligibility (SR 141.0, in force Feb 15, 2018)',
        'LN Art. 25 — Simplified material conditions',
        'LN Art. 26 — Federal procedure with cantonal consultation',
        'Federal Council message on the third-generation initiative (BBl 2016 2829)',
        'SEM Directive on Third-Generation Naturalization (BVGE 2018 VII/3)'
      ],
      officialLinks: [
        { title: 'SEM — Third-Generation Naturalization Information', url: 'https://www.sem.admin.ch/sem/de/home/themen/buergerrecht/einbuergerung/dritte-generation.html' },
        { title: 'SEM Application Form (third generation)', url: 'https://www.sem.admin.ch/sem/de/home/themen/buergerrecht/formulare_wegleitungen.html' },
        { title: 'LN Art. 24-26 full text', url: 'https://www.fedlex.admin.ch/eli/cc/2016/404/de' }
      ],
      subsections: [
        {
          id: 'eligibility-decision-tree',
          title: 'Eligibility Decision Tree: Are You Eligible?',
          content: `## Eligibility Decision Tree: Check Your Third-Generation Status

Work through each question in order. If you answer NO to any question, third-generation naturalization does not apply to you.

**Step 1: Are you under 25 years old?**
- YES → Continue to Step 2
- NO → Third-generation path is CLOSED. Consider ordinary naturalization (10 years) or spouse route (5 years) if married to a Swiss citizen.

**Step 2: Were you born in Switzerland? OR did you move to Switzerland at age 5 or younger?**
- YES → Continue to Step 3
- NO → Third-generation path CLOSED.

**Step 3: Do you currently hold a B permit or C permit?**
- YES → Continue to Step 4
- NO (you have L, G, N permit or no permit) → You must first obtain B permit before applying.

**Step 4: Have you completed at least 5 years of compulsory schooling in Switzerland?**
- YES → Continue to Step 5
- NO (you went to school primarily abroad) → Third-generation path CLOSED.

**Step 5: Parent connection — was at least one of your parents born in Switzerland? OR did at least one parent hold a B, C, or F permit at the time YOU were born?**
- YES → Continue to Step 6
- NO (both parents arrived in Switzerland after you were born, or arrived recently) → Third-generation path CLOSED.

**Step 6: Grandparent connection — was at least one grandparent born in Switzerland? OR did at least one grandparent hold Swiss citizenship at any time? OR did at least one grandparent hold a B or C permit for at least 10 years?**
- YES → **YOU ARE LIKELY ELIGIBLE** — proceed to document collection and application
- NO → Third-generation path CLOSED.

### Common Eligibility Scenarios

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Scenario</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Eligible?</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Reason</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Italian grandparents came to CH in 1960s, Turkish parents born in CH, you born in CH, age 22</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; color: #15803d; font-weight: 700;">YES</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Classic third generation: grandparents (B/C permit 10+ years) + parents born in CH + you born in CH under 25</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Parents came to CH before your birth (with B permit), grandparents never in CH, you born in CH, age 20</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; color: #dc2626; font-weight: 700;">NO</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Grandparent connection missing — grandparents must have been in CH or been Swiss citizens</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Grandparents had C permit for 15 years, your parent born abroad (Germany), you born in CH, age 19, your parent held B permit at your birth</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; color: #15803d; font-weight: 700;">YES</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Grandparents (C permit 15 years ✓) + parent held B permit at applicant's birth ✓ + applicant born in CH ✓</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">You are 26 years old and just learned about this path</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; color: #dc2626; font-weight: 700;">NO</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Age limit (under 25) is hard — no exceptions. Apply for ordinary naturalization instead (10 years)</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Born in CH, parents born in CH, grandparent was Swiss citizen (later lost it by living abroad), you are 24</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; color: #15803d; font-weight: 700;">YES</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Grandparent was Swiss citizen "at any time" — past citizenship qualifies even if later lost</td>
    </tr>
  </tbody>
</table>`,
          keyPoints: [
            'Work through the 6-step decision tree — a NO at any step closes the third-generation path permanently',
            'The grandparent connection is the most surprising gap: parents in Switzerland is not enough without a grandparent connection',
            'F permit (provisional admission) counts for the parent generation but NOT for the grandparent generation',
            'Grandparent who "was Swiss at any time" qualifies — even if they later lost Swiss citizenship by emigrating',
            'Age 26 the day before the application: ineligible — the age limit has no grace period or exception'
          ]
        },
        {
          id: 'document-checklist',
          title: 'Complete Document Checklist and Application Process',
          content: `## Third-Generation Application: Document Checklist and Procedure

**APPLICANT Documents:**
- Swiss birth certificate (Geburtsschein) or certificate from civil registry (Zivilstandsamt)
- Current B or C permit (copy front and back)
- Meldebestätigung (residence confirmation) from current Gemeinde showing current address
- Passport or identity document (all pages with stamps)
- School certificates covering ≥5 years Swiss compulsory education (Schulzeugnisse or diploma)
- Criminal record certificate (Strafregisterauszug) — order at www.strafregister.admin.ch (CHF 17, ~3 days)
- Short biography (Lebenslauf) showing your personal connection to Switzerland

**PARENT Documents (for at least one parent):**
- If parent born in Switzerland: their Swiss birth certificate
- If parent held permit at your birth: their B, C, or F permit document valid on your date of birth, OR Meldebestätigung showing they were registered in Switzerland on that date
- If permit documents are lost: cantonal migration office can provide historical permit confirmation upon request

**GRANDPARENT Documents (for at least one grandparent):**
- If grandparent born in Switzerland: their birth certificate
- If grandparent was Swiss citizen: their old Swiss passport or Heimatschein (certificate of origin)
- If grandparent held B/C permit ≥10 years: old permit documents or cantonal migration archive confirmation
- Note: Documents from the 1950s–1970s may require retrieval from cantonal archives — allow 4–8 weeks

**Obtaining historical Swiss documents:**
- Civil registry extracts (Zivilstandsamt): contact the commune of birth
- Old permit history: contact cantonal migration office (Migrationsamt) — must show legitimate interest (applicant)
- Foreign documents (Italian, Turkish, etc.): must be apostilled and translated into German/French/Italian by certified translator

**SEM Application Process:**
1. Download application form from sem.admin.ch (form E-4.03 for third generation)
2. Complete form and gather all documents
3. Submit to SEM by post or scan+upload via SEM e-portal
4. Pay CHF 100 application fee (bank transfer to SEM)
5. SEM acknowledges receipt (2–4 weeks)
6. SEM requests missing documents if needed (respond within 30 days)
7. SEM consults cantonal authority (canton does not conduct separate interview)
8. SEM may invite applicant for brief interview at SEM in Bern or regional office
9. SEM issues decision (typically 8–15 months total)
10. If approved: citizenship certificate issued; passport and ID can be applied for immediately

**Fee structure:**
- Federal application fee: CHF 100 (fixed)
- No cantonal or communal naturalization fees (unlike ordinary naturalization)
- Strafregisterauszug: CHF 17
- Document translations (if needed): CHF 100–300 per document
- Total expected cost: CHF 150–500`,
          keyPoints: [
            'Historical grandparent permit documents from the 1950s-1980s must be requested from cantonal archives — allow 4-8 weeks lead time',
            'Total cost is very low: CHF 100 federal fee + CHF 17 criminal record certificate + translation costs if needed',
            'Processing time is 8-15 months — apply before your 24th birthday to be safe (allows time for re-application if initial documents incomplete)',
            'Foreign birth/civil documents must be apostilled and certified-translated (Italian, Turkish, Serbian, etc. originals not accepted without translation)',
            'If grandparent documents are lost completely, contact cantonal migration office for historical permit records — they are legally required to maintain records'
          ]
        }
      ]
    }
  ]
}
