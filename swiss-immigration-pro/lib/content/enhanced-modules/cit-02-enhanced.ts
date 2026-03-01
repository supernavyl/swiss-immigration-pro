// Enhanced Module: CIT-02 - Spouse Route - 5 Years Faster
// Based on official LN Art. 21-22, OLN directives, and facilitated naturalization for spouses

export const cit02Enhanced = {
  id: 'cit-02-enhanced',
  title: 'Spouse Route to Swiss Citizenship',
  description: 'Master the facilitated naturalization pathway for spouses of Swiss citizens, reducing the citizenship timeline from 10 years to 5 years. Covers LN Art. 21 (spouse in Switzerland), LN Art. 22 (spouse abroad), union conjugale assessment, sham marriage scrutiny, common rejection reasons, and step-by-step SEM application procedure.',
  estimatedReadTime: '100-130 minutes',
  lastUpdated: 'February 2026',
  sections: [
    {
      id: 'spouse-route-overview',
      title: 'Understanding Facilitated Naturalization for Spouses',
      content: `## Spouse Route to Swiss Citizenship: 5 Years Faster Naturalization

Facilitated naturalization (naturalisation facilitée / Erleichterte Einbürgerung) for spouses of Swiss citizens reduces the residency requirement from 10 years to 5 years and eliminates the C permit requirement (B permit is sufficient). The procedure is handled at federal level by SEM — no commune or cantonal interview — making it simpler than ordinary naturalization.

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 2rem 0;">
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">5 Years</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Total Residence (vs. 10)</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">3 Years</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Marriage Duration Required</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">B Permit</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Sufficient (No C Needed)</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">Federal Only</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">SEM (No Commune Interview)</div>
  </div>
</div>

### Two Pathways: LN Art. 21 vs. LN Art. 22

**Path 1 — Spouse in Switzerland (LN Art. 21):**
Most common route. The foreign national lives in Switzerland with their Swiss spouse.
- 3 years of effective marriage (union conjugale effective)
- 5 years total legal residence in Switzerland (on B or C permit)
- 1 year continuous residence in Switzerland immediately preceding application
- Integration requirements (B1 language, economic participation, clean record)

**Path 2 — Spouse Abroad (LN Art. 22):**
Less common. The foreign national lives abroad with their Swiss spouse who is also abroad.
- 6 years of effective marriage (double the Art. 21 requirement)
- Close ties to Switzerland (despite living abroad)
- Regular visits to Switzerland, Swiss family connections, Swiss cultural identity
- No specific residence duration in Switzerland required
- Much harder to prove — SEM scrutinizes "close ties" extensively

**Which path applies to you?**

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Your Situation</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Applicable Article</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Marriage Required</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Residence Required</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Living in Switzerland with Swiss spouse</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">LN Art. 21</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">3 years</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">5 years in CH (1 year continuous preceding)</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Living abroad with Swiss spouse (both abroad)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">LN Art. 22</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">6 years</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Close ties to Switzerland (no specific duration)</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Registered same-sex partnership with Swiss partner</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">LN Art. 21</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">3 years (partnership or marriage)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">5 years in CH (1 year preceding)</td>
    </tr>
  </tbody>
</table>`,
      keyPoints: [
        'LN Art. 21 (spouse in Switzerland): 3 years marriage + 5 years Swiss residence + 1 year preceding application',
        'LN Art. 22 (spouse abroad): 6 years marriage + close ties to Switzerland (no minimum Swiss residence)',
        'B permit is sufficient — significant advantage vs. ordinary naturalization which requires C permit',
        'Facilitated naturalization is federal-only (SEM) — no commune interview or local referendum vote',
        'Registered same-sex partnerships qualify equally under LN Art. 21 since Swiss marriage equality (2022)'
      ],
      legalReferences: [
        'LN Art. 21 — Facilitated naturalization for spouse/partner in Switzerland (SR 141.0)',
        'LN Art. 22 — Facilitated naturalization for spouse abroad',
        'LN Art. 41 — Nullification of naturalization obtained by fraud (up to 8 years after grant)',
        'OLN Art. 10 — Union conjugale: assessment criteria',
        'LN Art. 12 — Integration criteria applying to all naturalization paths'
      ],
      officialLinks: [
        { title: 'SEM — Facilitated Naturalization for Spouses', url: 'https://www.sem.admin.ch/sem/en/home/themen/buergerrecht/einbuergerung/erleichterte_einbuergerung.html' },
        { title: 'SEM — Application Forms (facilitated naturalization)', url: 'https://www.sem.admin.ch/sem/de/home/themen/buergerrecht/formulare_wegleitungen.html' },
        { title: 'LN full text (fedlex)', url: 'https://www.fedlex.admin.ch/eli/cc/2016/404/de' }
      ],
      subsections: [
        {
          id: 'union-conjugale',
          title: 'Union Conjugale: What "Effective Marriage" Really Means',
          content: `## Union Conjugale (OLN Art. 10): The Central Assessment Criterion

The single most important criterion for spousal facilitated naturalization is proving your marriage is a genuine "union conjugale effective et stable" (effective and stable marital union). SEM conducts an in-depth investigation of this criterion.

### What SEM Looks for in a Genuine Marriage

**Positive indicators (evidence of effective union conjugale):**
1. **Common household** — living at the same registered address for the full duration of the marriage; any periods of separate addresses require explanation
2. **Joint financial management** — joint bank accounts, joint rent/mortgage, shared household expenses (receipts, bank statements)
3. **Social recognition** — invited together to family events, known as a couple to neighbors, colleagues, friends (attestations possible)
4. **Shared future plans** — evidence of joint plans (travel bookings, property search, parental plans if applicable)
5. **Communication frequency** — if temporarily separated (work posting), phone/travel records showing regular contact
6. **Mutual knowledge** — during SEM interview, both spouses asked detailed questions about each other's daily lives, families, preferences

**Red flags that trigger enhanced scrutiny:**
- Age difference >20 years
- Marriage shortly after meeting (less than 1 year)
- Marriage close to a previous rejection of residence permit or asylum claim
- Spouse has previously sponsored multiple foreign nationals for residency
- Separate addresses at time of application
- Unable to describe spouse's family members, work, or daily routine during interview

### SEM Interview — What to Expect

SEM interviews each spouse **separately** in a different room on the same day. Questions include:

**About each other:**
- "What does your spouse do for work? What is their job title? Name of employer?"
- "What time does your spouse usually wake up / go to bed?"
- "What does your spouse eat for breakfast? Do they have any food allergies or preferences?"
- "What are your spouse's hobbies? What do they do on weekends?"
- "Name your spouse's closest friends. When did you last meet them together?"
- "What is your spouse's relationship with their parents / siblings?"
- "Where did you spend your last vacation together? Show us photos."
- "What is your spouse's mobile phone number? Do you know it by heart?"

**About the relationship:**
- "When and where did you first meet?"
- "Describe your first date. Where did you go?"
- "When did you first live together?"
- "Who proposed? How?"
- "Where was your wedding ceremony? Who attended? Describe the venue."

If answers differ significantly between spouses, SEM may investigate further or request additional documentation.`,
          keyPoints: [
            'SEM interviews both spouses separately on the same day — answers must be consistent about daily life details',
            'Common household is almost required — separate addresses at application will trigger rejection or extended investigation',
            'Joint financial documentation (bank statements showing shared expenses, joint account) is the strongest proof',
            'Social evidence matters: attestations from neighbors, employer confirmation of known partner, joint social media',
            'Cannot memorize answers — SEM asks specific, unexpected questions about daily habits and personal details'
          ]
        },
        {
          id: 'sham-marriage-scrutiny',
          title: 'Sham Marriage Scrutiny and Fraud Consequences',
          content: `## Sham Marriage (Mariage de complaisance): Legal Consequences

Swiss law takes sham marriage very seriously. SEM actively investigates suspected cases, and the consequences of fraud extend well beyond rejected naturalization.

**Legal Consequences of Fraudulent Facilitated Naturalization:**
- LN Art. 41: SEM can nullify (annuler) naturalization obtained by fraud up to **8 years** after the grant — you can lose citizenship retroactively
- Penal Code Art. 118: "Obtaining facilitated naturalization by providing false information" — up to **5 years imprisonment**
- The Swiss spouse who participated in a sham marriage can also face criminal charges (Gehilfenschaft, accessory)
- Your Swiss children born during the marriage retain citizenship even if yours is nullified, but children naturalized together with you could also be affected

**Common situations that are legitimate (but require documentation):**

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Situation</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Outcome</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Required Documentation</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Temporary separation due to work posting abroad</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Accepted with documentation</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Employer letter, flight records, evidence of weekly contact (WhatsApp call logs), maintained common household in CH</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Spouse working in another city (commuter marriage)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Generally accepted</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Both registered at same address as primary, evidence of weekend cohabitation, joint finances</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Marital difficulties / brief separation</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Risky — must be resolved before application</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Application must show stable current union; past difficulties can be disclosed and contextualized</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Separation / divorce proceedings initiated after application submitted</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Application rejected / nullified</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Must notify SEM immediately; naturalization granted on this basis will be annulled if divorce predates decision</td>
    </tr>
  </tbody>
</table>

**Timeline — Risks After Naturalization:**
The 8-year nullification window (LN Art. 41) means:
- Year 0: Naturalization granted
- Year 1: Divorce finalized — SEM investigates if divorce suggests sham marriage at time of application
- Year 7: SEM receives tip about fraudulent application — can still initiate nullification
- Year 8+1 day: Nullification no longer possible (statute of limitations)

If you divorce after genuine facilitated naturalization, you keep your citizenship. The law targets marriages that were sham from the beginning, not relationships that simply ended.`,
          keyPoints: [
            'LN Art. 41 allows SEM to nullify citizenship obtained by fraud up to 8 years after the grant — not just rejection',
            'Criminal penalty for obtaining facilitated naturalization fraudulently: up to 5 years imprisonment (StGB Art. 118)',
            'Brief post-naturalization divorce is not automatic grounds for nullification — intent at time of application is what matters',
            'Temporary work separations are legitimate if both spouses can document continued joint life and common household',
            'SEM must be notified if divorce proceedings start during the naturalization procedure — failure to do so can constitute fraud'
          ]
        },
        {
          id: 'application-timeline',
          title: 'Application Procedure and Timeline',
          content: `## Application Procedure: Step-by-Step with Timelines

**Eligibility Checklist (verify all before applying):**

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Requirement</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Your Check</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Evidence</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Married ≥3 years to Swiss citizen</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Marriage date: _____</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Marriage certificate + Swiss birth certificate of spouse</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">5 years total legal residence in Switzerland</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Arrival date: _____</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Permit history (B or C only); residence confirmations from all Gemeinden</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Continuous residence 1 year immediately preceding</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">No trips abroad >6 months in last 12 months</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Current permit, Gemeinde registration confirmation</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">B1 language (oral) + A2 written</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Certificate obtained: _____</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">fide certificate, Goethe B1, DELF B1, or Swiss school diploma</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Clean criminal record (Strafregisterauszug)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">No convictions in last 10 years</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Ordered from www.strafregister.admin.ch</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Not receiving social assistance</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">No Sozialhilfe in last 3 years</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Gemeinde confirmation; tax assessment showing income</td>
    </tr>
  </tbody>
</table>

**Processing Timeline (LN Art. 21 path):**

- **Weeks 1–4:** Gather and apostille all documents; submit application to SEM online or by post
- **Weeks 4–8:** SEM confirms receipt; assigns case number; requests any missing documents
- **Months 3–6:** SEM processes formal conditions; requests canton confirmation of permit validity
- **Months 6–10:** SEM invites both spouses for separate interviews (if union conjugale not clear from documents)
- **Months 10–14:** SEM issues decision; if approved, cantonal authority issues citizenship certificate
- **Total typical processing time:** 10–18 months (2025)
- **Federal fee:** CHF 100 (facilitated naturalization has no cantonal/commune fee — unlike ordinary naturalization)

**Common Rejection Reasons (SEM statistics):**
1. Union conjugale not effective at time of application (38% of rejections) — spouses living apart without documented reason
2. Language proficiency B1 not demonstrated (22%) — self-assessment without certificate not accepted
3. Social assistance received within last 3 years (18%) — including COVID emergency payments in some assessments
4. Criminal conviction not disclosed (12%) — even foreign convictions must be declared
5. Incomplete documentation, not corrected within deadline (10%)`,
          keyPoints: [
            'Federal fee for facilitated naturalization is only CHF 100 — far cheaper than ordinary naturalization (CHF 400–2,100+)',
            'Both spouses are interviewed separately by SEM — prepare together so your accounts of daily life are consistent',
            'Typical processing time is 10–18 months; apply as soon as eligibility criteria are met',
            'Criminal record must include foreign convictions — failure to declare a foreign conviction is treated as fraud',
            'COVID emergency payments (Notfallhilfe) may count as social assistance depending on canton — check before applying'
          ]
        }
      ]
    }
  ]
}
