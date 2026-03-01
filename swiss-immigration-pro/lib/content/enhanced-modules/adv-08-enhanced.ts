// Enhanced Module: ADV-08 - Housing & Cost of Living Guide
// Based on Swiss rental law (OR Art. 253-274), cantonal housing regulations, and cost of living data

export const adv08Enhanced = {
  id: 'adv-08-enhanced',
  title: 'Swiss Housing and Cost of Living',
  description: 'Master Swiss rental markets, housing requirements, cost of living, and practical living expenses. Comprehensive guide to finding housing, rental contracts, deposits, utilities, living costs by canton, and budgeting strategies. Includes detailed analysis of rental law, housing documentation requirements, cost breakdowns, and optimization strategies.',
  estimatedReadTime: '95-120 minutes',
  lastUpdated: 'January 2025',
  sections: [
    {
      id: 'housing-overview',
      title: 'Understanding the Swiss Housing Market',
      content: `## Swiss Housing & Cost of Living: Complete Practical Guide

Finding suitable and affordable housing in Switzerland is one of the most critical challenges for immigrants. The Swiss rental market is characterized by high demand, competitive application processes, strict documentation requirements, and significant regional cost variations. Understanding rental law, housing search strategies, documentation requirements, and cost management is essential for successful settlement and maintaining legal residence status.

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 2rem 0;">
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">1/3</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Income Rule for Rent</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">2-3x</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Monthly Rent Deposit</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">CHF 2.1k</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Avg 2-Bed Apartment</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">30-50%</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Canton Cost Variation</div>
  </div>
</div>

### Legal Framework: Swiss Rental Law

**Swiss Code of Obligations (OR Art. 253-274):**

Swiss rental law is primarily governed by the Code of Obligations (Obligationenrecht), specifically Articles 253-274, which establish comprehensive rights and obligations for both landlords and tenants.

**Key Legal Principles:**
- **Rental Contract Requirements (OR Art. 253-256):** Written contracts standard, minimum notice periods established
- **Deposit Regulations (OR Art. 257):** Maximum 3 months' rent, must be held in separate account, interest accrues
- **Rent Increases (OR Art. 269a-269d):** Strict regulations on rent increase justification and limits
- **Tenant Protection (OR Art. 260-268):** Strong tenant rights, protection against unfair termination
- **Maintenance and Repairs (OR Art. 259):** Clear division of responsibilities

**Cantonal Variations:**
While federal law establishes general principles, cantons and municipalities may have additional regulations regarding:
- Housing standards and requirements
- Maximum occupancy
- Documentation requirements for foreigners
- Integration-related housing obligations

### Rental Market Overview

**Market Characteristics:**
- High demand, especially in major cities (Zurich, Geneva, Basel)
- Competitive application processes
- Preference for long-term tenants
- Strict documentation and reference requirements
- Significant regional cost variations (30-50% differences)

**Average Rental Costs by Canton (2025, 2-bedroom apartment):**
- Zurich: CHF 1,800-2,900/month
- Geneva: CHF 2,000-3,200/month
- Basel-Stadt: CHF 1,650-2,600/month
- Bern: CHF 1,500-2,300/month
- Lausanne: CHF 1,650-2,500/month
- Smaller cantons: CHF 1,000-1,650/month

**Additional Costs (Nebenkosten / Charges):**
- Utilities (electricity, water, heating): CHF 150-300/month
- Building maintenance and cleaning: CHF 50-150/month
- Property taxes (if applicable): Varies
- Total additional costs: Typically 10-20% of base rent`,
      keyPoints: [
        'Swiss rental law (OR Art. 253-274) establishes comprehensive rights and obligations for landlords and tenants',
        'Standard rule: Rent should not exceed 1/3 of gross monthly income for approval likelihood',
        'Deposit maximum: 3 months\' rent (OR Art. 257), held in separate account with interest',
        'Average 2-bedroom apartment costs CHF 1,650-2,900/month in major cities, with 30-50% canton variations',
        'Additional costs (Nebenkosten) typically add 10-20% to base rent for utilities and maintenance'
      ],
      legalReferences: [
        'OR Art. 253-274 (Rental Law)',
        'OR Art. 257 (Deposit Regulations)',
        'OR Art. 269a-269d (Rent Increase Regulations)',
        'Cantonal Housing Regulations',
        'Swiss Tenants\' Association Guidelines'
      ],
      officialLinks: [
        { title: 'Swiss Tenants\' Association', url: 'https://www.mieterschutz.ch' },
        { title: 'Housing Search Platforms', url: 'https://www.homegate.ch' },
        { title: 'Cost of Living Calculator', url: 'https://www.comparis.ch' }
      ],
      subsections: [
        {
          id: 'housing-search',
          title: 'Housing Search: Finding Suitable Accommodation',
          content: `## Housing Search: Strategic Approaches and Resources

Finding suitable housing in Switzerland requires strategic planning, comprehensive documentation, and understanding of market dynamics.

**Search Platforms:**
- **homegate.ch**: Largest Swiss rental platform
- **immoscout24.ch**: Comprehensive listings
- **comparis.ch**: Comparison and search tool
- **newhome.ch**: New construction and modern apartments
- **Local real estate agencies**: Direct listings
- **Word of mouth and networking**: Often most effective

**Application Documents Required:**
- Completed rental application form
- Copy of residence permit (B or L permit)
- Proof of income (employment contract, salary statements)
- Credit check (Betreibungsauszug / Extrait du registre des poursuites)
- Reference letters (previous landlords, employers)
- Bank statements (demonstrating financial stability)
- Personal identification (passport, ID card)

**Application Strategy:**
- Apply immediately (competition is intense)
- Complete all documentation perfectly
- Write compelling cover letter
- Provide strong references
- Demonstrate financial stability
- Show commitment to long-term tenancy`,
          keyPoints: [
            'Major platforms: homegate.ch, immoscout24.ch, comparis.ch provide comprehensive listings',
            'Required documents: residence permit, income proof, credit check, references, bank statements',
            'Competition is intense—applications must be complete, professional, and submitted immediately',
            'Credit check (Betreibungsauszug) is mandatory and must show clean record',
            'Strong references from previous landlords and employers significantly improve application success'
          ]
        },
        {
          id: 'rental-contract',
          title: 'Rental Contracts: Understanding Terms and Conditions',
          content: `## Rental Contracts: Legal Terms and Tenant Rights

Understanding rental contract terms, tenant rights, and legal obligations is essential for successful tenancy.

**Standard Contract Terms:**
- Duration: Indefinite (unlimited) or fixed-term
- Notice periods: 3 months typically (varies by canton and contract)
- Deposit: Maximum 3 months' rent (OR Art. 257)
- Maintenance responsibilities: Defined in contract
- Subletting: Typically requires landlord approval

**Tenant Rights:**
- Protection against unfair termination
- Right to reasonable rent increases (with justification)
- Right to property condition documentation
- Right to privacy and quiet enjoyment
- Protection against discrimination

**Rent Increase Regulations (OR Art. 269a-269d):**
- Increases must be justified (interest rates, costs, inflation)
- Maximum increase limits apply
- Notice period required
- Right to challenge increases`,
          keyPoints: [
            'Rental contracts are typically indefinite with 3-month notice periods, though fixed-term contracts exist',
            'Deposit maximum is 3 months\' rent (OR Art. 257) and must be held in separate account',
            'Strong tenant protection rights include protection against unfair termination and rent increases',
            'Rent increases must be justified and follow strict legal requirements (OR Art. 269a-269d)',
            'Understanding contract terms and tenant rights enables successful navigation of rental relationships'
          ]
        },
        {
          id: 'cost-living',
          title: 'Cost of Living: Comprehensive Breakdown by Category',
          content: `## Cost of Living: Detailed Expense Analysis

Understanding total cost of living in Switzerland enables realistic budgeting and financial planning.

**Monthly Living Cost Breakdown (Major Cities, Single Person):**

**Housing:**
- Rent (1-bedroom): CHF 1,000-1,650
- Rent (2-bedroom): CHF 1,650-2,900
- Utilities (Nebenkosten): CHF 120-250
- Internet/Phone: CHF 50-100
- **Total Housing: CHF 1,170-3,250/month**

**Food:**
- Groceries: CHF 400-700/month
- Restaurants (moderate): CHF 200-500/month
- **Total Food: CHF 600-1,200/month**

**Transport:**
- Public transport (monthly pass): CHF 70-150
- Car (if applicable): CHF 400-800/month
- **Total Transport: CHF 70-800/month**

**Insurance:**
- Health insurance: CHF 300-500/month
- Liability insurance: CHF 10-20/month
- Household insurance: CHF 15-30/month
- **Total Insurance: CHF 325-550/month**

**Other:**
- Clothing: CHF 100-300/month
- Entertainment: CHF 200-500/month
- Miscellaneous: CHF 200-400/month
- **Total Other: CHF 500-1,200/month**

**Total Monthly Living Costs (Single Person):**
- **Minimum (basic lifestyle):** CHF 2,500-3,800/month
- **Moderate:** CHF 3,800-5,800/month
- **Comfortable:** CHF 5,800-8,500+/month

**Family Costs (2 adults, 1 child):**
- Housing (3-bedroom): CHF 2,000-3,700/month
- Food: CHF 1,000-1,700/month
- Childcare/School: CHF 600-1,600/month
- Health insurance (family): CHF 800-1,300/month
- **Total Family: CHF 4,800-9,500+/month**`,
          keyPoints: [
            'Monthly living costs for single person: CHF 2,500-5,800 depending on lifestyle and location',
            'Housing represents largest expense (40-50% of total), followed by food (15-20%) and insurance (10-15%)',
            'Family costs (2 adults, 1 child): CHF 4,800-9,500+ monthly depending on location and lifestyle',
            'Significant regional variations: Zurich and Geneva 20-30% higher than smaller cities',
            'Comprehensive budgeting should include all categories: housing, food, transport, insurance, and discretionary spending'
          ]
        }
      ]
    }
  ]
}



