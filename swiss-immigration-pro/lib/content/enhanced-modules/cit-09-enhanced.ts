

// Enhanced Module: CIT-09 - Facilitated Naturalization & Special Cases
// Based on LN Art. 21-26 (facilitated naturalization), LN Art. 27-29 (reintegration)
// Processing time data from SEM annual statistics reports

export const cit09Enhanced = {
  id: 'cit-09-enhanced',
  title: 'Facilitated Naturalization & Special Cases',
  description: 'Master the facilitated naturalization paths available under Swiss law: spouse of a Swiss citizen (LN Art. 21-22), third-generation foreigners (LN Art. 24-25), former Swiss citizens seeking reintegration (LN Art. 27-29), and stateless persons (LN Art. 23). Includes detailed eligibility criteria, processing time comparisons, required documentation, and canton-by-canton differences.',
  estimatedReadTime: '70-90 minutes',
  lastUpdated: 'February 2026',
  sections: [
    {
      id: 'facilitated-overview',
      title: 'Understanding Facilitated Naturalization',
      content: `## Facilitated Naturalization: Faster Paths to Swiss Citizenship

Swiss law provides several "facilitated" (erleichterte Einbuergerung) paths that are faster and simpler than ordinary naturalization. These paths are handled directly by SEM at the federal level — bypassing the communal/cantonal procedure entirely. Processing times are significantly shorter.

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 2rem 0;">
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">6-12</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Months Processing</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">~8,000</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Facilitated per Year</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">CHF 100</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Federal Fee Only</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">4 Paths</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Facilitated Routes</div>
  </div>
</div>

### Ordinary vs. Facilitated Naturalization: Key Differences

<div style="overflow-x: auto; margin: 2rem 0; border: 2px solid #3b82f6; border-radius: 0.5rem;">
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Aspect</th>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Ordinary (LN Art. 9-19)</th>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Facilitated (LN Art. 21-26)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Processing authority</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Commune + Canton + SEM</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">SEM only (federal)</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Residence requirement</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">10 years total, 3 of last 5</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">5 years total (spouse path) or less</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Processing time</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">18-36 months</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">6-12 months</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Communal interview</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Yes (most cantons)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">No (SEM interview only)</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Cantonal fees</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 500-2,000+</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">None (federal only: CHF 100)</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Citizenship acquired</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Commune + Canton + Swiss</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Canton of residence + Swiss</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Integration assessment</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Comprehensive (commune + canton)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Simplified (SEM verification)</td>
      </tr>
    </tbody>
  </table>
</div>

### The Four Facilitated Paths

1. **Spouse of a Swiss citizen** (LN Art. 21-22) — most common facilitated route
2. **Stateless persons** (LN Art. 23) — for persons without any nationality
3. **Third-generation foreigners** (LN Art. 24-25) — grandchildren of immigrants, introduced 2018
4. **Reintegration of former Swiss citizens** (LN Art. 27-29) — for those who lost Swiss citizenship`,
      keyPoints: [
        'Facilitated naturalization processed by SEM only — no commune or canton procedure',
        'Processing time: 6-12 months vs. 18-36 months for ordinary naturalization',
        'Cost: CHF 100 federal fee only — no cantonal or communal fees',
        'Four paths: spouse, stateless, third-generation, and reintegration of former Swiss',
        'Approximately 8,000 facilitated naturalizations per year (about 25% of all naturalizations)'
      ],
      legalReferences: [
        'LN Art. 21 (Facilitated naturalization of spouse — in Switzerland)',
        'LN Art. 22 (Facilitated naturalization of spouse — abroad)',
        'LN Art. 23 (Stateless persons)',
        'LN Art. 24-25 (Third-generation foreigners)',
        'LN Art. 27-29 (Reintegration of former Swiss citizens)'
      ],
      officialLinks: [
        { title: 'SEM - Facilitated Naturalization', url: 'https://www.sem.admin.ch/sem/en/home/themen/buergerrecht/einbuergerung/erleichterte_einbuergerung.html' },
        { title: 'SEM - Third Generation', url: 'https://www.sem.admin.ch/sem/en/home/themen/buergerrecht/einbuergerung/erleichterte_einbuergerung/dritte-generation.html' },
        { title: 'Fedlex - Nationality Law (SR 141.0)', url: 'https://www.fedlex.admin.ch/eli/cc/2016/404/en' }
      ],
      subsections: [
        {
          id: 'spouse-path',
          title: 'Path 1: Spouse of a Swiss Citizen (LN Art. 21-22)',
          content: `## Spouse of a Swiss Citizen: The Most Common Fast Track

This is by far the most-used facilitated path, accounting for approximately 6,000-7,000 naturalizations per year. Two variants exist depending on whether you live in Switzerland or abroad.

### Variant A: Spouse Living in Switzerland (LN Art. 21)

**Eligibility Requirements:**
- Married to a Swiss citizen for at least **3 years**
- Lived in Switzerland for a total of **5 years** (including 1 year immediately before applying)
- Successfully integrated into Swiss society
- No threat to internal or external security
- Compliance with Swiss legal order

**Important notes:**
- The 3-year marriage and 5-year residence requirements must BOTH be met at the time of application
- Registered partnerships (same-sex) are treated identically to marriage since 2022
- Separation or divorce during the procedure: application is suspended. If divorce is finalized, the facilitated path is lost — you must switch to ordinary naturalization (10-year path)

### Variant B: Spouse Living Abroad (LN Art. 22)

**Eligibility Requirements:**
- Married to a Swiss citizen for at least **6 years**
- Close ties to Switzerland (regular visits, family contacts, Swiss media consumption, language skills)
- Successfully integrated into the Swiss community abroad
- Not a threat to security

**Close ties assessment includes:**
- Regular travel to Switzerland (typically at least annual visits)
- Active membership in Swiss clubs/associations abroad (Auslandschweizer-Organisation)
- Swiss language proficiency
- Knowledge of Swiss current events and culture
- Swiss family and friendship networks

### Spouse Path: Document Checklist

- Marriage certificate (original or certified copy)
- Both spouses' identity documents
- Proof of 5 years residence (Variant A) or 6 years marriage (Variant B)
- Integration evidence (employment, language, community)
- Criminal record extract
- Joint declaration of both spouses (confirming stable marriage and shared household)
- Federal application form for facilitated naturalization (different form from ordinary)

### Processing Timeline

<div style="margin: 2rem 0;">
  <div style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span style="color: #000000; font-weight: 500;">Application submission to SEM</span>
      <span style="font-weight: 700; color: #1e40af;">Month 0</span>
    </div>
  </div>
  <div style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span style="color: #000000; font-weight: 500;">SEM requests cantonal report</span>
      <span style="font-weight: 700; color: #1e40af;">Month 1-2</span>
    </div>
  </div>
  <div style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span style="color: #000000; font-weight: 500;">Canton provides integration report</span>
      <span style="font-weight: 700; color: #1e40af;">Month 3-6</span>
    </div>
  </div>
  <div style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span style="color: #000000; font-weight: 500;">fedpol security check</span>
      <span style="font-weight: 700; color: #1e40af;">Month 4-8</span>
    </div>
  </div>
  <div style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span style="color: #000000; font-weight: 500;">SEM decision</span>
      <span style="font-weight: 700; color: #1e40af;">Month 6-12</span>
    </div>
  </div>
</div>

### Common Pitfalls

- **Sham marriage scrutiny:** SEM actively investigates whether the marriage is genuine. Indicators they check: shared household, joint finances, social circle overlap, communication patterns. If SEM suspects a marriage of convenience, the application is rejected and potentially referred for criminal prosecution (LN Art. 41 — up to 5 years imprisonment for fraudulent naturalization).
- **Separation during procedure:** Even temporary separation (different addresses) can trigger suspension. Maintain shared household throughout.
- **Counting errors:** The 3-year marriage clock starts from the official marriage date, not from the start of cohabitation. The 5-year residence clock counts total time (with interruptions), not consecutive.`,
          keyPoints: [
            'Spouse in Switzerland (Art. 21): 3 years married + 5 years residence (1 year immediately before)',
            'Spouse abroad (Art. 22): 6 years married + close ties to Switzerland',
            'Registered partnerships treated identically to marriage since 2022',
            'SEM actively scrutinizes for sham marriages — criminal penalties up to 5 years',
            'Processing time: 6-12 months; application goes directly to SEM (no communal procedure)'
          ]
        },
        {
          id: 'third-generation',
          title: 'Path 2: Third-Generation Foreigners (LN Art. 24-25)',
          content: `## Third-Generation Foreigners: Born and Raised in Switzerland

Introduced on 15 February 2018 following a popular vote, this path allows grandchildren of immigrants who were born and raised in Switzerland to obtain facilitated naturalization. It recognizes that third-generation foreigners are already deeply integrated by virtue of growing up Swiss.

### Eligibility Criteria (LN Art. 24)

**Applicant must:**
- Be born in Switzerland
- Hold a C settlement permit
- Have attended at least 5 years of compulsory school in Switzerland
- Be under 25 years old at the time of application

**One grandparent must:**
- Have held a residence or settlement permit in Switzerland, OR
- Plausibly demonstrate that they resided in Switzerland (e.g., through historical records)

**One parent must:**
- Have lived in Switzerland for at least 10 years
- Have attended at least 5 years of compulsory school in Switzerland
- Hold a C settlement permit (or have held one)

### Why This Path Matters

Before 2018, third-generation foreigners — born and raised in Switzerland, attending Swiss schools, speaking Swiss German/French/Italian as their mother tongue — had to go through the full ordinary naturalization procedure. This was widely seen as disproportionate. The facilitated path recognizes their inherent integration.

### Statistics
- Approximately 25,000 persons are potentially eligible
- Uptake has been modest: roughly 1,000-1,500 applications per year since 2018
- Most applicants are of Italian, Turkish, or Balkan origin

### Application Procedure

1. File application with SEM (federal), not with your canton
2. Provide proof of three-generation chain (grandparent residence, parent schooling/residence, your birth in Switzerland)
3. SEM requests cantonal integration report
4. Decision within 6-12 months
5. Fee: CHF 100 (federal only)`,
          keyPoints: [
            'Introduced 15 February 2018 by popular vote — facilitated path for grandchildren of immigrants',
            'Applicant must be born in Switzerland, hold C permit, 5+ years Swiss school, under age 25',
            'Three-generation proof required: grandparent resided, parent 10+ years + 5 years school + C permit',
            'Approximately 25,000 eligible persons; 1,000-1,500 applications per year',
            'Fee: CHF 100 federal only; processing: 6-12 months directly with SEM'
          ]
        },
        {
          id: 'reintegration-stateless',
          title: 'Path 3-4: Reintegration & Stateless Persons',
          content: `## Reintegration of Former Swiss Citizens (LN Art. 27-29)

If you previously held Swiss citizenship and lost it (for example, before 1992 when acquiring a foreign nationality led to automatic loss), you may apply for reintegration.

### Eligibility (LN Art. 27)

- Previously held Swiss citizenship (by birth, descent, or naturalization)
- Lost it through voluntary acquisition of foreign citizenship (pre-1992), failure to declare retention, or renunciation
- Demonstrate close ties to Switzerland

### Two Variants

**Living in Switzerland (LN Art. 28):**
- Must have lived in Switzerland for 1 year
- Demonstrate integration and close ties
- Processing: 3-6 months

**Living abroad (LN Art. 29):**
- Must demonstrate close ties to Switzerland (visits, family, language, engagement with Swiss community abroad)
- No residence requirement in Switzerland
- Processing: 6-12 months

### Common Reintegration Scenarios

- **Swiss women who lost citizenship by marrying a foreigner before 1992** — the largest group. Under the old law, a Swiss woman automatically lost her citizenship upon marrying a foreign man. This was abolished in 1992 but many women never reclaimed their citizenship.
- **Former Swiss nationals who acquired foreign citizenship before 1992** — under the old law, voluntarily acquiring another nationality caused automatic loss. Since 1992, this no longer applies.
- **Children who lost Swiss citizenship** because their parent lost it — eligible for reintegration.

### Documents for Reintegration
- Proof of former Swiss citizenship (old passport, birth certificate, ancestry records)
- Current identity documents
- Evidence of ties to Switzerland
- Federal application form for reintegration
- Fee: CHF 100

---

## Stateless Persons (LN Art. 23)

Stateless persons (those without any nationality recognized by any state) benefit from facilitated naturalization to comply with Switzerland's obligations under the 1954 Convention relating to the Status of Stateless Persons and the 1961 Convention on the Reduction of Statelessness.

### Eligibility

- Officially recognized as stateless by Switzerland
- Lived in Switzerland for at least 5 years (including 1 year immediately before application)
- Integrated into Swiss society
- No threat to security

### Procedure

- Application to SEM directly
- SEM verifies stateless status (this can be complex — requires proving that no country claims you as a citizen)
- Integration assessment via cantonal report
- Processing: 6-12 months
- Fee: CHF 100

### Practical Reality
Stateless facilitated naturalization is relatively rare — approximately 50-100 cases per year. Most stateless persons in Switzerland are of Kurdish, Palestinian, or former-Soviet origin.`,
          keyPoints: [
            'Reintegration: for former Swiss citizens who lost citizenship (mostly pre-1992 cases)',
            'Swiss women who lost citizenship by marrying foreigners before 1992 are the largest reintegration group',
            'Reintegration from Switzerland: 1 year residence, processing 3-6 months',
            'Reintegration from abroad: no residence requirement, just close ties, processing 6-12 months',
            'Stateless persons: 5 years residence, facilitated path under 1954/1961 UN conventions, ~50-100 cases/year'
          ]
        }
      ]
    }
  ]
}
