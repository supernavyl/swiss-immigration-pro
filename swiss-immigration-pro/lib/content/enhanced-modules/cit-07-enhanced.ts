// Enhanced Module: CIT-07 - Interview Preparation
// Based on naturalization interview requirements, cantonal assessment procedures
// Sample questions derived from published cantonal citizenship test banks and interview guides

export const cit07Enhanced = {
  id: 'cit-07-enhanced',
  title: 'Naturalization Interview Preparation',
  description: 'Master naturalization interview preparation with 30+ real sample questions by category (Swiss history, politics, geography, culture, daily life), model answers, canton-specific variations, scoring criteria, and a 6-week preparation plan. Covers interview formats across German, French, and Italian-speaking cantons, assessment areas, and proven techniques for confident performance.',
  estimatedReadTime: '90-120 minutes',
  lastUpdated: 'February 2026',
  sections: [
    {
      id: 'interview-overview',
      title: 'Understanding Naturalization Interviews',
      content: `## Interview Preparation: Ace Your Naturalization Interview

The naturalization interview is your chance to demonstrate that you are genuinely integrated into Swiss society. It is conducted by cantonal or communal authorities and covers five assessment areas. Your performance directly determines whether your application advances — there is no separate appeals process for a poor interview.

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 2rem 0;">
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">30-90</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Minutes Duration</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">5</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Assessment Areas</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">B1-B2</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Oral Language Level</div>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
    <div style="font-size: 2rem; font-weight: 700; color: #1e40af;">~85%</div>
    <div style="font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem;">Pass Rate (Well-Prepared)</div>
  </div>
</div>

### The Five Assessment Areas

Every naturalization interview assesses these five dimensions, though the weighting varies by canton:

**1. Language Proficiency (oral assessment)**
The interviewers assess whether you can hold a natural conversation in the local language at B1-B2 level. This is not a formal language test — they observe your fluency, comprehension, vocabulary range, and ability to express opinions throughout the interview.

**2. Integration into Swiss Society**
Can you demonstrate meaningful social connections? They look for: employment stability, community involvement (Vereine, volunteer work), social relationships with Swiss citizens, knowledge of local customs, and respect for Swiss values (federalism, direct democracy, rule of law).

**3. Knowledge of Switzerland**
Questions on Swiss history, political system, geography, and culture. You do not need encyclopedic knowledge, but you should know the basics: federal structure, direct democracy instruments, major historical events, cantonal and communal governance.

**4. Familiarity with Local Living Conditions**
Do you know your commune and canton? They may ask about local schools, public transport, recycling rules, healthcare system, shopping hours, or neighbourhood events. This tests whether you truly *live* in Switzerland, not just reside there.

**5. Personal Motivation and Suitability**
Why do you want to become Swiss? What does Swiss citizenship mean to you? They assess your sincerity, long-term commitment, and understanding of the rights and obligations that come with citizenship.

### Interview Formats by Canton Type

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
  <div style="background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.75rem;">
    <h4 style="font-size: 1.25rem; font-weight: 700; color: #000000; margin-bottom: 1rem; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem;">Commission Interview</h4>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="padding: 0.5rem 0; color: #000000; border-bottom: 1px solid rgba(0,0,0,0.1);"><span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">&#10003;</span>Panel of 3-7 commission members</li>
      <li style="padding: 0.5rem 0; color: #000000; border-bottom: 1px solid rgba(0,0,0,0.1);"><span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">&#10003;</span>Formal setting (town hall / Gemeindehaus)</li>
      <li style="padding: 0.5rem 0; color: #000000; border-bottom: 1px solid rgba(0,0,0,0.1);"><span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">&#10003;</span>Structured question rotation</li>
      <li style="padding: 0.5rem 0; color: #000000;"><span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">&#10003;</span>Common in: ZH, BE, LU, SG, AG</li>
    </ul>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.75rem;">
    <h4 style="font-size: 1.25rem; font-weight: 700; color: #000000; margin-bottom: 1rem; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem;">Cantonal Officer Interview</h4>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="padding: 0.5rem 0; color: #000000; border-bottom: 1px solid rgba(0,0,0,0.1);"><span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">&#10003;</span>1-2 cantonal officials</li>
      <li style="padding: 0.5rem 0; color: #000000; border-bottom: 1px solid rgba(0,0,0,0.1);"><span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">&#10003;</span>Office setting, conversational tone</li>
      <li style="padding: 0.5rem 0; color: #000000; border-bottom: 1px solid rgba(0,0,0,0.1);"><span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">&#10003;</span>Open-ended discussion</li>
      <li style="padding: 0.5rem 0; color: #000000;"><span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">&#10003;</span>Common in: GE, VD, BS, NE</li>
    </ul>
  </div>
  <div style="background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.75rem;">
    <h4 style="font-size: 1.25rem; font-weight: 700; color: #000000; margin-bottom: 1rem; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem;">Written + Oral Combined</h4>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="padding: 0.5rem 0; color: #000000; border-bottom: 1px solid rgba(0,0,0,0.1);"><span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">&#10003;</span>Written test (30-60 min) first</li>
      <li style="padding: 0.5rem 0; color: #000000; border-bottom: 1px solid rgba(0,0,0,0.1);"><span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">&#10003;</span>Oral interview follows</li>
      <li style="padding: 0.5rem 0; color: #000000; border-bottom: 1px solid rgba(0,0,0,0.1);"><span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">&#10003;</span>Multiple-choice + open questions</li>
      <li style="padding: 0.5rem 0; color: #000000;"><span style="color: #3b82f6; font-weight: 700; margin-right: 0.5rem;">&#10003;</span>Common in: AG, TG, some ZH communes</li>
    </ul>
  </div>
</div>`,
      keyPoints: [
        'Five assessment areas: language, integration, Swiss knowledge, local familiarity, personal motivation',
        'Interview duration: 30-90 minutes depending on canton and format',
        'Three main formats: commission panel, cantonal officer 1-on-1, or written + oral combined',
        'Well-prepared candidates have approximately 85% pass rate; unprepared candidates face significant rejection risk',
        'Language assessed informally throughout — natural conversation, not a formal test'
      ],
      legalReferences: [
        'LN Art. 12 (Integration criteria)',
        'LN Art. 14-15 (Cantonal and communal examination procedure)',
        'OLN Art. 4 (Integration assessment framework)',
        'OLN Art. 6 (Language requirements — B1 oral, A2 written minimum)'
      ],
      officialLinks: [
        { title: 'SEM - Naturalization Requirements', url: 'https://www.sem.admin.ch/sem/en/home/themen/buergerrecht/einbuergerung.html' },
        { title: 'fide - Language Assessment', url: 'https://www.fide-info.ch' },
        { title: 'ch.ch - Becoming Swiss', url: 'https://www.ch.ch/en/becoming-swiss/' }
      ],
      subsections: [
        {
          id: 'sample-questions-politics',
          title: 'Sample Questions: Swiss Politics & Government',
          content: `## Sample Questions: Swiss Politics & Government (10 Questions)

These questions reflect the type and difficulty level asked in naturalization interviews across Switzerland. Practice answering them aloud in your local language.

### Q1: What is direct democracy and how does Switzerland practice it?
**Model answer:** Direct democracy means citizens can directly influence legislation. In Switzerland, we have three main instruments: the popular initiative (Volksinitiative) — 100,000 signatures to propose a constitutional amendment; the optional referendum (fakultatives Referendum) — 50,000 signatures within 100 days to challenge a new law; and the obligatory referendum (obligatorisches Referendum) — automatic vote on constitutional changes.

### Q2: Name the seven members of the Federal Council (Bundesrat).
**Model answer:** As of 2025/2026, the Federal Council consists of: Viola Amherd (Die Mitte, President 2024), Guy Parmelin (SVP), Ignazio Cassis (FDP), Karin Keller-Sutter (FDP), Albert Roesti (SVP), Elisabeth Baume-Schneider (SP), and Beat Jans (SP). *Note: The exact composition may change — always check the current year's list.*

### Q3: How many cantons does Switzerland have, and what is the role of cantons?
**Model answer:** Switzerland has 26 cantons. Each canton has its own constitution, parliament, government, and courts. Cantons are responsible for education, healthcare, police, and many other areas under the principle of subsidiarity — matters are handled at the lowest possible level of government.

### Q4: What are the two chambers of the Swiss parliament?
**Model answer:** The National Council (Nationalrat) with 200 seats, representing the people proportionally, and the Council of States (Staenderat) with 46 seats, representing the cantons with 2 members each (half-cantons: 1). Together they form the Federal Assembly (Bundesversammlung).

### Q5: What is the Gemeindeversammlung?
**Model answer:** The Gemeindeversammlung is the communal assembly where citizens of a commune gather to vote on local matters like the budget, building projects, and communal regulations. It is direct democracy at the most local level. In larger cities, an elected Gemeinderat (communal parliament) replaces it.

### Q6: Name the four national languages of Switzerland.
**Model answer:** German (spoken by about 63% of the population), French (about 23%), Italian (about 8%), and Romansh (about 0.5%). The language regions correspond roughly to: German-speaking — central, eastern, and northern Switzerland; French-speaking — western Switzerland (Romandie); Italian-speaking — Ticino and parts of Graubuenden; Romansh — parts of Graubuenden.

### Q7: What is the difference between a Volksinitiative and a Referendum?
**Model answer:** A Volksinitiative proposes a *new* constitutional amendment and requires 100,000 signatures collected within 18 months. A referendum *challenges* an existing law passed by parliament and requires 50,000 signatures within 100 days. An initiative is proactive; a referendum is reactive.

### Q8: What is neutrality and why is it important to Switzerland?
**Model answer:** Swiss neutrality means Switzerland does not participate in armed conflicts between other states. It has been a cornerstone of Swiss foreign policy since the Congress of Vienna in 1815. Neutrality allows Switzerland to serve as a mediating country (hosting the UN, ICRC, and many international negotiations) and has contributed to its stability and prosperity.

### Q9: Who is the head of state in Switzerland?
**Model answer:** The Federal Council as a collective body is the head of state. The President of the Confederation (Bundespraesident/in) rotates annually among the seven Federal Council members and is "first among equals" — not a separate role with executive power like a US president.

### Q10: What are the major political parties in Switzerland?
**Model answer:** The four largest parties are: SVP/UDC (Swiss People's Party — conservative, largest party), SP/PS (Social Democrats — centre-left), FDP/PLR (Free Democrats — liberal), and Die Mitte/Le Centre (The Centre — centrist, formed from CVP+BDP merger in 2021). Other notable parties: Gruene/Verts (Greens), GLP/PVL (Green Liberals).`,
          keyPoints: [
            'Direct democracy instruments: initiative (100,000 signatures), optional referendum (50,000), obligatory referendum',
            'Know current Federal Council members by name and party — updated yearly',
            '26 cantons with significant autonomy (education, police, healthcare)',
            'Two parliamentary chambers: National Council (200 seats) + Council of States (46 seats)',
            'Swiss neutrality since 1815 Congress of Vienna — foundation of foreign policy'
          ]
        },
        {
          id: 'sample-questions-history-geography',
          title: 'Sample Questions: Swiss History & Geography',
          content: `## Sample Questions: History & Geography (10 Questions)

### Q11: When was modern Switzerland founded?
**Model answer:** The modern Swiss federal state was founded in 1848, when the Federal Constitution was adopted after the Sonderbund War of 1847. However, the origins of Switzerland go back to the Federal Charter of 1291 (Bundesbrief), when the three original cantons — Uri, Schwyz, and Unterwalden — formed an alliance.

### Q12: What is the significance of August 1st?
**Model answer:** August 1st is Swiss National Day, celebrating the Federal Charter of 1291. It is a public holiday marked by official speeches, bonfires (Hoehenfeuern), fireworks, and community celebrations. It has been an official public holiday since 1994.

### Q13: Name the largest cities in Switzerland.
**Model answer:** Zurich (approximately 440,000 inhabitants, largest city), Geneva (~205,000), Basel (~180,000), Lausanne (~145,000), and Bern (~135,000). Bern is the federal capital (Bundesstadt), though Switzerland has no official capital.

### Q14: What are the major rivers and lakes?
**Model answer:** Major rivers: Rhine (longest, flows north to the North Sea), Rhone (flows west to the Mediterranean), Aare (tributary of Rhine, flows through Bern), and Inn (flows to the Danube). Major lakes: Lake Geneva (Lac Leman — largest), Lake Zurich, Lake Lucerne (Vierwaldstaettersee), Lake Neuchatel, and Lake Constance (Bodensee, shared with Germany/Austria).

### Q15: What happened during Switzerland's role in World War II?
**Model answer:** Switzerland maintained armed neutrality during WWII. It mobilized its army under General Henri Guisan and prepared the "Reduit" — a fortress strategy to retreat to the Alps if invaded. Switzerland was not invaded but its neutrality has been debated — it accepted refugees but also turned some away, and Swiss banks later faced scrutiny over dormant accounts of Holocaust victims.

### Q16: What is the Gotthard Pass and why is it historically important?
**Model answer:** The Gotthard Pass (2,106 m) connects the German-speaking north with the Italian-speaking south of Switzerland. Historically, it was a crucial trade route between Northern Europe and Italy. Control over this pass was a key reason for the formation of the Old Swiss Confederacy. The Gotthard Base Tunnel (opened 2016, 57 km) is now the world's longest railway tunnel.

### Q17: What are the three major geographical regions of Switzerland?
**Model answer:** The Jura (northwestern mountain range, ~10% of territory), the Mittelland/Plateau (central lowland between Jura and Alps, ~30% of territory, where most of the population lives), and the Alps (~60% of territory, covering the south and east). The highest point is the Dufourspitze at 4,634 m.

### Q18: What is the Red Cross and what is its connection to Switzerland?
**Model answer:** The International Committee of the Red Cross (ICRC) was founded in Geneva in 1863 by Henry Dunant. Its emblem (red cross on white background) is the inverse of the Swiss flag. The ICRC is mandated by the Geneva Conventions to protect victims of armed conflicts. It remains headquartered in Geneva and is a symbol of Swiss humanitarian tradition.

### Q19: What was the Sonderbund War?
**Model answer:** The Sonderbund War of 1847 was a brief civil war (lasting about 25 days) between the conservative, Catholic cantons (Sonderbund: LU, UR, SZ, OW, NW, ZG, FR, VS) and the liberal, Protestant cantons. The liberal side won, leading directly to the 1848 Federal Constitution, which transformed Switzerland from a loose confederation into a modern federal state.

### Q20: Name three UNESCO World Heritage Sites in Switzerland.
**Model answer:** Examples include: the Old City of Bern, the Jungfrau-Aletsch-Bietschhorn region (Alps), the three castles of Bellinzona, the Lavaux vineyard terraces (Lake Geneva), the Swiss Tectonic Arena Sardona, and La Chaux-de-Fonds/Le Locle (watchmaking towns). Switzerland has 13 UNESCO sites in total.`,
          keyPoints: [
            '1291 Federal Charter (origin), 1848 Federal Constitution (modern state), 1994 August 1st became official holiday',
            'Three geographical regions: Jura (10%), Mittelland (30%), Alps (60%); highest point Dufourspitze 4,634 m',
            'WWII: armed neutrality, General Guisan, Reduit strategy, controversial refugee and banking policies',
            'Red Cross founded in Geneva 1863 by Henry Dunant — emblem is inverse of Swiss flag',
            'Key landmarks: Gotthard Pass/Tunnel, Rhine/Rhone rivers, Lake Geneva (largest lake)'
          ]
        },
        {
          id: 'sample-questions-daily-life',
          title: 'Sample Questions: Daily Life & Culture',
          content: `## Sample Questions: Daily Life, Culture & Local Knowledge (10+ Questions)

### Q21: How does the Swiss healthcare system work?
**Model answer:** Switzerland has mandatory health insurance (Krankenversicherung / assurance maladie). Every resident must have basic insurance (Grundversicherung) from a private insurer. You choose your own insurer and can switch annually (deadline: November 30). Basic insurance covers doctor visits, hospital stays, medications, and some therapies. You pay monthly premiums (CHF 300-600/month depending on model and canton), an annual deductible (Franchise: CHF 300-2,500), and 10% co-pay (Selbstbehalt, max CHF 700/year).

### Q22: How does recycling work in Switzerland?
**Model answer:** Switzerland has one of the highest recycling rates in the world (~53%). Regular household waste requires special taxed bags (Gebuehrensaecke) in most cantons. Separately collected for free: paper/cardboard (monthly collection), glass (containers at collection points, sorted by colour), PET bottles (at supermarkets), aluminium cans, batteries (at shops), organic waste (green bin in many communes), and textiles. Bulky items go to the Entsorgungshof (waste disposal centre).

### Q23: What are the Ruhezeiten (quiet hours)?
**Model answer:** Quiet hours (Ruhezeiten / heures de repos) vary slightly by commune but generally: weekday evenings from 22:00-07:00, Saturday afternoons from 12:00-13:00 (in some areas), Sundays and public holidays all day. During quiet hours, you should avoid noisy activities like drilling, loud music, laundry machines, and mowing the lawn. Specific rules are set by communal police regulations (Polizeiverordnung).

### Q24: Describe the Swiss school system.
**Model answer:** Education is primarily a cantonal responsibility. Children attend: Kindergarten (age 4-6, 2 years, mandatory since 2009 in most cantons), Primarschule (age 6-12, 6 years), and Sekundarschule (age 12-15, 3 years, with different performance levels). After Sekundarschule, paths split: Gymnasium (academic, leading to university Matura), Berufslehre (apprenticeship, the most common path — about 2/3 of students), or Fachmittelschule. The dual apprenticeship system (combining work and school) is a unique strength of the Swiss system.

### Q25: What are your rights and duties as a Swiss citizen?
**Model answer:** Rights: voting and participating in direct democracy (initiatives, referendums), standing for public office, Swiss passport and consular protection, unrestricted work and residence, and access to social security. Duties: respecting the law and Constitution, military service for men (or civil service alternative, or exemption tax of CHF 3,000+/year until age 30 if not serving), paying taxes, and participating in civic life.

### Q26: How does public transport work in Switzerland?
**Model answer:** Switzerland has an excellent integrated public transport network. SBB/CFF/FFS (Swiss Federal Railways) runs national rail. Local transport (trams, buses) is run by regional companies (ZVV in Zurich, TPG in Geneva, etc.). The GA/AG (Generalabonnement) gives unlimited travel nationwide. The Halbtax (half-fare card, CHF 185/year) gives 50% off all tickets and is used by about 3 million people. Timetables are coordinated for seamless connections (Taktfahrplan).

### Q27: What is special about Swiss chocolate and cheese?
**Model answer:** Switzerland is famous for its chocolate tradition (brands like Lindt, Toblerone, Cailler) dating back to the 19th century, when innovations like milk chocolate (Daniel Peter, 1875) and conching (Rodolphe Lindt, 1879) were invented. Swiss cheese varieties include Emmentaler (with holes), Gruyere (hard, from Fribourg), Appenzeller, Raclette, Sbrinz, and Tete de Moine. Cheese production follows AOC/AOP protected designations.

### Q28: Name important Swiss holidays and traditions.
**Model answer:** Key holidays: New Year (Jan 1), Berchtoldstag (Jan 2, some cantons), Easter (Karfreitag + Ostermontag), Auffahrt (Ascension), Pfingsten (Whit Monday), August 1st (National Day), and Christmas (Dec 25-26). Regional traditions: Fasnacht (Carnival — especially Basel, Lucerne), Sechselaeuten (Zurich, burning the Boeoegg), Escalade (Geneva), Fete des Vignerons (Vevey, once per generation), and Alpabzug/Desalpe (bringing cattle down from Alpine pastures in autumn).

### Q29: What do you know about your own commune?
**Guidance:** This is a personal question — you must know YOUR specific commune. Be ready to answer:
- Name of the Gemeindepraesident/in or Syndic
- Population of your commune
- Local schools and where your children (if any) attend
- Public transport connections
- Local Vereine (clubs/associations)
- Recycling schedule and collection points
- Recent communal decisions or projects

### Q30: Why do you want to become Swiss?
**Guidance:** This is the most personal and important question. Your answer should be genuine, specific, and demonstrate:
- **Emotional connection:** "Switzerland has been my home for X years and I feel deeply connected to..."
- **Concrete examples:** "I have been a member of [local club] since..., my children attend school in..."
- **Forward-looking commitment:** "I want to participate fully in Swiss democracy and contribute to..."
- **Avoid:** purely practical reasons like "for the passport" or "for travel convenience"`,
          keyPoints: [
            'Healthcare: mandatory private insurance, CHF 300-600/month premiums, annual Franchise CHF 300-2,500',
            'Recycling: taxed waste bags (Gebuehrensaecke), separate free collection for paper/glass/PET/aluminium',
            'Quiet hours (Ruhezeiten): 22:00-07:00 weekdays, Sundays/holidays all day — communal rules vary',
            'Education: cantonal responsibility, ~2/3 of students choose apprenticeship (Berufslehre) path',
            'Know YOUR commune: president name, population, schools, clubs, transport, recycling schedule'
          ]
        },
        {
          id: 'preparation-plan',
          title: '6-Week Interview Preparation Plan',
          content: `## 6-Week Interview Preparation Plan

Follow this structured plan to be fully prepared for your naturalization interview.

### Week 1-2: Foundation Knowledge

<div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.75rem; margin: 1rem 0;">
  <h4 style="font-size: 1.125rem; font-weight: 700; color: #1e40af; margin-bottom: 0.75rem;">Focus: Swiss Political System & History</h4>
  <ul style="margin: 0; padding-left: 1.5rem; line-height: 2;">
    <li>Study the Federal Council (current members, parties, rotation)</li>
    <li>Learn direct democracy: initiative, referendum, Gemeindeversammlung</li>
    <li>Review key historical dates: 1291, 1648, 1815, 1847, 1848, 1971 (women's suffrage), 2002 (UN membership)</li>
    <li>Read ch.ch political explainers in your local language</li>
    <li>Take notes on 26 cantons — at minimum know your own + neighbouring cantons</li>
  </ul>
</div>

### Week 3: Geography & Culture

<div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.75rem; margin: 1rem 0;">
  <h4 style="font-size: 1.125rem; font-weight: 700; color: #1e40af; margin-bottom: 0.75rem;">Focus: Geography, Culture & Traditions</h4>
  <ul style="margin: 0; padding-left: 1.5rem; line-height: 2;">
    <li>Three regions: Jura, Mittelland, Alps — know major features of each</li>
    <li>Major cities, rivers, lakes, and mountains</li>
    <li>Swiss holidays and regional traditions (especially your region's)</li>
    <li>Cultural topics: chocolate, cheese, watches, Red Cross, neutrality, multilingualism</li>
    <li>Study a map of Switzerland — be able to place major cities and cantons</li>
  </ul>
</div>

### Week 4: Daily Life & Local Knowledge

<div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.75rem; margin: 1rem 0;">
  <h4 style="font-size: 1.125rem; font-weight: 700; color: #1e40af; margin-bottom: 0.75rem;">Focus: Practical Knowledge & Your Commune</h4>
  <ul style="margin: 0; padding-left: 1.5rem; line-height: 2;">
    <li>Healthcare system: insurance, Franchise, Grundversicherung</li>
    <li>School system: Kindergarten, Primar, Sekundar, Lehre/Gymnasium</li>
    <li>Recycling rules and quiet hours for YOUR commune</li>
    <li>Public transport: SBB, local operator, GA/Halbtax</li>
    <li>Research your commune: president, population, schools, recent projects, local clubs</li>
  </ul>
</div>

### Week 5: Personal Narrative & Language Practice

<div style="background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%); border: 2px solid #3b82f6; padding: 1.5rem; border-radius: 0.75rem; margin: 1rem 0;">
  <h4 style="font-size: 1.125rem; font-weight: 700; color: #1e40af; margin-bottom: 0.75rem;">Focus: Your Story & Language Fluency</h4>
  <ul style="margin: 0; padding-left: 1.5rem; line-height: 2;">
    <li>Prepare your "Why I want to become Swiss" answer — practice until natural</li>
    <li>Prepare your integration story: timeline, key milestones, community involvement</li>
    <li>Practice all 30 sample questions aloud — time yourself</li>
    <li>Read local newspapers in your national language daily</li>
    <li>Listen to SRF/RTS/RSI news to improve comprehension</li>
  </ul>
</div>

### Week 6: Mock Interviews & Final Review

<div style="background: linear-gradient(135deg, #ffffff 0%, #fef3c7 100%); border: 2px solid #f59e0b; padding: 1.5rem; border-radius: 0.75rem; margin: 1rem 0;">
  <h4 style="font-size: 1.125rem; font-weight: 700; color: #92400e; margin-bottom: 0.75rem;">Focus: Simulation & Confidence Building</h4>
  <ul style="margin: 0; padding-left: 1.5rem; line-height: 2;">
    <li>Conduct 2-3 mock interviews with a Swiss friend or language partner</li>
    <li>Ask them to mix questions from all categories randomly</li>
    <li>Practice in the setting you expect: seated at a table, formal clothing</li>
    <li>Review weak areas identified during mock interviews</li>
    <li>Prepare logistics: know the interview location, arrive 15 minutes early, bring all documents</li>
    <li>Night before: review your personal narrative one final time, then rest</li>
  </ul>
</div>

### Interview Day Tips

- **Dress smartly** — business casual is appropriate. No need for a suit, but look presentable
- **Arrive 15 minutes early** — bring a copy of your application for reference
- **Speak naturally** — do not memorize answers word-for-word; interviewers detect rehearsed responses
- **It is okay to say "I don't know"** — honesty is valued over bluffing. Follow up with "but I would look it up at..."
- **Show enthusiasm** — smile, make eye contact, express genuine interest in Switzerland
- **Ask a question back** — when appropriate, asking "Could you tell me more about [local topic]?" shows engagement`,
          keyPoints: [
            'Week 1-2: Political system, direct democracy, key historical dates',
            'Week 3: Geography (3 regions, rivers, lakes), culture, traditions',
            'Week 4: Daily life systems (healthcare, schools, recycling) and YOUR commune specifics',
            'Week 5: Personal narrative (Why Swiss?), language fluency practice with daily news',
            'Week 6: Mock interviews with a Swiss friend, logistics preparation, confidence building'
          ]
        }
      ]
    }
  ]
}
