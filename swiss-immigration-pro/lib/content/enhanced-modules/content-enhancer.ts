// Content Enhancement Utility
// Provides templates and data for enriching modules with detailed content, links, and interactive elements

export const INTERACTIVE_ELEMENTS = {
  // Statistics boxes with animated numbers
  statBox: (value: string, label: string, color: string = 'blue') => `
    <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center; transition: transform 0.3s ease;">
      <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">${value}</div>
      <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">${label}</div>
    </div>
  `,

  // Progress bars with percentages
  progressBar: (label: string, percentage: number, color: string = 'blue') => `
    <div style="margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span style="color: #000000; font-weight: 500;">${label}</span>
        <span style="font-weight: 700; color: #1e40af;">${percentage}%</span>
      </div>
      <div style="background: #e0f2fe; border-radius: 0.25rem; height: 0.75rem;">
        <div style="background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); height: 100%; border-radius: 0.25rem; width: ${percentage}%; transition: width 0.5s ease;"></div>
      </div>
    </div>
  `,

  // Data table
  dataTable: (headers: string[], rows: string[][]) => {
    const headerRow = headers.map(h => `<th style="padding: 0.75rem; text-align: left; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid #1e40af;">${h}</th>`).join('');
    const dataRows = rows.map(row => 
      `<tr style="border-bottom: 1px solid #bfdbfe;">
        ${row.map(cell => `<td style="padding: 0.75rem; color: #000000; border: 1px solid #bfdbfe;">${cell}</td>`).join('')}
      </tr>`
    ).join('');
    
    return `
      <div style="overflow-x: auto; margin: 2rem 0; border: 2px solid #3b82f6; border-radius: 0.5rem;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>${headerRow}</tr>
          </thead>
          <tbody>
            ${dataRows}
          </tbody>
        </table>
      </div>
    `;
  },

  // Comparison cards
  comparisonCards: (items: Array<{ title: string; features: string[]; highlight?: boolean }>) => `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
      ${items.map(item => `
        <div style="background: ${item.highlight ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)'}; border: 2px solid ${item.highlight ? '#f59e0b' : '#3b82f6'}; padding: 1.5rem; border-radius: 0.75rem; ${item.highlight ? 'box-shadow: 0 10px 25px rgba(245, 158, 11, 0.2);' : ''}">
          <h4 style="font-size: 1.25rem; font-weight: 700; color: #000000; margin-bottom: 1rem; border-bottom: 2px solid ${item.highlight ? '#f59e0b' : '#3b82f6'}; padding-bottom: 0.5rem;">${item.title}</h4>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${item.features.map(feature => `
              <li style="padding: 0.5rem 0; color: #000000; border-bottom: 1px solid rgba(0,0,0,0.1);">
                <span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">✓</span>${feature}
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `,

  // Timeline component
  timeline: (events: Array<{ date: string; title: string; description: string }>) => `
    <div style="position: relative; padding: 2rem 0; margin: 2rem 0;">
      ${events.map((event, index) => `
        <div style="display: flex; margin-bottom: 2rem; position: relative;">
          <div style="flex-shrink: 0; width: 3rem; height: 3rem; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            ${index + 1}
          </div>
          <div style="flex: 1; margin-left: 1.5rem; padding-bottom: 2rem; border-left: 2px solid #bfdbfe; padding-left: 1.5rem;">
            <div style="font-weight: 700; color: #1e40af; font-size: 0.875rem; margin-bottom: 0.25rem;">${event.date}</div>
            <h4 style="font-size: 1.125rem; font-weight: 700; color: #000000; margin-bottom: 0.5rem;">${event.title}</h4>
            <p style="color: #374151; line-height: 1.6;">${event.description}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `
};

// Official Links Database
export const OFFICIAL_LINKS = {
  sem: {
    main: { title: 'SEM - State Secretariat for Migration', url: 'https://www.sem.admin.ch/sem/en/home.html' },
    workPermits: { title: 'SEM - Work Permits', url: 'https://www.sem.admin.ch/sem/en/home/themen/arbeit.html' },
    euEfta: { title: 'SEM - EU/EFTA Citizens', url: 'https://www.sem.admin.ch/sem/en/home/themen/arbeit/eu_efta-angehoerige.html' },
    nonEu: { title: 'SEM - Non-EU/EFTA Nationals', url: 'https://www.sem.admin.ch/sem/en/home/themen/arbeit/nicht-eu_efta-angehoerige.html' },
    quota: { title: 'SEM - Quota System', url: 'https://www.sem.admin.ch/sem/en/home/themen/arbeit/nicht-eu_efta-angehoerige/hoe entwickeltzahlen.html' },
    citizenship: { title: 'SEM - Citizenship', url: 'https://www.sem.admin.ch/sem/en/home/themen/buergerrecht.html' },
    integration: { title: 'SEM - Integration', url: 'https://www.sem.admin.ch/sem/en/home/integration-einbuergerung/integration.html' },
    cantons: { title: 'SEM - Cantonal Authorities', url: 'https://www.sem.admin.ch/sem/en/home/ueberuns/kontakt/kantonale_behoerden.html' }
  },
  seco: {
    main: { title: 'SECO - State Secretariat for Economic Affairs', url: 'https://www.seco.admin.ch/seco/en/home.html' },
    salaryData: { title: 'SECO - Salary Data', url: 'https://www.seco.admin.ch/seco/en/home/Arbeit/Arbeitsbedingungen/Lohnbestimmungen.html' },
    jobRoom: { title: 'Job-Room.ch - Official Job Portal', url: 'https://www.job-room.ch' }
  },
  legal: {
    aug: { title: 'AuG - Foreign Nationals Act (SR 142.20)', url: 'https://www.fedlex.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2007/758/20240101/de/pdf-a/fedlex-data-admin-ch-eli-cc-2007-758-20240101-de-pdf-a.pdf' },
    vzae: { title: 'VZAE - Implementation Ordinance (SR 142.201)', url: 'https://www.fedlex.admin.ch' },
    stag: { title: 'StAG - Citizenship Act (SR 141.0)', url: 'https://www.fedlex.admin.ch' },
    oln: { title: 'OLN - Naturalization Ordinance (SR 141.01)', url: 'https://www.fedlex.admin.ch' }
  },
  other: {
    swissInfo: { title: 'SwissInfo.ch - Immigration News', url: 'https://www.swissinfo.ch' },
    federalStats: { title: 'Federal Statistical Office', url: 'https://www.bfs.admin.ch' },
    fide: { title: 'fide - Language Tests', url: 'https://www.fide-info.ch' }
  }
};

// Comprehensive Statistics Data (2025)
export const STATISTICS_DATA = {
  immigration: {
    totalForeignPopulation: '2,368,364',
    percentageOfPopulation: '25.7%',
    netImmigration2024: '83,392',
    euEftaPercentage: '70.7%',
    annualQuota: '8,500',
    lPermits: '4,000',
    bPermits: '4,500'
  },
  topCountries: [
    { country: 'Germany', count: '19,234', percentage: 14.1 },
    { country: 'France', count: '12,891', percentage: 9.4 },
    { country: 'Italy', count: '11,456', percentage: 8.4 },
    { country: 'Portugal', count: '8,932', percentage: 6.5 },
    { country: 'USA', count: '4,123', percentage: 3.0 }
  ],
  cantons: {
    zurich: { successRate: 15, quotaExhaustion: 'August-September', avgSalary: 'CHF 95,000' },
    geneva: { successRate: 28, quotaExhaustion: 'September-October', avgSalary: 'CHF 88,000' },
    baselStadt: { successRate: 42, quotaExhaustion: 'October-November', avgSalary: 'CHF 92,000' },
    zug: { successRate: 38, quotaExhaustion: 'October-November', avgSalary: 'CHF 105,000' },
    vaud: { successRate: 32, quotaExhaustion: 'September-October', avgSalary: 'CHF 85,000' }
  },
  quotas: {
    q1Exhaustion: '35-40%',
    q2Exhaustion: '60-70%',
    q3Exhaustion: '85-90%',
    q4Exhaustion: '95-100%'
  }
};

// Legal References Database
export const LEGAL_REFERENCES = {
  permits: [
    'AuG Art. 21-24 (L Permits)',
    'AuG Art. 25-30 (B Permits)',
    'AuG Art. 32-34 (C Permits)',
    'VZAE Art. 11-45 (Detailed Permit Regulations)',
    'OASA Art. 19-21 (Quota System)'
  ],
  citizenship: [
    'StAG Art. 12 (Naturalization Requirements)',
    'OLN Art. 4-9 (Integration Criteria)',
    'OLN Art. 6 (Language Requirements)',
    'StAG Art. 38 (Collective Naturalization)'
  ],
  integration: [
    'AuG Art. 54 (Integration Requirements)',
    'FNIA Art. 58a-58f (Integration Measures)',
    'VIntA (Federal Integration Ordinance)'
  ],
  employment: [
    'OR Art. 319-362 (Swiss Code of Obligations - Employment)',
    'ArG (Employment Act)',
    'SECO Labor Market Regulations'
  ]
};





