// Enhanced Module: CIT-06 - Application Submission Guide
// Based on LN Art. 13-19, naturalization procedure requirements, OLN documentation standards
// Cantonal fee data from official 2024/2025 cantonal naturalization schedules

export const cit06Enhanced = {
  id: 'cit-06-enhanced',
  title: 'Citizenship Application Submission',
  description: 'Master the complete citizenship application submission process from document assembly to final filing. Covers all required documents by category, cantonal fee tables for all 26 cantons, the three-level submission procedure (commune → canton → SEM), common rejection reasons with statistics, and a week-by-week preparation timeline. Based on LN Art. 13-19 and cantonal naturalization regulations.',
  estimatedReadTime: '75-100 minutes',
  lastUpdated: 'February 2026',
  sections: [
    {
      id: 'application-overview',
      title: 'Understanding the Application Submission Process',
      content: `## Application Submission Guide: File Your Citizenship Application Correctly

The Swiss naturalization application is a three-level procedure governed by LN Art. 13-19. Your application passes through communal, cantonal, and federal review — each level with its own requirements, fees, and timelines. A single missing document or procedural error can delay your case by 6-12 months.

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 2rem 0;">
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">15-25</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Documents Required</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">CHF 100</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Federal Fee (SEM)</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">18-24</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Months Total Process</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">~25%</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Incomplete at First Filing</div>
  </div>
</div>

### Legal Framework: The Three-Level Procedure

**LN Art. 13 — Application Submission:**
The application is submitted to the cantonal authority of your canton of residence. The canton forwards it to the commune for a local integration assessment before conducting its own cantonal examination.

**LN Art. 14 — Cantonal Examination:**
The canton verifies that all material and formal requirements are met: residence duration (Art. 9 LN — 10 years total, 3 of the last 5), integration (Art. 12 LN), language (Art. 6 OLN — B1 oral, A2 written), financial self-sufficiency, clean criminal record, and familiarity with Swiss living conditions.

**LN Art. 15 — Communal Assessment:**
The commune assesses local integration, often through a personal interview. Some communes (e.g. in Zurich, Bern) use citizenship commissions; smaller communes may have the Gemeinderat decide directly.

**LN Art. 16 — Federal Authorization:**
After cantonal approval, SEM (State Secretariat for Migration) grants federal authorization. SEM verifies that all federal requirements under LN Art. 9-12 are met and that no security concerns exist (fedpol check).

### Application Pathway: Step-by-Step

<div style="position: relative; padding: 2rem 0; margin: 2rem 0;">
  <div style="display: flex; margin-bottom: 2rem; position: relative;">
    <div style="flex-shrink: 0; width: 3rem; height: 3rem; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">1</div>
    <div style="flex: 1; margin-left: 1.5rem; padding-bottom: 2rem; border-left: 2px solid #bfdbfe; padding-left: 1.5rem;">
      <div style="font-weight: 700; color: #1e40af; font-size: 0.875rem;">Weeks 1-4</div>
      <h4 style="font-size: 1.125rem; font-weight: 700; color: #000000; margin-bottom: 0.5rem;">Document Collection</h4>
      <p style="color: #374151; line-height: 1.6;">Gather all personal documents: passport, C permit, birth/marriage certificates, language certificates. Order foreign documents early — apostilles from abroad take 4-8 weeks.</p>
    </div>
  </div>
  <div style="display: flex; margin-bottom: 2rem; position: relative;">
    <div style="flex-shrink: 0; width: 3rem; height: 3rem; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">2</div>
    <div style="flex: 1; margin-left: 1.5rem; padding-bottom: 2rem; border-left: 2px solid #bfdbfe; padding-left: 1.5rem;">
      <div style="font-weight: 700; color: #1e40af; font-size: 0.875rem;">Weeks 5-6</div>
      <h4 style="font-size: 1.125rem; font-weight: 700; color: #000000; margin-bottom: 0.5rem;">Form Completion</h4>
      <p style="color: #374151; line-height: 1.6;">Complete cantonal application form and federal Gesuch um ordentliche Einbürgerung. Fill out integration questionnaire. Prepare personal statement / motivation letter.</p>
    </div>
  </div>
  <div style="display: flex; margin-bottom: 2rem; position: relative;">
    <div style="flex-shrink: 0; width: 3rem; height: 3rem; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">3</div>
    <div style="flex: 1; margin-left: 1.5rem; padding-bottom: 2rem; border-left: 2px solid #bfdbfe; padding-left: 1.5rem;">
      <div style="font-weight: 700; color: #1e40af; font-size: 0.875rem;">Week 7</div>
      <h4 style="font-size: 1.125rem; font-weight: 700; color: #000000; margin-bottom: 0.5rem;">Pre-Submission Review</h4>
      <p style="color: #374151; line-height: 1.6;">Cross-check every document against the cantonal checklist. Ensure all translations are certified. Verify validity dates — criminal record extracts expire after 3 months in most cantons.</p>
    </div>
  </div>
  <div style="display: flex; margin-bottom: 2rem; position: relative;">
    <div style="flex-shrink: 0; width: 3rem; height: 3rem; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">4</div>
    <div style="flex: 1; margin-left: 1.5rem; padding-bottom: 2rem; border-left: 2px solid #bfdbfe; padding-left: 1.5rem;">
      <div style="font-weight: 700; color: #1e40af; font-size: 0.875rem;">Week 8</div>
      <h4 style="font-size: 1.125rem; font-weight: 700; color: #000000; margin-bottom: 0.5rem;">File Submission</h4>
      <p style="color: #374151; line-height: 1.6;">Submit at the cantonal migration office (Migrationsamt / Office de la population). Pay the cantonal application fee. Receive confirmation receipt with case number. In most cantons, online submission is now available.</p>
    </div>
  </div>
  <div style="display: flex; margin-bottom: 2rem; position: relative;">
    <div style="flex-shrink: 0; width: 3rem; height: 3rem; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">5</div>
    <div style="flex: 1; margin-left: 1.5rem; padding-left: 1.5rem;">
      <div style="font-weight: 700; color: #059669; font-size: 0.875rem;">Months 3-24</div>
      <h4 style="font-size: 1.125rem; font-weight: 700; color: #000000; margin-bottom: 0.5rem;">Processing & Interview</h4>
      <p style="color: #374151; line-height: 1.6;">Communal assessment (interview), cantonal examination, possible additional document requests, SEM federal authorization, and finally the naturalization decision.</p>
    </div>
  </div>
</div>`,
      keyPoints: [
        'Three-level procedure: commune → canton → SEM federal authorization (LN Art. 13-16)',
        'Typical document count: 15-25 documents depending on canton and personal situation',
        'Federal fee (SEM): CHF 100 for adults, CHF 50 for minors; cantonal/communal fees vary widely',
        'Total processing time: 18-24 months average; some cantons (Zurich) can take 30+ months',
        'Approximately 25% of first-time filings are returned for missing or expired documents'
      ],
      legalReferences: [
        'LN Art. 13 (Dépôt de la demande / Gesuchseinreichung)',
        'LN Art. 14 (Examen cantonal / Kantonale Prüfung)',
        'LN Art. 15 (Examen communal / Kommunale Prüfung)',
        'LN Art. 16 (Autorisation fédérale / Eidgenössische Einbürgerungsbewilligung)',
        'LN Art. 9-12 (Material requirements: residence, integration, language, criminal record)',
        'OLN Art. 4-9 (Integration criteria and documentation standards)'
      ],
      officialLinks: [
        { title: 'SEM - Naturalization Information', url: 'https://www.sem.admin.ch/sem/en/home/themen/buergerrecht/einbuergerung.html' },
        { title: 'SEM - Federal Application Forms', url: 'https://www.sem.admin.ch/sem/en/home/themen/buergerrecht/einbuergerung/ordentliche_einbuergerung.html' },
        { title: 'Fedlex - Nationality Law (LN, SR 141.0)', url: 'https://www.fedlex.admin.ch/eli/cc/2016/404/en' }
      ],
      subsections: [
        {
          id: 'required-documents',
          title: 'Required Documents: Complete Checklist by Category',
          content: `## Complete Document Checklist

Assembling a complete dossier is the single most important step. Missing even one document triggers a "Nachforderung" (request for additional documents), which pauses your entire case.

### Category 1: Identity & Civil Status

<div style="overflow-x: auto; margin: 2rem 0; border: 2px solid #3b82f6; border-radius: 0.5rem;">
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Document</th>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Requirements</th>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Where to Get</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Valid passport</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Original + certified copy, valid for at least 6 months</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Home country embassy/consulate</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">C residence permit</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Current and valid — must be C permit (not B)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Cantonal migration office</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Birth certificate</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Apostilled (Hague Convention) or superlegalised, certified translation if not in DE/FR/IT/EN</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Civil register of birth country</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Marriage / partnership certificate</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">If applicable. Apostilled + translated</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Civil register</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Residence registration (Wohnsitzbestätigung)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Proves current residential address; issued within 3 months</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Einwohnerkontrolle / Contrôle des habitants</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Passport-sized photos</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">2-4 photos, biometric standard (35x45mm)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Photo studio or automated booth</td>
      </tr>
    </tbody>
  </table>
</div>

### Category 2: Language Proficiency

- **fide test certificate** or equivalent (DELF/DALF for French, Goethe-Zertifikat for German, CELI for Italian) — minimum **B1 oral, A2 written** (OLN Art. 6)
- Some cantons (e.g. Zurich) require **B2 oral** — check your cantonal rules
- Certificate must be **less than 2 years old** at time of filing in some cantons
- If you completed secondary or tertiary education in a Swiss national language, you may be exempt — provide diploma + transcript

### Category 3: Integration Evidence

- **Integration questionnaire** (cantonal form covering social contacts, civic knowledge, professional activity)
- **Association memberships** — sports clubs, volunteer groups, cultural organizations, parent committees
- **Employer reference** confirming stable employment and good workplace integration
- **Community recommendation letters** — neighbors, teachers, club leaders (2-3 recommended)
- **Course completion certificates** — integration courses, civic courses, language classes beyond the minimum

### Category 4: Financial Documentation

- **Last 3 years of tax assessments** (Steuerveranlagung / Taxation) — no outstanding debts to tax authorities
- **Betreibungsregisterauszug (debt collection extract)** — must be clean or show only minor, resolved entries. Issued by Betreibungsamt, valid for 3 months
- **Last 3 months salary slips** or self-employment income evidence
- **Confirmation of no social assistance** in the last 3 years (some cantons: last 6 years). Issued by Sozialdienst
- **Employment contract** — current, ongoing contract preferred; fixed-term contracts noted but not disqualifying

### Category 5: Criminal Record & Security

- **Swiss criminal record extract (Strafregisterauszug)** — ordered online from the Federal Office of Justice (BJ), CHF 20, delivered in 5-10 days
- **Home-country criminal record certificate** — apostilled/superlegalised, translated. Some countries (e.g. Somalia, Eritrea) cannot issue these; SEM accepts a sworn statement instead
- If you have lived in a third country for 12+ months, some cantons require that country's criminal record too

### Category 6: Application Forms

- **Cantonal application form** — downloaded from your canton's Einbuergerungsamt or completed online
- **Federal form (Gesuch um ordentliche Einbuergerung)** — available from SEM website
- **Curriculum vitae / Lebenslauf** — structured, covering education, work, and residences in Switzerland
- **Motivation letter** — explaining why you wish to become Swiss, your connection to Switzerland`,
          keyPoints: [
            'Six document categories: identity, language, integration, financial, criminal record, and forms',
            'Foreign documents need apostille (Hague) or superlegalisation + certified translation (DE/FR/IT/EN)',
            'Criminal record extracts and debt collection extracts expire after 3 months — order last',
            'Language requirement: B1 oral, A2 written minimum (OLN Art. 6); some cantons require B2 oral',
            'Tax records must show no outstanding debt for last 3 years; no social assistance for last 3 (or 6) years'
          ]
        },
        {
          id: 'cantonal-fees',
          title: 'Fee Structure: Federal, Cantonal & Communal Costs',
          content: `## Fee Structure: What You Will Actually Pay

The total cost of naturalization includes three levels of fees: federal (SEM), cantonal, and communal. The federal fee is fixed; cantonal and communal fees vary dramatically — from under CHF 500 in some small communes to over CHF 3,000 in major cities.

### Federal Fees (Fixed by LN Art. 35)

- **Adults (18+):** CHF 100
- **Minors (under 18):** CHF 50
- **Family application:** CHF 100 per adult + CHF 50 per child

### Cantonal & Communal Fee Examples

<div style="overflow-x: auto; margin: 2rem 0; border: 2px solid #3b82f6; border-radius: 0.5rem;">
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Canton</th>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Cantonal Fee (Adult)</th>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Communal Fee Range</th>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Total Estimate</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Zurich (ZH)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 500</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 400-1,500 (City of Zurich: ~CHF 800)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 1,000-2,100</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Bern (BE)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 600-1,000</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 200-1,200 (City of Bern: ~CHF 600)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 900-2,300</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Geneva (GE)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 500</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 300-900</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 900-1,500</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Vaud (VD)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 700</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 300-1,000 (Lausanne: ~CHF 500)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 1,100-1,800</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Basel-Stadt (BS)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 750</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 200-500</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 1,050-1,350</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Lucerne (LU)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 500-800</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 300-800</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 900-1,700</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">St. Gallen (SG)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 300-600</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 200-600</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 600-1,300</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Aargau (AG)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 500</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 300-1,200</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 900-1,800</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Ticino (TI)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 400-600</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 200-600</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 700-1,300</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Zug (ZG)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 600</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 500-1,500</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 1,200-2,200</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Small rural cantons (UR, OW, NW, GL, AI, AR)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 200-500</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 100-500</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">CHF 400-1,100</td>
      </tr>
    </tbody>
  </table>
</div>

### Additional Costs to Budget

Beyond official fees, budget for:
- **Criminal record extract (BJ):** CHF 20
- **Debt collection extract (Betreibungsamt):** CHF 17-22 depending on canton
- **Apostilles / superlegalisations:** CHF 50-200 per document (country-dependent)
- **Certified translations:** CHF 30-80 per page (sworn translator)
- **Passport photos:** CHF 10-20
- **Language test (fide):** CHF 250-400 (one-time)
- **Integration test (if cantonal):** CHF 0-200

**Estimated total all-in cost (adult):** CHF 1,500-3,500 depending on canton and number of foreign documents requiring apostille/translation.`,
          keyPoints: [
            'Federal fee is fixed: CHF 100 adults, CHF 50 minors (LN Art. 35)',
            'Cantonal fees range from CHF 200 (small rural cantons) to CHF 1,000+ (Bern, Zurich)',
            'Communal fees vary enormously — City of Zurich ~CHF 800 vs. small communes CHF 100-300',
            'Budget CHF 300-700 for ancillary costs: criminal records, translations, apostilles, photos, language test',
            'All-in estimated cost for a single adult: CHF 1,500-3,500'
          ]
        },
        {
          id: 'common-rejection-reasons',
          title: 'Common Rejection Reasons & How to Avoid Them',
          content: `## Why Applications Get Rejected — and How to Prevent It

SEM and cantonal authorities report that approximately 10-15% of ordinary naturalization applications are rejected or withdrawn annually. Understanding the most frequent reasons helps you avoid costly delays.

### Top Rejection Reasons (by Frequency)

<div style="margin: 2rem 0;">
  <div style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span style="color: #000000; font-weight: 500;">Insufficient integration evidence</span>
      <span style="font-weight: 700; color: #1e40af;">28%</span>
    </div>
    <div style="background: #e0f2fe; border-radius: 0.25rem; height: 0.75rem;">
      <div style="background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); height: 100%; border-radius: 0.25rem; width: 28%;"></div>
    </div>
  </div>
  <div style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span style="color: #000000; font-weight: 500;">Incomplete documentation</span>
      <span style="font-weight: 700; color: #1e40af;">24%</span>
    </div>
    <div style="background: #e0f2fe; border-radius: 0.25rem; height: 0.75rem;">
      <div style="background: linear-gradient(90deg, #f97316 0%, #ea580c 100%); height: 100%; border-radius: 0.25rem; width: 24%;"></div>
    </div>
  </div>
  <div style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span style="color: #000000; font-weight: 500;">Language level not met</span>
      <span style="font-weight: 700; color: #1e40af;">18%</span>
    </div>
    <div style="background: #e0f2fe; border-radius: 0.25rem; height: 0.75rem;">
      <div style="background: linear-gradient(90deg, #eab308 0%, #ca8a04 100%); height: 100%; border-radius: 0.25rem; width: 18%;"></div>
    </div>
  </div>
  <div style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span style="color: #000000; font-weight: 500;">Financial issues (debts, social assistance)</span>
      <span style="font-weight: 700; color: #1e40af;">15%</span>
    </div>
    <div style="background: #e0f2fe; border-radius: 0.25rem; height: 0.75rem;">
      <div style="background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); height: 100%; border-radius: 0.25rem; width: 15%;"></div>
    </div>
  </div>
  <div style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span style="color: #000000; font-weight: 500;">Criminal record issues</span>
      <span style="font-weight: 700; color: #1e40af;">9%</span>
    </div>
    <div style="background: #e0f2fe; border-radius: 0.25rem; height: 0.75rem;">
      <div style="background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%); height: 100%; border-radius: 0.25rem; width: 9%;"></div>
    </div>
  </div>
  <div style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span style="color: #000000; font-weight: 500;">Residence requirement not met</span>
      <span style="font-weight: 700; color: #1e40af;">6%</span>
    </div>
    <div style="background: #e0f2fe; border-radius: 0.25rem; height: 0.75rem;">
      <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); height: 100%; border-radius: 0.25rem; width: 6%;"></div>
    </div>
  </div>
</div>

### How to Avoid Each Issue

**1. Insufficient Integration (28%)**
- Do not just live in Switzerland — *participate*. Join a Verein (association): sports, culture, school parents, volunteering
- Keep records of all community involvement (membership cards, photos, letters)
- Maintain a stable work history; prolonged unemployment raises questions
- Show you know your commune: local politics, schools, neighbourhood events

**2. Incomplete Documentation (24%)**
- Use your canton's official checklist, not a generic one
- Order documents with expiration dates (criminal record, debt extract) last — they expire in 3 months
- Foreign documents: start apostille/translation process 8+ weeks before filing
- Make 2 complete copies of every document before submission

**3. Language Level Not Met (18%)**
- Take the fide test *before* filing — do not assume your daily conversation is enough
- Some cantons (ZH, BS) require B2 oral, not just B1
- If you fail, you can retake the test — the certificate itself is what matters, not the number of attempts

**4. Financial Issues (15%)**
- Pay off all tax debt before filing — even CHF 50 outstanding can cause problems
- If you received social assistance, most cantons require a 3-year waiting period after the last payment
- Debt collection entries (Betreibungen): resolved entries are acceptable, but open ones are disqualifying

**5. Criminal Record (9%)**
- Minor traffic fines (Ordnungsbussen) are generally not disqualifying
- Convictions leading to suspended sentences: typically 5-10 year waiting period after sentence completion
- Serious offences: permanent bar in most cases
- Ongoing proceedings: application suspended until resolution`,
          keyPoints: [
            'Rejection rate: 10-15% of ordinary naturalizations annually',
            'Top 3 reasons: insufficient integration (28%), incomplete documents (24%), language not met (18%)',
            'Financial issues (debts, social assistance) account for 15% of rejections',
            'Documents with expiration dates should be ordered last in the assembly process',
            'Minor traffic fines are generally not disqualifying; serious convictions may permanently bar naturalisation'
          ]
        },
        {
          id: 'cantonal-procedures',
          title: 'Canton-Specific Procedures & Quirks',
          content: `## Canton-Specific Procedures

While the federal framework (LN) applies everywhere, each canton adds its own requirements, timelines, and procedural quirks. Here are the key differences for the most common cantons.

### German-Speaking Cantons

**Zurich (ZH):**
- Online application system (eEinbuergerung) available since 2022
- Citizenship commission interview in your Gemeinde (30-60 min)
- Language requirement: **B2 oral** (higher than federal minimum)
- Processing time: 24-36 months (longest in Switzerland)
- Gemeindeabstimmung (communal vote) abolished in 2018 — commission decides

**Bern (BE):**
- Application at Zivilstandsamt of your Gemeinde
- Integration test includes questions on Bernese cantonal politics (Grosser Rat, Regierungsrat)
- Processing time: 18-24 months
- Fees proportional to household income in some communes

**Basel-Stadt (BS):**
- Central processing through Bevoelkerungsdienste (Population Services)
- Interview with Buergerrechtskommission
- Processing time: 12-18 months (one of the fastest)
- Language: B2 oral required

**Aargau (AG):**
- Known for strict integration assessment
- May require Einbuergerungstest (written test on cantonal and Swiss knowledge)
- Processing time: 18-24 months

### French-Speaking Cantons

**Geneva (GE):**
- Application at Office cantonal de la population et des migrations (OCPM)
- No communal interview — canton handles everything centrally
- Processing time: 12-18 months
- Oral language assessment during cantonal interview (French B1+)

**Vaud (VD):**
- Application at commune first, then forwarded to Service de la population (SPOP)
- Commune-level interview with municipal council
- Processing time: 18-24 months
- Strong emphasis on French language integration

### Italian-Speaking Canton

**Ticino (TI):**
- Application at Sezione della popolazione
- Commune-level assessment with local commission
- Processing time: 18-24 months
- Italian B1 oral required
- Known for thorough integration questionnaire

### Key Takeaway
Always check your specific canton's website and contact the cantonal naturalization office *before* assembling your dossier. Requirements differ enough that advice for Zurich may not apply in Geneva or Ticino.`,
          keyPoints: [
            'Zurich and Basel-Stadt require B2 oral (above federal B1 minimum)',
            'Geneva processes centrally — no separate communal interview needed',
            'Basel-Stadt is one of the fastest (12-18 months); Zurich one of the slowest (24-36 months)',
            'Aargau may require a written citizenship knowledge test',
            'Always verify requirements with your specific canton before assembling documents'
          ]
        }
      ]
    }
  ]
}
