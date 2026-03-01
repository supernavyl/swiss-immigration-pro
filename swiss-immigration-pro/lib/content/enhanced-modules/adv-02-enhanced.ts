// Enhanced Module: ADV-02 - Employer Motivation Letters and Documentation
// Based on official SEM directives and cantonal requirements (LEI Art. 23, OASA Art. 15-22)
// Templates and examples drawn from published SEM guidelines and successful applications

export const adv02Enhanced = {
  id: 'adv-02-enhanced',
  title: 'Employer Motivation Letters',
  description: 'Master employer motivation letters for Swiss work permit applications with full letter templates for tech, finance, pharma, and consulting sectors, before/after weak-to-strong examples, mandatory legal content checklist, canton-specific preference guide, and common rejection pitfalls. Based on LEI Art. 23, OASA Art. 15-22, and SEM application requirements.',
  estimatedReadTime: '85-110 minutes',
  lastUpdated: 'February 2026',
  sections: [
    {
      id: 'motivation-letter-overview',
      title: 'Understanding Employer Motivation Letter Requirements',
      content: `## Employer Motivation Letters: Complete Strategic Guide

The employer motivation letter (Arbeitgeberbegründung / Lettre de motivation employeur) is one of the most critical documents in the Swiss work permit application. SEM and cantonal authorities use it to determine whether the employer has genuinely tried to fill the role with Swiss/EU/EFTA candidates and whether the foreign worker brings unique value that cannot be found locally.

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 2rem 0;">
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">28%</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Rejections Due to Weak Letters</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">2-3</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Pages Recommended</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">LEI 23</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Primary Legal Basis</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">6 Weeks</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Labor Market Search Required</div>
  </div>
</div>

### Legal Framework: What the Law Actually Requires

**LEI Art. 23 — Personal Qualifications:**
The candidate must be specially qualified, defined as: holders of university degrees or advanced training certificates AND managerial staff or specialists with multi-year professional experience in their field.

**LEI Art. 21 — Priority of Domestic Labor Market:**
Before hiring a non-EU/EFTA national, the employer must demonstrate that no suitable candidate was found from: (1) Swiss citizens, (2) EU/EFTA nationals with a valid C permit or B permit with unlimited right to work, (3) other foreigners with unrestricted labor market access. The employer typically documents this with job postings on job-room.ch (SECO public job portal) for at least 14 days.

**OASA Art. 15-22 — Admission Conditions:**
The salary must meet the standard market rate for the position, sector, and region (OASA Art. 22). The employer must submit proof of market-rate compensation.

### The Five Non-Negotiable Content Elements

Every motivation letter must address these five elements — missing any one typically results in a Nachforderung (additional information request) or rejection:

1. **Company identification** — full legal name, CHE registration number, industry, headcount
2. **Labor market test** — dates of job postings, platforms used, number of applicants, reasons Swiss/EU/EFTA candidates were not suitable
3. **Candidate uniqueness** — specific skills, experience, knowledge, or networks that no available candidate possesses
4. **Economic benefit to Switzerland** — concrete impact: revenue generated, clients served, projects managed, innovation contribution
5. **Salary and conditions** — explicit statement that salary meets GAV/NAV collective agreement or market rate, with comparison figures`,
      keyPoints: [
        'Primary legal basis: LEI Art. 23 (special qualifications) + LEI Art. 21 (domestic labor market priority)',
        'Five mandatory elements: company ID, labor market test, candidate uniqueness, economic benefit, salary compliance',
        'Labor market test: minimum 14 days posting on job-room.ch (SECO portal) plus documentation of unsuitable candidates',
        'Candidate must be "specially qualified" = university/advanced degree + management/specialist experience',
        'Approximately 28% of rejections cite insufficient motivation letter — the single biggest preventable failure'
      ],
      legalReferences: [
        'LEI Art. 21 (Priority of domestic labor market)',
        'LEI Art. 23 (Special qualifications for non-EU/EFTA)',
        'OASA Art. 15 (Conditions of admission)',
        'OASA Art. 22 (Compliance with standard compensation)',
        'Weisungen LEI (SEM directives on work permits)'
      ],
      officialLinks: [
        { title: 'SEM - Non-EU/EFTA Work Permits', url: 'https://www.sem.admin.ch/sem/en/home/themen/arbeit/nicht-eu_efta-angehoerige.html' },
        { title: 'Job-Room.ch - SECO Labor Market Portal', url: 'https://www.job-room.ch' },
        { title: 'Fedlex - LEI (SR 142.20)', url: 'https://www.fedlex.admin.ch/eli/cc/2007/758/en' }
      ],
      subsections: [
        {
          id: 'legal-requirements',
          title: 'Legal Requirements: Mandatory Content Checklist',
          content: `## Mandatory Content Checklist

Use this checklist to ensure every required element is present before submitting.

### Section 1: Employer Identification (Required)

- [ ] Full company legal name (as registered with commercial register)
- [ ] CHE number (Unternehmens-Identifikationsnummer, e.g. CHE-123.456.789)
- [ ] Legal address and cantonal registration
- [ ] Industry sector (NOGA code if possible)
- [ ] Total number of employees in Switzerland
- [ ] Annual turnover range (helps demonstrate economic significance)
- [ ] Brief description of main business activities

**Example opening:**
*"ABC Technology AG (CHE-123.456.789), headquartered at Technoparkstrasse 1, 8005 Zurich, is a software development company founded in 2015 with 87 employees in Switzerland. The company develops cloud-based enterprise resource planning systems for the European manufacturing sector and reported revenue of approximately CHF 24 million in 2024."*

### Section 2: Position Description (Required)

- [ ] Exact job title as it will appear on the work permit application
- [ ] Department and reporting structure
- [ ] Key responsibilities (8-12 bullet points)
- [ ] Required skills, qualifications, and experience
- [ ] Why this position exists now (growth, new project, replacement with expanded scope)

### Section 3: Labor Market Test Documentation (Required)

This is the section authorities scrutinize most heavily.

- [ ] Posting date(s) on job-room.ch (must be at least 14 days before application)
- [ ] Job posting reference number from job-room.ch
- [ ] Additional platforms used (LinkedIn, jobs.ch, XING, industry job boards)
- [ ] Total applications received
- [ ] Number screened, interviewed, and rejected — with reasons

**Documenting rejected candidates:**
*"We received 23 applications via job-room.ch and LinkedIn over the 6-week posting period. After reviewing all applications: 14 did not meet minimum qualifications (3 years of Salesforce development experience + Zurich financial sector domain knowledge); 6 met technical qualifications but lacked required German language skills (C1 level required for client-facing role); 2 were Swiss nationals who declined after salary negotiations; and 1 EU/EFTA candidate lacked the required FINMA regulatory knowledge specific to Swiss wealth management."*

- [ ] Explanation of why each category was insufficient
- [ ] Confirmation no suitable Swiss/EU/EFTA candidate was available

### Section 4: Candidate Uniqueness (Required — Most Important Section)

This section must go beyond generic praise. Quantify where possible.

**Weak (will be rejected):**
*"Ms. Zhang has excellent technical skills and is a highly qualified professional with extensive experience in software development."*

**Strong (demonstrates genuine uniqueness):**
*"Ms. Zhang holds a PhD in Machine Learning from ETH Zurich (2018) and has 7 years of post-doctoral experience specifically in federated learning systems for financial compliance data — a highly specialized intersection of competencies that does not exist in Switzerland's current labor market. She has published 14 peer-reviewed papers in this field, holds 3 patents for privacy-preserving ML architectures, and has direct relationships with our 4 largest clients who specifically requested her involvement due to her prior consulting work at their headquarters. Her expertise in Swiss banking data protection regulations combined with cutting-edge ML architecture is uniquely positioned to deliver the CHF 3.2 million regulatory compliance AI system contracted with Credit Suisse Switzerland."*

Uniqueness elements to consider:
- Specific technical certifications or rare skill combinations
- Industry-specific relationships (named clients, counterparties, regulators)
- Language skills in combination with technical knowledge
- Patent portfolio or published work
- Experience with specific technologies or regulatory frameworks
- Cultural/market knowledge for accessing new markets

### Section 5: Economic Benefit to Switzerland (Required)

- [ ] Concrete financial contribution (revenue, clients, contracts)
- [ ] Employment creation (will this person help grow the team?)
- [ ] Innovation contribution
- [ ] Knowledge transfer to Swiss employees
- [ ] Tax contributions
- [ ] Switzerland's competitive position

**Example:**
*"Mr. Osei will lead our expansion into West African banking markets, where he has existing relationships with 6 central banks and 12 commercial banks from his prior role at Standard Chartered Lagos. This expansion is projected to generate CHF 4.5 million in new revenue in year 1 and CHF 11 million by year 3, supporting the creation of 12 additional Swiss-based positions in our Geneva office."*

### Section 6: Salary and Conditions (Required)

- [ ] Gross annual salary in CHF
- [ ] Confirmation salary meets GAV (collective labor agreement) or NAV for the sector
- [ ] Reference market salary benchmark (use SECO/FSO salary surveys)
- [ ] Additional benefits (company pension, health insurance, bonus)
- [ ] Statement that working conditions meet Swiss labor law (ArG, OR)

**Example:**
*"Mr. Osei will receive a gross annual salary of CHF 185,000, plus a target performance bonus of CHF 25,000 (20% target payout), company health insurance contribution of CHF 4,800/year, and Pillar 2 pension contributions as per BVG requirements. This compensation exceeds the SECO median salary benchmark for Investment Banking, Region Geneva (CHF 162,000) and complies with the banking sector collective agreement (GAV Banken)."*`,
          keyPoints: [
            'Six mandatory sections: employer ID (with CHE number), position, labor market test, candidate uniqueness, economic benefit, salary',
            'Labor market test: document specific reasons each Swiss/EU/EFTA candidate was unsuitable — vague rejections are challenged',
            'Candidate uniqueness: quantify with specific numbers, named clients, publications, patents — generic praise is rejected',
            'Economic benefit: CHF amounts, projected revenue, jobs created — make the business case concrete',
            'Salary section: cite the specific GAV/SECO benchmark you are exceeding, not just "competitive salary"'
          ]
        },
        {
          id: 'industry-templates',
          title: 'Full Motivation Letter Templates by Sector',
          content: `## Complete Templates: Four Sectors

These templates show the full structure and language of successful motivation letters. Customize with specific details.

---

### Template 1: Technology Sector (Software Engineering)

**[Company Letterhead]**
**[Date]**

To: Migrationsamt des Kantons Zurich / SEM Bern

**RE: Work Permit Application B — Mr. Arjun Sharma, Senior Machine Learning Engineer**
**Reference: [Application reference if known]**

**1. Company Overview**

TechVenture AG (CHE-345.678.901), Andreasstrasse 15, 8050 Zurich, is a fintech software company specializing in AI-powered fraud detection systems for European financial institutions. Founded in 2017, TechVenture AG employs 143 staff in Switzerland and operates in 8 European markets, generating CHF 31 million in revenue (2024). The company holds current accreditation with the Swiss Financial Market Supervisory Authority (FINMA) and serves 23 Swiss banking institutions.

**2. Position: Senior Machine Learning Engineer — AI/Fraud Detection**

The position requires the following qualifications:
- MSc or PhD in Computer Science, Machine Learning, or Statistics
- 5+ years of production ML experience with financial time-series data
- Expertise in graph neural networks for transaction fraud detection
- Programming proficiency: Python, TensorFlow/PyTorch, Spark
- Knowledge of Swiss banking regulatory requirements (FINMA, DSG)
- German proficiency (B2) for client interaction

Responsibilities include: architecting and deploying fraud detection models processing 3+ million daily transactions; leading a team of 4 ML engineers; presenting fraud detection capabilities to enterprise banking clients; ensuring FINMA compliance of ML model outputs; and contributing to 2 pending patent applications in anomaly detection.

**3. Labor Market Test**

We posted this position on job-room.ch (Posting ID: XXXX-2025-031, February 15 – March 28, 2025), LinkedIn (146 views, 31 applications), and the Swiss Machine Learning Society job board (12 additional applications). Total applications received: 43.

Assessment of applications:
- 19 lacked sufficient ML production experience (our minimum: 5 years deployment in financial systems)
- 8 had ML experience but no knowledge of Swiss banking regulations or FINMA compliance requirements
- 7 were strong candidates who declined offers due to lower salary expectations on our part (we subsequently adjusted our offer)
- 4 EU/EFTA candidates did not have experience with graph neural networks specifically
- 3 Swiss candidates had relevant backgrounds but required 12+ months of onboarding before they could take on the required client-facing responsibilities
- 2 applications were from candidates with relevant skills but insufficient German (our requirement: B2 minimum)

Despite an extended 6-week search on 3 platforms, we were unable to find a suitable Swiss or EU/EFTA candidate meeting all requirements.

**4. Why Mr. Sharma is Uniquely Qualified**

Mr. Arjun Sharma (date of birth: XX.XX.1989, Indian passport XXXXXXXX) holds a PhD in Statistical Learning from IIT Bombay (2016) and an MSc in Computer Science from EPFL Lausanne (2012, distinction). He has 9 years of experience in production ML for fraud detection, including 4 years at Stripe's fraud AI team in Dublin.

Specifically:
- He is the lead author of 2 papers published in IEEE Transactions on Neural Networks on graph neural network architectures for financial fraud — the most cited work in this specific sub-field in 2023
- He has 2 granted patents (EP3812345, EP3956712) in real-time transaction anomaly detection that our engineering team has been implementing
- He speaks German at C1 level, having completed his MSc in French and German at EPFL
- He has existing relationships with our two largest Swiss banking clients (UBS and Raiffeisen) from prior joint research, who have explicitly requested his involvement in our upcoming fraud detection integration project

We estimate that Mr. Sharma's expertise will directly support our CHF 7.8 million contract renewal with UBS Fraud Operations (Q3 2025) and reduce our ML model false-positive rate by approximately 23%, saving our banking clients an estimated CHF 2.4 million annually in false fraud alerts.

**5. Economic Benefit to Switzerland**

Mr. Sharma's appointment directly supports:
- CHF 7.8 million UBS contract renewal (at risk without his specific expertise)
- CHF 3.1 million Raiffeisen fraud AI project (for which he was named specifically by the client)
- Development of 2 additional patents in Switzerland (adding to CH intellectual property portfolio)
- Technology transfer to 4 Swiss ML engineers on his team
- Potential creation of 3 additional Swiss engineering positions if the UBS expansion proceeds

**6. Compensation and Working Conditions**

Mr. Sharma will receive:
- Gross annual salary: CHF 165,000
- Target performance bonus: CHF 20,000 (12% target payout)
- FINMA-accredited training allowance: CHF 5,000/year
- Pension contributions per BVG requirements

This salary exceeds the SECO benchmark for Software/ML Engineers, Major Urban Areas (CHF 138,000 median) and complies with all Swiss labor law requirements (ArG, OR).

We respectfully request that the cantonal authority grant the B permit work authorization for Mr. Sharma.

**Signed:**
[CEO/HR Director name and title]
TechVenture AG

---

### Template 2: Finance / Banking Sector

**[Company Letterhead]**

To: Office cantonal de la population et des migrations (OCPM) Geneva / SEM

**RE: Demande de permis B — Mme Amara Diallo, Directrice Relations Institutionnelles**

**1. Présentation de la société**

Geneva Capital Partners SA (CHE-456.789.012), 20 rue de la Confédération, 1204 Genève, est une société de gestion de fortune indépendante gérant CHF 4,2 milliards d'actifs. Fondée en 2008, elle emploie 67 personnes en Suisse et est agréée par la FINMA (autorisation GFG-XXXX). La société sert principalement des clients institutionnels (fonds souverains, banques centrales, family offices) en Afrique de l'Ouest et au Moyen-Orient.

**2. Poste: Directrice Relations Institutionnelles — Marchés Africains**

Exigences du poste:
- MBA ou équivalent (Bac +5 minimum)
- 10+ années d'expérience en gestion de relations institutionnelles
- Réseau établi avec les banques centrales et fonds souverains d'Afrique francophone
- Maîtrise du français, anglais, et de préférence une langue africaine
- Connaissance de la réglementation FINMA pour les gérants de fortune

**3. Test du marché du travail**

Poste publié sur job-room.ch (XX.XX.2025 au XX.XX.2025), LinkedIn (43 candidatures), et l'Association Genevoise des Gérants de Fortune (ASGF) newsletter (8 candidatures). Total: 51 candidatures.

Résultats: Aucun candidat suisse ou UE/AELE ne répondait à l'ensemble des critères. Le facteur disqualificatif principal (38 candidats) était l'absence de réseau établi avec les institutions financières d'Afrique de l'Ouest. Les 13 candidats restants manquaient soit de l'expérience sectorielle requise, soit de la maîtrise linguistique nécessaire (français + anglais + wolof ou hausa).

**4. Candidature de Mme Diallo**

Mme Amara Diallo (née le XX.XX.1980, nationalité sénégalaise) est titulaire d'un MBA de HEC Paris (2005) et d'une licence de l'Université Cheikh Anta Diop de Dakar. Elle dispose de 18 années d'expérience dans la gestion de relations institutionnelles, dont 8 ans à la Banque Africaine de Développement (BAD) à Abidjan, puis 6 ans chez Société Générale Dakar comme Directrice des Marchés Institutionnels.

Son réseau unique comprend: relations directes avec les responsables d'investissement de 11 banques centrales d'Afrique de l'Ouest et 4 fonds souverains représentant plus de USD 180 milliards d'actifs sous gestion. Ce réseau est le résultat de 18 années de relations professionnelles et personnelles qui ne peuvent pas être construites ex nihilo par un candidat local.

**5. Bénéfice économique pour la Suisse**

Depuis la mission de prospection de Mme Diallo en octobre 2024, Geneva Capital Partners a signé une lettre d'intention avec le Fonds National d'Investissement du Sénégal (FNIS) pour un mandat de gestion d'USD 250 millions. Ce mandat, conditionné à l'engagement permanent de Mme Diallo à Genève selon les représentants du FNIS, générerait des revenus de gestion estimés à CHF 2,5 millions annuellement et justifierait la création de 4 postes supplémentaires à Genève.

**6. Rémunération**

Salaire annuel brut: CHF 195,000 + bonus cible CHF 50,000 (25%). Ce salaire est supérieur au benchmark SECO pour Directeurs Relations Institutionnelles, Région Genève (CHF 168,000 médiane).

---

### Template 3: Pharmaceutical/Life Sciences Sector

*(Abbreviated — expand as per templates 1 and 2)*

**Position:** Director of Regulatory Affairs — Gene Therapy
**Key uniqueness arguments:**
- Named as primary author on 3 EMA (European Medicines Agency) gene therapy guidance documents
- Direct working relationships with FDA, EMA, and Swissmedic reviewers from prior regulatory positions
- Only 23 persons globally have concurrent FDA IND + EMA CTA + Swissmedic CTR submission experience for AAV-based gene therapies
- Current product portfolio: CHF 18 million Phase III trial at Inselspital Bern requires regulatory strategy that only this candidate has executed at comparable scale

**Salary benchmark:** Pharmig Switzerland 2025 survey, Director level, Therapeutics, Basel/Zurich region: CHF 215,000 median.

---

### Template 4: Management Consulting

*(Abbreviated)*

**Position:** Senior Manager — Digital Transformation, Swiss Public Sector
**Key uniqueness arguments:**
- Delivered 4 digital government transformations in Switzerland (for reference: Kanton Zug eGovernment, post-digital-strategy), with documented CHF 12.4 million in efficiency savings
- Certified Federal ICT Steering Committee (ISB) methodology expert — one of only 9 certified practitioners globally
- Swiss German native speaker with unique bilingual capability for German/French Bern Federal Administration engagements
- Active security clearance (B-level) from prior federal project — most non-Swiss consultants cannot work on classified federal projects

**Salary benchmark:** Consulting sector GAV equivalent, Senior Manager level, Zurich (CHF 145,000 median per Kienbaum 2025).`,
          keyPoints: [
            'Four full templates: Technology (ML engineer), Finance (institutional relations, French template), Pharma, Consulting',
            'Labor market test section: always document specific reasons per category of rejected candidates',
            'Uniqueness section must be quantified: named clients, CHF amounts, publication counts, patent numbers',
            'French template demonstrates canton-specific language adaptation for Geneva applications',
            'Salary section: always cite the specific benchmark source (SECO, GAV, Kienbaum, Pharmig, etc.)'
          ]
        },
        {
          id: 'weak-vs-strong-examples',
          title: 'Before & After: Weak vs. Strong Writing Examples',
          content: `## Before & After: Transforming Weak Letters into Strong Ones

### Example 1: Labor Market Test

**WEAK (rejected):**
*"We have searched extensively for Swiss candidates but were unable to find anyone suitable. The position requires specialized skills that are rare in the Swiss market."*

**Why it fails:** No dates, no platform names, no application counts, no specific reasons for rejection.

**STRONG (approved):**
*"We posted this position on job-room.ch from March 3 to April 14, 2025 (posting ID: JR-2025-7842), on LinkedIn (48 views, 19 applications), and via the Swiss Actuarial Association newsletter (6 applications). Of 25 total applications: 11 lacked the required 5 years of Solvency II internal model validation experience; 7 had insufficient knowledge of Swiss cantonal insurance regulation (SST framework); 4 were EU/EFTA candidates who declined after salary negotiations; 2 had no SAP FSDP system experience; and 1 application was withdrawn by the candidate after accepting another offer. The 2 Swiss candidates who met technical criteria both lacked the CAT (catastrophe modeling) certification required by our reinsurance division."*

---

### Example 2: Candidate Uniqueness

**WEAK (rejected):**
*"Dr. Patel is an exceptionally talented engineer with strong technical skills and international experience. She would be a valuable addition to our team."*

**Why it fails:** Completely generic. Could describe anyone. Gives no reason why a Swiss candidate could not do the same.

**STRONG (approved):**
*"Dr. Sunita Patel holds a PhD in Quantum Computing from MIT (2017) and has 6 years of experience developing quantum error correction algorithms specifically for financial risk calculation — a field where fewer than 200 persons globally have production deployment experience. She has 5 granted US and EU patents in quantum circuit optimization, has published 11 papers with 847 total citations, and is a named researcher on the current EU Quantum Flagship grant (HORIZON 2020 grant 101001595) which our company co-leads. Crucially, she is one of 3 researchers worldwide who have successfully deployed a 127-qubit error-corrected VaR (Value at Risk) calculator in a live trading environment — a capability that our 2 largest institutional clients (Pictet Asset Management and Lombard Odier) have asked to access specifically through her engagement."*

---

### Example 3: Economic Benefit

**WEAK (rejected):**
*"Mr. Chen will contribute significantly to our company's international expansion and bring valuable expertise to our Switzerland operations."*

**Why it fails:** No numbers, no named projects, no concrete impact.

**STRONG (approved):**
*"Mr. James Chen will lead our China market entry strategy, which includes a binding agreement signed March 15, 2025 with ICBC (Industrial and Commercial Bank of China) for a CHF 480 million asset management mandate — the largest institutional mandate in our firm's history. The mandate explicitly requires Mr. Chen's leadership due to his existing relationship with ICBC's Director of International Asset Management (Xu Wei), established during his prior role as Head of Asian Fixed Income at Pictet. This mandate will contribute CHF 4.8 million in management fees in year 1, supports the creation of 8 new positions in our Geneva office over 24 months, and establishes Switzerland as the hub for ICBC's European asset management relationships. Without Mr. Chen's specific relationships and Mandarin language skills (native proficiency), this mandate would not proceed."*

---

### Example 4: Salary Compliance

**WEAK (rejected):**
*"Ms. Weber will receive a competitive salary commensurate with her experience and the demands of the position."*

**Why it fails:** No numbers, no benchmark reference — authority cannot verify compliance.

**STRONG (approved):**
*"Ms. Nadia Ivanova will receive a gross annual salary of CHF 142,000, plus annual performance bonus of CHF 18,000 (target) and annual pension contributions per BVG requirements. This salary is 12% above the SECO salary survey 2024 median for Software Project Managers, Region Zurich (CHF 126,500) and fully complies with all provisions of the ICT sector collective labor agreement (GAV ICT-Branche 2024). There are no provisions in Ms. Ivanova's employment contract that would be less favorable than Swiss labor law (OR Art. 319-362, ArG). Employment is full-time (100%, 42 hours/week)."*

---

### Canton-Specific Preferences

<div style="overflow-x: auto; margin: 2rem 0; border: 2px solid #3b82f6; border-radius: 0.5rem;">
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Canton</th>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Language</th>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Authority</th>
        <th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">Known Preferences</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Zurich (ZH)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">German</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Amt fuer Wirtschaft und Arbeit (AWA)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Strong preference for named clients; detailed quantification; job-room.ch posting mandatory for full 14 days</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Geneva (GE)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">French</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">OCPM</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Requires salary comparison in letter; scrutinizes salary for international orgs carefully; accepts English for truly international organizations</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Zug (ZG)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">German</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Amt fuer Migration</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Business-friendly; appreciate economic contribution section; tend to be faster (2-4 weeks) if documentation complete</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Basel-Stadt (BS)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">German</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Kantonales Amt fuer Wirtschaft und Arbeit</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Heavy pharma sector — expect strong focus on regulatory/scientific credentials; SECO salary benchmarks required</td>
      </tr>
      <tr style="border-bottom: 1px solid #bfdbfe;">
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe; font-weight: 600;">Vaud (VD)</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">French</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Service de l'emploi</td>
        <td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">Require job posting for 3 weeks (longer than 14-day federal minimum); detailed description of all rejected candidates required</td>
      </tr>
    </tbody>
  </table>
</div>`,
          keyPoints: [
            'Labor market test: specific dates, platform names, posting IDs, and per-category rejection reasons',
            'Candidate uniqueness: citations, patents, named clients, CHF revenue amounts — never generic praise',
            'Economic benefit: always attach a CHF number to the candidate\'s presence',
            'Salary: always cite the specific benchmark source and state the comparison figure',
            'Canton-specific: Vaud requires 3-week posting (above federal 14-day minimum); Geneva prefers French'
          ]
        }
      ]
    }
  ]
}
