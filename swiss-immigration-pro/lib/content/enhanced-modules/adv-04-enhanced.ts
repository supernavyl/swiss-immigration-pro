// Enhanced Module: ADV-04 - Tax & Financial Planning in Switzerland
// Based on official Swiss tax law, ESTV data, and 2025 federal/cantonal rates

export const adv04Enhanced = {
  id: 'adv-04-enhanced',
  title: 'Swiss Tax and Financial Planning',
  description: 'Master Swiss tax system, optimize your financial planning, and maximize wealth building in Switzerland. Comprehensive guide to federal and cantonal taxes, Pillar 2 and 3a pension optimization, investment strategies, and financial planning frameworks. Includes full 2025 tax tables, cantonal comparisons, and Pillar 3a/2 optimization calculators.',
  estimatedReadTime: '95-120 minutes',
  lastUpdated: 'February 2026',
  sections: [
    {
      id: 'tax-system-overview',
      title: 'Understanding the Swiss Tax System',
      content: `## Swiss Tax & Financial Planning: Complete Optimization Guide

Switzerland operates a unique three-level tax system (federal, cantonal, and communal) that creates significant variation in tax burdens across different locations. Understanding this system and optimizing your financial planning can result in substantial tax savings. For a CHF 150,000 income earner, choosing Zug over Vaud as a residence canton can mean a difference of CHF 15,000–25,000 in annual taxes — more than CHF 250,000 over a 15-year career.

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 2rem 0;">
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">3 Levels</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Federal + Canton + Commune</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">11.5%</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Max Federal Rate</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">CHF 7,056</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Max Pillar 3a (2025)</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">2× Difference</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Zug vs. Vaud Effective Rate</div>
  </div>
</div>

### How the Three Levels Stack

Every Swiss resident pays tax at all three levels simultaneously. The federal government sets a single progressive rate table applying uniformly nationwide. Each canton then adds its own parallel progressive tax (the largest component), and finally the municipality applies a multiplier on top of the cantonal tax.

**Level 1 — Federal Direct Tax (DBG, SR 642.11):**
- Progressive rates 0.77% → 11.5%
- Uniform across all 26 cantons
- Single taxpayers: zero-rate threshold CHF 14,500
- Married taxpayers: zero-rate threshold CHF 28,300
- Top bracket (11.5%) triggers at taxable income > CHF 755,200

**Level 2 — Cantonal Tax (StHG, SR 642.14):**
- Each canton sets its own schedule independently
- Largest single component — typically 60–70% of total tax bill
- Effective variation between cantons: factor of 2× for same income

**Level 3 — Communal Tax (Gemeindesteuer):**
- Municipality applies a multiplier (Steuerfuss) on the cantonal tax
- Typical range: 70–160% of cantonal base
- Within a canton, neighbouring communes can differ by 20–30%
- Example: Zurich city 119%, Küsnacht 75%, Kilchberg 76% (same canton ZH)

**Wealth Tax (Vermögenssteuer):**
- Switzerland levies annual wealth tax (no equivalent in US/UK)
- Applies to net assets above cantonal thresholds (typically CHF 50,000–150,000)
- Rates: 0.1–1.0% of taxable net wealth depending on canton
- Pension assets (Pillar 2, 3a) are exempt from wealth tax`,
      keyPoints: [
        'Switzerland has three tax levels: federal (uniform), cantonal (largest component, varies 2×), and communal (multiplier on cantonal)',
        'Federal direct tax tops out at 11.5% on income above CHF 755,200; zero rate below CHF 14,500',
        'Cantonal variation is the main lever: Zug effective rate ~13% vs. Vaud ~31% on CHF 150k income',
        'Wealth tax applies annually to net assets — Pillar 2 and 3a are exempt, reducing effective rate',
        'Choosing the right commune within a canton can save 20–30% on the cantonal tax portion alone'
      ],
      legalReferences: [
        'DBG — Bundesgesetz über die direkte Bundessteuer, SR 642.11',
        'StHG — Bundesgesetz über die Harmonisierung der direkten Steuern der Kantone und Gemeinden, SR 642.14',
        'MWSTG — Mehrwertsteuergesetz (VAT), SR 641.20',
        'BVG — Bundesgesetz über die berufliche Alters-, Hinterlassenen- und Invalidenvorsorge, SR 831.40',
        'BVV 2 — Verordnung über die berufliche Alters-, Hinterlassenen- und Invalidenvorsorge, SR 831.441.1'
      ],
      officialLinks: [
        { title: 'ESTV — Tax Calculators for All Cantons', url: 'https://www.estv.admin.ch/estv/de/home/direkte-bundessteuer/steuerrechner.html' },
        { title: 'Federal Tax Rates 2025 (DBG)', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/de' },
        { title: 'ESTV — Cantonal Comparison Tool', url: 'https://www.estv.admin.ch/estv/de/home/allgemein/steuerstatistiken/steuerstatistiken-kantone.html' }
      ],
      subsections: [
        {
          id: 'federal-tax-brackets',
          title: 'Federal Tax Brackets 2025: Complete Rate Table',
          content: `## Federal Direct Tax (DBG) — 2025 Rate Tables

The federal rate schedule is set annually by the ESTV and applies uniformly to all taxpayers regardless of their canton.

**Single Taxpayers — Federal Tax 2025**

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Taxable Income (CHF)</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Marginal Rate</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Tax on Bracket</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Cumulative Tax</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">0 – 14,500</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">0%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">0</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">0</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">14,500 – 31,600</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">0.77%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 132</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 132</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">31,600 – 41,400</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">0.88%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 86</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 218</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">41,400 – 55,200</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">2.64%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 364</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 582</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">55,200 – 72,500</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">2.97%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 514</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 1,096</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">72,500 – 78,100</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">5.94%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 333</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 1,429</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">78,100 – 103,600</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">6.60%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 1,683</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 3,112</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">103,600 – 134,600</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">8.80%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 2,728</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 5,840</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">134,600 – 176,000</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">11.00%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 4,554</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 10,394</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">176,000 – 755,200</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">11.50%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 66,628</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">up to CHF 77,022</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Above 755,200</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">11.50% flat</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">11.5% on every additional CHF</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 77,022+</td>
    </tr>
  </tbody>
</table>

**Married Taxpayers / Single Parents — Key Thresholds:**
- Zero-rate band: up to CHF 28,300
- 1% bracket starts at CHF 50,900
- 11.5% flat applies above CHF 912,600

**Key Federal Tax Deductions (DBG Art. 26–33):**

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Deduction Category</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Maximum Amount</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Conditions</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Pillar 3a Contributions</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 7,056 (2025)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Must have Pillar 2; CHF 35,280 if no Pillar 2</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Professional Expenses</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 2,800 (flat) or actual</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Min. 3% of net earnings; max CHF 2,800 flat</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Commuting Costs</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Up to CHF 3,000</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Public transport or car (justified necessity)</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Childcare Costs</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 25,500 per child</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">External care only; both parents working</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Health Insurance Premium</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Actual premiums paid</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Exceeding 5% of net income threshold</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Charitable Donations</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Up to 20% of net income</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">To recognized Swiss tax-exempt organisations (min. CHF 100)</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Home Office</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Actual costs (strict criteria)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Only if employer provides no desk; dedicated room required</td>
    </tr>
  </tbody>
</table>

**Practical Example — CHF 120,000 Gross Income, Single:**
Starting from CHF 120,000 gross, subtract AHV/ALV (≈CHF 5,500), Pillar 2 contributions (≈CHF 8,000), Pillar 3a (CHF 7,056), professional expenses (CHF 2,800), commuting (CHF 1,800) → taxable income approximately CHF 94,844. Federal tax on this amount: approximately CHF 2,850.`,
          keyPoints: [
            'Federal tax tops out at 11.5% flat on income above CHF 755,200; zero-rate band up to CHF 14,500 for singles',
            'All key deductions apply at federal level: Pillar 3a (CHF 7,056), professional expenses, childcare up to CHF 25,500/child',
            'At CHF 120,000 gross with standard deductions, taxable income drops to ≈CHF 95,000 and federal tax is ≈CHF 2,850',
            'Married taxpayers benefit from a separate (more generous) rate table — zero-rate up to CHF 28,300',
            'Federal tax represents only 20–30% of total tax burden; cantonal optimization has larger impact'
          ]
        },
        {
          id: 'cantonal-tax-comparison',
          title: 'All 26 Cantons: 2025 Effective Tax Rate Comparison',
          content: `## Cantonal Tax: Complete 2025 Comparison

This is the most impactful lever in Swiss tax planning. Moving from a high-tax to a low-tax canton with the same income can save CHF 10,000–30,000+ annually.

**Effective Total Tax Rates by Canton — 2025**
(Single taxpayer, city/main commune rate, income CHF 100,000 and CHF 200,000)

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Canton</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Effective Rate CHF 100k</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Effective Rate CHF 200k</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f0fdf4;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Zug (ZG)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~13.2%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~17.8%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Consistently lowest; crypto hub</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Schwyz (SZ)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~14.5%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~19.1%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Low wealth tax too</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Nidwalden (NW)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~15.0%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~19.8%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Attracts high-net-worth individuals</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Obwalden (OW)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~15.4%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~20.2%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Flat rate canton (regressive design)</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Appenzell I.Rh. (AI)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~16.1%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~20.9%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Smallest canton, limited services</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Uri (UR)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~16.8%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~21.5%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Rural; limited job market</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Glarus (GL)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~17.2%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~22.0%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Small, 3 communes only</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Graubünden (GR)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~18.4%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~23.1%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Trilingual, large, tourism-based economy</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Thurgau (TG)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~18.7%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~23.5%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Commuters to ZH; good value</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">St. Gallen (SG)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~19.0%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~24.0%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Strong business hub (Ostschweiz)</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Aargau (AG)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~19.5%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~24.6%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Biggest canton; pharma industry</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Lucerne (LU)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~19.8%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~25.0%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Central; improving rates</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Solothurn (SO)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~20.4%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~25.7%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Mid-range; Jura region</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Zurich (ZH)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~22.5%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~27.2%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Highest salaries offset tax; city Steuerfuss 119%</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Ticino (TI)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~22.8%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~27.8%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Italian-speaking; lifestyle advantages</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Fribourg (FR)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~23.0%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~28.2%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Bilingual; university city</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Berne (BE)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~23.3%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~28.5%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Capital; federal employment concentrated here</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Basel-Stadt (BS)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~24.2%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~29.1%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Pharma hub; high property prices offset</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Valais (VS)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~24.5%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~29.4%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Mountain lifestyle; lower living costs</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Neuchâtel (NE)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~24.8%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~29.8%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Watch industry; French-speaking</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Geneva (GE)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~25.6%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~30.7%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">High salaries, high taxes; no communal multiplier</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Jura (JU)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~26.0%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~31.1%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Youngest canton; limited economy</td>
    </tr>
    <tr style="background: #fef2f2;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Vaud (VD)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">~26.8%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">~31.8%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Consistently highest; Lausanne hub</td>
    </tr>
  </tbody>
</table>

**Tax Savings from Canton Optimization — Worked Example:**

Income: CHF 180,000 (software engineer, single, Zurich city flat → Zug Steinhausen)
- Zurich city effective rate: ≈26.5% → Total tax: ≈CHF 47,700
- Zug Steinhausen effective rate: ≈18.5% → Total tax: ≈CHF 33,300
- **Annual saving: ≈CHF 14,400**
- **Commuting cost Zug→Zurich:** CHF 4,500/year ZVV annual pass
- **Net annual benefit: ≈CHF 9,900** (plus wealth tax savings)

Note: Proof of genuine residence required — you must actually live there (Lebensmittelpunkt). Registering in Zug while living in Zurich constitutes tax fraud under DBG Art. 175.`,
          keyPoints: [
            'Zug is consistently Switzerland\'s lowest-tax canton at ~13.2% effective rate on CHF 100,000 — half the rate of Vaud (~26.8%)',
            'The difference between Zug and Vaud at CHF 180,000 income equals ≈CHF 14,400/year after commuting costs',
            'Within-canton variation also matters: Zurich city Steuerfuss 119% vs. Küsnacht 75% = ≈8% effective rate difference',
            'Geneva has no communal tax multiplier — the entire cantonal rate applies uniformly, simplifying planning',
            'Fictitious residence (domicile de complaisance) is illegal — you must genuinely live where you register'
          ]
        },
        {
          id: 'pension-optimization',
          title: 'Pillar 3a and Pillar 2: Optimization with Calculations',
          content: `## Swiss Pension System: Complete Optimization Guide

### Three-Pillar Architecture

**Pillar 1 — AHV/AVS (State Pension):**
- Mandatory contribution: 8.7% of gross salary (4.35% employee + 4.35% employer), plus 2.2% ALV
- Maximum AHV pension at full retirement (65M/65F): CHF 29,400/year (2025)
- Contribution gap years permanently reduce pension; buy-in possible via AHV cantonal office
- Limited optimization potential

**Pillar 2 — BVG Occupational Pension:**
- Mandatory for employees earning ≥ CHF 22,050/year (2025)
- Coordination deduction: CHF 25,725 (reduces insured salary)
- Minimum BVG insured salary: CHF 3,675; maximum: CHF 88,200
- Conversion rate at retirement: minimum 6.8% (federal minimum, BVG Art. 14)
- Your fund may offer higher rates — check your Vorsorgeausweis

**Pillar 3a — Tax-Optimized Private Savings:**
- 2025 limits: CHF 7,056 (employees with Pillar 2) / CHF 35,280 (self-employed without Pillar 2, up to 20% of net earnings)
- Fully deductible from federal AND cantonal taxable income
- Growth: interest/dividends accumulate tax-free (no wealth or income tax on gains)
- Withdrawal: taxed separately at reduced rate (typically 4–10% depending on canton)

---

### Pillar 3a Tax Saving Calculator

**At different marginal rates, your CHF 7,056 contribution saves:**

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Income Level (Single)</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Canton</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Marginal Rate</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Tax Saving from CHF 7,056</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 80,000</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Zug</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~22%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;"><strong>≈CHF 1,550</strong></td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 80,000</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Zurich</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~32%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;"><strong>≈CHF 2,260</strong></td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 150,000</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Zug</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~28%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;"><strong>≈CHF 1,980</strong></td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 150,000</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Vaud</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~40%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;"><strong>≈CHF 2,820</strong></td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 250,000</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Geneva</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">~44%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;"><strong>≈CHF 3,105</strong></td>
    </tr>
  </tbody>
</table>

**Multi-Account 3a Strategy (key optimization):**
Open 2–5 separate Pillar 3a accounts (e.g., at Frankly, VIAC, finpension, and a bank). Swiss law requires full withdrawal per account. By staggering multiple accounts, you withdraw one per year at retirement, staying in lower tax brackets each year instead of a single large lump sum.

Example: CHF 300,000 in one account withdrawn in year 1 → taxed at ≈9% in Zurich → tax ≈CHF 27,000.
CHF 60,000 from each of 5 accounts over 5 years → taxed at ≈4.5% each → total tax ≈CHF 13,500. Saving: CHF 13,500.

---

### Pillar 2 Buy-In (Einkauf): The Highest-Return Tax Optimization

Voluntary buy-ins into your Pillar 2 (BVG) fund are the most powerful tax deduction available in Switzerland for high earners because there is no maximum cap — you can buy in your full purchase gap in one year.

**How to find your purchase gap:**
1. Request your latest Vorsorgeausweis from your employer/pension fund
2. Look for "Maximal möglicher Einkauf" (maximum possible purchase)
3. Your gap = (maximum possible retirement capital) − (current capital at the fund)

**Tax impact of a CHF 50,000 buy-in:**

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Scenario</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Marginal Rate</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Tax Saved</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Net Cost of CHF 50k Buy-In</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">High earner, Zug (30% marginal)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">30%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;"><strong>CHF 15,000</strong></td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 35,000</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">High earner, Vaud (42% marginal)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">42%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;"><strong>CHF 21,000</strong></td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 29,000</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Executive, Geneva (44% marginal)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">44%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;"><strong>CHF 22,000</strong></td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 28,000</td>
    </tr>
  </tbody>
</table>

**Critical restriction (BVG Art. 79b, para. 3):** You cannot withdraw Pillar 2 to purchase property for 3 years after a voluntary buy-in. Plan timing carefully — do not buy in if you intend to use the WEF (Wohneigentumsförderung) withdrawal within 3 years.

**Pillar 3a Provider Comparison (2025):**

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Provider</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Type</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Max Equity %</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Fees (TER)</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Notable Feature</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">VIAC</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Digital/App</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">97%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">0.44% p.a.</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Highest equity; market leader</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Frankly (ZKB)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Digital/App</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">95%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">0.45% p.a.</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">ZKB backing; ZH residents: CHF 100 bonus</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">finpension</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Digital/App</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">99%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">0.39% p.a.</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Lowest fees; also manages Pillar 2</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">UBS (bank 3a)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Traditional bank</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">75%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">0.95% p.a.</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Good for cash-only; lower equity cap</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">PostFinance</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Traditional bank</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">75%</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">0.85% p.a.</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Widely accessible; PostFinance E-Finance</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Swisslife (insurance)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Insurance 3a</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Varies</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">1.5–2.5% p.a.</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Includes life/disability cover; inflexible</td>
    </tr>
  </tbody>
</table>

**Recommendation:** Use digital providers (VIAC, finpension, Frankly) for investment-focused 3a accounts. Avoid insurance-linked 3a unless you specifically need the coverage component — the high fees severely erode long-term returns. Open 3–5 accounts across 2–3 providers for both diversification and staged-withdrawal optimization.`,
          keyPoints: [
            'Pillar 3a maximum CHF 7,056 (2025); saves CHF 1,550–3,105 in taxes depending on income and canton',
            'Multi-account strategy: open 3–5 accounts, withdraw one per year at retirement to stay in lower brackets',
            'Pillar 2 buy-in has no cap — a CHF 50,000 buy-in can save CHF 15,000–22,000 in taxes at high marginal rates',
            'BVG Art. 79b: 3-year lock-out after a Pillar 2 buy-in before WEF property withdrawal is allowed',
            'Digital providers (finpension 0.39%, VIAC 0.44%) beat traditional banks (UBS 0.95%) by ≈0.5% annually — significant over 20 years'
          ]
        }
      ]
    },
    {
      id: 'financial-planning',
      title: 'Long-Term Financial Planning: Swiss-Specific Strategies',
      content: `## Financial Planning Framework for Switzerland

### Year-by-Year Checklist: New Arrival (First 5 Years)

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Year</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Priority Actions</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Financial Impact</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Year 1</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Open Pillar 3a (VIAC/finpension); choose canton strategically if flexible; maximize health insurance Franchise (CHF 2,500); open broker account (Swissquote or IBKR); build 3-month emergency fund in CHF</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 2,000–3,000 annual tax saving; CHF 1,200 health premium saving from max Franchise</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Year 2</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Open 2nd Pillar 3a account; review Pillar 2 Vorsorgeausweis; calculate buy-in gap; assess canton change if sub-optimal; file first tax return with all deductions claimed</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Buy-in of CHF 20,000 saves CHF 6,000–8,000 if timing is right</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Year 3</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Open 3rd Pillar 3a account; consider Pillar 2 buy-in if no WEF planned; evaluate property purchase feasibility (requires C permit or 5 years with B); assess investment portfolio allocation</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">3-account strategy in place for optimal staged withdrawal</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Year 4–5</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Assess property purchase (Lex Koller if non-EU); review AHV gap years; consider additional income sources (consulting, dividends) and their cantonal tax treatment; long-term canton strategy review</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Total optimized annual tax savings: CHF 8,000–20,000 vs. unoptimized approach</td>
    </tr>
  </tbody>
</table>

### Swiss Property: Financial Considerations

Swiss property ownership involves unique tax and financial dynamics not present in other countries.

**Who Can Buy:**
- Swiss citizens and C permit holders: no restrictions
- B permit holders: general restriction, exceptions for primary residence in most cantons (ANAG/Lex Koller, SR 211.412.41)
- Non-resident EU/EFTA: must obtain Lex Koller authorization
- Non-EU non-residents: generally prohibited (vacation properties in resort areas only, strictly limited)

**Mortgage and Financing:**
- Maximum LTV (Loan-to-Value): 80% (standard), up to 90% for primary residence with special approval
- Minimum 10% from non-pension sources (i.e., 10% of purchase price cannot come from Pillar 2)
- Amortization required to below 67% LTV within 15 years or by retirement (whichever is earlier)
- Variable mortgage rates in Switzerland: SARON-linked (short-term), 0.9–2.5% range (2025)
- Fixed rates 5-year: approximately 1.8–2.8% (2025)

**Eigenmietwert (Deemed Rental Value) — Swiss-Unique Tax:**
Switzerland taxes homeowners on a "deemed rental income" even if they live in their own property. This is the Eigenmietwert (canton-level) and Eigenmietwert/valeur locative (federal level, DBG Art. 21).
- Typically set at 60–70% of market rental value by cantonal assessors
- Adds CHF 15,000–40,000 to taxable income for a typical Zurich property
- Offset by: mortgage interest deduction (full amount), maintenance deduction (flat 20% of Eigenmietwert, or actual if higher)
- Parliament voted to abolish Eigenmietwert for primary residences — reform pending (as of 2026, not yet enacted)

**Property Purchase Cost Summary (Geneva example, CHF 1,200,000 property):**

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Cost Item</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Amount</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Property price</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 1,200,000</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Base purchase price</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Transfer tax (GE: DTMF)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 18,000 (1.5%)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Varies by canton: ZH 1.5%, ZG 1%, NE 3.3%</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Notary fees</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 3,000–6,000</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Land registry, deed preparation</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Real estate agent</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 24,000–36,000 (2–3%)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Paid by seller in most cantons; buyer may pay in GE</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Minimum equity required</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">CHF 240,000 (20%)</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Max CHF 120,000 from Pillar 2 WEF</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">Total upfront cash needed</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000; font-weight: 700;">≈CHF 285,000</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Including 10% non-pension equity + transaction costs</td>
    </tr>
  </tbody>
</table>

### Investment Strategy: Swiss Tax Context

**Capital Gains Tax: Generally None**
Switzerland does not levy capital gains tax for private investors. Gains from selling shares, ETFs, or bonds as a private individual are tax-free — provided you are not deemed a "professional trader" (Wertschriftenhändler). Professional trading criteria include: high transaction frequency, use of margin/leverage, short holding periods, using gains as primary income source.

**Dividend and Interest Income:**
- Dividends are subject to 35% federal withholding tax (Verrechnungssteuer, VStG Art. 4)
- Swiss resident tax return: reclaim the 35% withholding after declaring dividends as income
- Net effect: dividends taxed at your marginal rate (not 35%)
- Foreign dividends: subject to double-taxation treaties (typically 15% withholding by source country, credited against Swiss tax)

**Swiss Stamp Duty (Umsatzabgabe, SR 641.10):**
- 0.075% on Swiss securities (per transaction, both buy and sell)
- 0.15% on foreign securities
- Applies via Swiss brokers; avoid with Interactive Brokers (EU entity) for foreign shares

**Optimal Swiss Investment Allocation:**
1. Maximize Pillar 3a (tax-free growth) → 97–99% global equity ETFs (finpension/VIAC)
2. Emergency fund (3–6 months expenses) in SARON savings account (~0.8–1.2% 2025)
3. Taxable portfolio via low-cost broker (Swissquote, IBKR): diversified global ETF index funds
4. Pillar 2 investment options: if your fund offers Super-Obligatorium investment choice, opt for higher equity allocation (30–75%) for long-horizon workers`,
      keyPoints: [
        'Switzerland has no capital gains tax for private investors — gains from shares/ETFs are tax-free unless deemed professional trading',
        'The 35% federal withholding tax on dividends is fully reclaimable via the annual tax return; you pay only your marginal rate',
        'Eigenmietwert (deemed rental income) is a unique Swiss homeowner tax — offset via mortgage interest and 20% maintenance deductions',
        'Property purchase requires 20% equity minimum, with only 10% allowed from Pillar 2 WEF — plan 5+ years ahead',
        'Year-1 priority: open Pillar 3a at VIAC/finpension + maximize health insurance Franchise to CHF 2,500 = ≈CHF 3,000–4,000 saved annually'
      ],
      legalReferences: [
        'DBG Art. 21 — Eigenmietwert / deemed rental value of owner-occupied property',
        'DBG Art. 26–33 — Deductions from taxable income (professional expenses, childcare, 3a)',
        'BVG Art. 79b — Voluntary buy-in into occupational pension and withdrawal restrictions (3-year rule)',
        'VStG (Verrechnungssteuergesetz, SR 642.21) — 35% federal withholding tax on dividends',
        'Lex Koller (SR 211.412.41) — Restrictions on acquisition of real estate by non-residents',
        'StHG Art. 7–16 — Cantonal tax harmonization (income and wealth tax)'
      ],
      officialLinks: [
        { title: 'ESTV Tax Calculator (federal + cantonal)', url: 'https://www.estv.admin.ch/estv/de/home/direkte-bundessteuer/steuerrechner.html' },
        { title: 'AHV/AVS Contribution Calculator', url: 'https://www.ahv-iv.ch' },
        { title: 'BVG — Federal Social Insurance Office (pension)', url: 'https://www.bsv.admin.ch/bsv/de/home/sozialversicherungen/bv.html' },
        { title: 'finpension Pillar 3a', url: 'https://finpension.ch' },
        { title: 'VIAC Pillar 3a', url: 'https://viac.ch' },
        { title: 'Frankly by ZKB', url: 'https://www.frankly.ch' },
        { title: 'Comparis — Health Insurance Premium Comparison', url: 'https://www.comparis.ch/krankenkasse' }
      ],
      subsections: [
        {
          id: 'tax-return-filing',
          title: 'Filing Your Swiss Tax Return: Practical Guide',
          content: `## Swiss Tax Return (Steuererklärung): Practical Filing Guide

### Timeline

<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem;">
  <thead>
    <tr style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Date</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Action</th>
      <th style="padding: 0.75rem; text-align: left; border: 1px solid #bfdbfe;">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Jan–Feb</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Gather documents</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Lohnausweis from employer, bank statements, Vorsorgeausweis, 3a confirmations</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Mar 31</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Standard filing deadline</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Most cantons; extensions usually granted automatically upon request</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Apr–May</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Last deadline with extension</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Request extension via cantonal tax portal before March 31</td>
    </tr>
    <tr>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Sep–Nov</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Assessment notice arrives</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">30 days to appeal (Einsprache) if incorrect</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Dec 31</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Last day for 3a contribution</td>
      <td style="padding: 0.6rem 0.75rem; border: 1px solid #bfdbfe; color: #000000;">Payment must be received by institution by Dec 31 (not sent)</td>
    </tr>
  </tbody>
</table>

**Tax Software:**
- **TaxMe.ch** — Multi-canton; CHF 29/year; best for simple returns
- **Taxway** — Popular in German-speaking cantons; CHF 25–50
- **VaudTax** (Vaud), **TaxAssist** (Geneva) — Canton-specific free tools
- **iFile** — Zurich cantonal e-filing portal (free)
- **EasyTax** — Free cantonal software for most German-speaking cantons

**Most Missed Deductions:**
1. **Home office** — if you work from home and employer confirms no dedicated desk, deduct proportional rent (room area ÷ total apartment area × rent)
2. **Professional development** — courses, certifications, books related to current role (not career change); receipts required
3. **Meal deduction** — if working away from home ≥1 day/week, flat deduction CHF 3,200/year (federal)
4. **Childcare** — up to CHF 25,500 per child under 14 for external care (Krippe, Hort); both parents must work
5. **Bank charges and investment fees** — deductible as asset management expenses on wealth portion of return
6. **Charitable donations** — organizations listed on ESTV recognition list; keep receipts ≥ CHF 100`,
          keyPoints: [
            'Swiss tax return deadline is March 31; extensions to September are routinely granted on request — never file late',
            'Pillar 3a payment must arrive at the institution by December 31 (not postmarked) — wire transfer 2–3 days early',
            'Childcare deduction up to CHF 25,500 per child is frequently missed by new arrivals — collect all Krippe receipts',
            'Appeal the assessment (Einsprache) within 30 days if the notice is incorrect — cantonal tax offices frequently make errors on foreign income',
            'Most cantons offer free e-filing software (iFile ZH, EasyTax) — no need for paid tools unless you have complex situations'
          ]
        }
      ]
    }
  ]
}
