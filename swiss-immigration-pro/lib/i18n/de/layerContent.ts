// Deutsche Übersetzungen für Layer-Inhalte — professionelles Hochdeutsch mit Schweizer Konventionen

import type { LayerContent } from '../../layerContent'

export const LAYER_CONTENT_DE: Record<string, LayerContent> = {
  europeans: {
    hero: {
      tagline: 'Ihr Schweizer Traum beginnt hier – wir machen es Ihnen einfach',
      description: 'Als EU/EFTA-Bürger ist der Umzug in die Schweiz einfacher als Sie denken! Keine Kontingente, schnelle Bearbeitung (2–4 Wochen) und ein klar definierter 5-Jahres-Weg zur Einbürgerung. Mit unserer Expertenberatung, bewährten Strategien und lückenloser Begleitung navigieren Sie sicher durch das Verfahren. Tausende haben vor Ihnen erfolgreich den Schritt gewagt – lassen Sie uns Sie auf jedem Teilabschnitt führen. Ihre Schweizer Zukunft ist nur eine Entscheidung entfernt.',
      cta: 'Starten Sie noch heute Ihre unkomplizierte Reise',
      stats: [
        { label: 'Bearbeitungszeit', value: '2–4 Wochen', description: 'Schnellverfahren für EU/EFTA-Bürger – wir helfen Ihnen, alles perfekt vorzubereiten' },
        { label: 'Kontingentbeschränkungen', value: 'Keine', description: 'Vorteile der Personenfreizügigkeit – jederzeit und überall bewerben' },
        { label: 'Einbürgerungsfrist', value: '5 Jahre', description: 'Gegenüber 10 Jahren für Nicht-EU – wir helfen Ihnen, Ihren Fortschritt zu verfolgen' },
        { label: 'Erfolgsquote', value: '95 %+', description: 'Für qualifizierte Antragsteller – und wir helfen Ihnen, sich zu qualifizieren' },
      ],
    },
    visas: {
      title: 'Aufenthaltsoptionen für EU/EFTA-Bürger',
      description: 'Als EU/EFTA-Bürger haben Sie vereinfachten Zugang zu Schweizer Aufenthaltsbewilligungen im Rahmen des Abkommens über die Personenfreizügigkeit (FZA). Offizielle Quellen: SEM, AIG (SR 142.20), VZAE (SR 142.201).',
      types: [
        {
          name: 'Aufenthaltsbewilligung B',
          description: 'Vollständige Aufenthaltsbewilligung für EU/EFTA-Bürger mit Arbeitsvertrag oder selbständiger Erwerbstätigkeit. Geregelt durch das Freizügigkeitsabkommen (FZA) und das Ausländer- und Integrationsgesetz (AIG, SR 142.20). Rechtsgrundlage: AIG Art. 25, VZAE Art. 15. Offizielle Quelle: [SEM-Weisungen](https://www.sem.admin.ch/sem/de/home/themen/arbeit/eu_efta-angehoerige.html)',
          timeline: '2–4 Wochen',
          requirements: [
            'Gültiger Arbeitsvertrag oder Nachweis selbständiger Erwerbstätigkeit (FZA Art. 7, AIG Art. 25)',
            'Krankenversicherungsschutz (obligatorisch gemäss AIG Art. 27 Abs. 1)',
            'Nachweis finanzieller Mittel (bei Selbständigkeit, VZAE Art. 15 Abs. 2)',
            'Anmeldung bei der Wohngemeinde innerhalb von 14 Tagen nach Einreise (AIG Art. 27 Abs. 2)',
            'Keine Vorstrafen (Überprüfung möglich gemäss AIG Art. 28)',
          ],
          applicable: true,
        },
        {
          name: 'Kurzaufenthaltsbewilligung L',
          description: 'Befristete Bewilligung für EU/EFTA-Bürger für Beschäftigungen bis zu 12 Monaten. Verlängerbar gemäss FZA-Bestimmungen. Rechtsgrundlage: AIG Art. 24, VZAE Art. 10. Offizielle Quelle: [SEM – Kurzaufenthaltsbewilligungen](https://www.sem.admin.ch/sem/de/home/themen/arbeit/eu_efta-angehoerige.html)',
          timeline: '1–3 Wochen',
          requirements: [
            'Arbeitsvertrag (mindestens 3 Monate, VZAE Art. 10 Abs. 1)',
            'Krankenversicherungsschutz (AIG Art. 27 Abs. 1)',
            'Nachweis einer Unterkunft (VZAE Art. 10 Abs. 2)',
            'Anmeldung bei der Wohngemeinde innerhalb von 14 Tagen (AIG Art. 27 Abs. 2)',
          ],
          applicable: true,
        },
        {
          name: 'Grenzgängerbewilligung G',
          description: 'Für Grenzgänger mit Wohnsitz in einem EU/EFTA-Staat, die in der Schweiz erwerbstätig sind. Geregelt durch FZA und AIG Art. 25. Rechtsgrundlage: AIG Art. 25, VZAE Art. 20. Offizielle Quelle: [SEM – Grenzgänger](https://www.sem.admin.ch/sem/de/home/themen/arbeit/grenzgaenger.html)',
          timeline: '1–2 Wochen',
          requirements: [
            'Wohnsitz in einer Grenzzone (DE/FR/IT/AT/LI) in zumutbarer Entfernung (VZAE Art. 20 Abs. 1)',
            'Arbeitsvertrag in der Schweiz (AIG Art. 25)',
            'Rückkehr an den Wohnort mindestens einmal pro Woche (VZAE Art. 20 Abs. 2)',
            'Krankenversicherung (Schweizer oder EU-Deckung, AIG Art. 27 Abs. 1)',
          ],
          applicable: true,
        },
        {
          name: 'EU Blue Card',
          description: 'Optionale Bewilligung für hochqualifizierte EU-Fachkräfte. In der Schweiz wenig gebräuchlich, da die reguläre Aufenthaltsbewilligung B im Rahmen des FZA unkomplizierter ist. Geregelt durch die EU-Blue-Card-Richtlinie. Offizielle Quelle: [SEM – Hochqualifizierte Arbeitskräfte](https://www.sem.admin.ch/sem/de/home/themen/arbeit.html)',
          timeline: '3–5 Wochen',
          requirements: [
            'Hochschulabschluss oder gleichwertige Qualifikation (mind. 5 Jahre Berufserfahrung gemäss EU-Richtlinie)',
            'Salär über dem kantonalen Schwellenwert (in der Regel CHF 97 000+, VZAE Art. 21)',
            'Qualifizierte Stelle, die den Qualifikationen entspricht (EU-Blue-Card-Richtlinie Art. 5)',
          ],
          applicable: true,
        },
      ],
    },
    process: {
      title: 'Ihr Bewilligungsweg als EU/EFTA-Bürger',
      description: 'Vereinfachtes 5-Schritte-Verfahren für EU/EFTA-Staatsangehörige',
      steps: [
        {
          step: 1,
          title: 'Stellenangebot annehmen oder selbständig tätig werden',
          description: 'Finden Sie eine Stelle oder nehmen Sie eine selbständige Erwerbstätigkeit in der Schweiz auf. Im Rahmen des FZA dürfen EU/EFTA-Bürger bis zu 3 Monate ohne Bewilligung Arbeit suchen.',
          timeline: 'Individuell',
        },
        {
          step: 2,
          title: 'Bei der Wohngemeinde anmelden',
          description: 'Melden Sie Ihren Wohnsitz innerhalb von 14 Tagen nach Einreise an (AIG Art. 27). Mitzubringen: Pass, Arbeitsvertrag und Wohnungsnachweis.',
          timeline: '1 Tag',
        },
        {
          step: 3,
          title: 'Bewilligung über die Gemeinde beantragen',
          description: 'Die Gemeinde leitet Ihr Gesuch an das kantonale Migrationsamt weiter. Für EU/EFTA-Bürger läuft das Verfahren im Rahmen des FZA vereinfacht ab.',
          timeline: '1 Woche',
        },
        {
          step: 4,
          title: 'Bewilligung erhalten',
          description: 'Erhalten Sie Ihre Aufenthaltsbewilligung B oder Kurzaufenthaltsbewilligung L. Die Bearbeitungsdauer beträgt für EU/EFTA-Bürger in der Regel 2–4 Wochen (gegenüber 8–12 Wochen für Nicht-EU-Bürger).',
          timeline: '2–4 Wochen',
        },
        {
          step: 5,
          title: 'Weg zur Einbürgerung',
          description: 'Nach 5 Jahren ununterbrochenen Aufenthalts mit Aufenthaltsbewilligung B können Sie ein Einbürgerungsgesuch stellen (gegenüber 10 Jahren für Nicht-EU-Bürger). Rechtsgrundlage: Bürgerrechtsgesetz (BüG, SR 141.0) Art. 15 Abs. 1. Offizielle Quelle: [SEM – Einbürgerung](https://www.sem.admin.ch/sem/de/home/themen/buergerrecht.html)',
          timeline: '5 Jahre',
        },
      ],
    },
    tools: {
      title: 'Spezifische Tools für EU/EFTA-Bürger',
      description: 'Spezialisierte Hilfsmittel für EU/EFTA-Staatsangehörige',
      items: [
        {
          name: 'Bewilligungsrechner',
          description: 'Berechnen Sie Ihre Chancen auf eine Schweizer Arbeitsbewilligung',
          icon: 'calculator',
          link: '/tools/permit-calculator',
        },
        {
          name: 'Zeitplanung',
          description: 'Planen Sie Ihren Immigrationsweg mit individuellen Meilensteinen',
          icon: 'calendar',
          link: '/tools/timeline-planner',
        },
        {
          name: 'Grenzgänger-Rechner',
          description: 'Prüfen Sie, ob eine Grenzgängertätigkeit für Sie vorteilhaft ist',
          icon: 'calculator',
        },
        {
          name: 'EU Blue Card – Prüfung der Eignung',
          description: 'Vergleichen Sie, ob die EU Blue Card gegenüber der regulären Aufenthaltsbewilligung B Vorteile bietet',
          icon: 'card',
        },
        {
          name: 'Leitfaden für den Familiennachzug',
          description: 'Vereinfachtes Verfahren, um Familienangehörige in die Schweiz zu holen',
          icon: 'family',
        },
        {
          name: '5-Jahres-Einbürgerungsplaner',
          description: 'Verfolgen Sie Ihren Fortschritt in Richtung Schweizer Bürgerrecht',
          icon: 'calendar',
        },
      ],
    },
    resources: {
      title: 'Ressourcen für EU/EFTA-Bürger',
      description: 'Sorgfältig ausgewählte Inhalte für europäische Staatsangehörige mit offiziellen Rechtsnachweisen',
      posts: [
        {
          title: 'Grenzgängerbewilligung G: Die beste Wahl für Grenzgänger',
          excerpt: 'Warum es die klügste Entscheidung sein kann, im Heimatland zu wohnen und in der Schweiz zu arbeiten. Rechtsgrundlage: FZA und AIG Art. 25.',
          category: 'Bewilligungen',
          content: `# Grenzgängerbewilligung G: Die kluge Wahl für Grenzgänger

## Warum die Grenzgängerbewilligung?

Die Grenzgängerbewilligung G ermöglicht es Ihnen, in Ihrem EU/EFTA-Heimatstaat zu wohnen und gleichzeitig in der Schweiz zu arbeiten. Diese Regelung bietet mehrere Vorteile:

### Wesentliche Vorteile:
- **Steuerliche Aspekte**: Steuerpflicht in der Regel nur im Wohnsitzstaat (häufig günstigere Steuersätze)
- **Wohnkosten**: Günstigere Unterkunft im EU-Ausland
- **Familienleben**: Gewohntes soziales Umfeld und bestehende Netzwerke erhalten
- **Geringere Integrationsanforderungen**: Weniger strenge Sprachanforderungen

## Anspruchsvoraussetzungen

Um die Grenzgängerbewilligung G zu erhalten, müssen Sie:
- In einem EU/EFTA-Staat in zumutbarer Entfernung wohnen (in der Regel 30–60 km)
- In der Schweiz erwerbstätig sein
- Mindestens einmal pro Woche an Ihren Wohnsitz zurückkehren
- Einen gültigen Arbeitsvertrag vorweisen

## Antragsverfahren

1. **Stelle finden**: Erhalten Sie ein Stellenangebot von einem Schweizer Arbeitgeber
2. **Anmeldung**: Antrag über das kantonale Migrationsamt des Arbeitskantons
3. **Unterlagen**: Einreichen von Pass, Arbeitsvertrag und Wohnsitznachweis
4. **Bearbeitung**: In der Regel 1–2 Wochen gemäss FZA-Bestimmungen

## Rechtliche Grundlagen
- **FZA**: Regelt die Rechte von Grenzgängern
- **AIG Art. 25**: Bewilligung für Grenzgänger
- **VZAE Art. 20**: Spezifische Anforderungen für Grenzgängerbewilligungen

**Offizielle Quelle**: [SEM – Grenzgänger](https://www.sem.admin.ch/sem/de/home/themen/arbeit/grenzgaenger.html)`,
        },
        {
          title: 'EU Blue Card vs. Aufenthaltsbewilligung B: Was ist besser?',
          excerpt: 'Vergleich beider Optionen für hochqualifizierte EU-Fachkräfte. Die meisten EU-Bürger entscheiden sich für die Aufenthaltsbewilligung B, da das Verfahren unkomplizierter ist.',
          category: 'Vergleich',
          content: `# EU Blue Card vs. Aufenthaltsbewilligung B: Die richtige Wahl treffen

## Die EU Blue Card in der Schweiz

Die EU Blue Card ist eine optionale Bewilligung für hochqualifizierte Arbeitskräfte aus Drittstaaten, wird von EU/EFTA-Bürgern jedoch kaum genutzt, da die regulären Bewilligungen einfacher zu erlangen sind.

### Wann die EU Blue Card sinnvoll sein kann:
- **Internationale Mobilität**: Bei geplanter Tätigkeit in mehreren EU-Ländern
- **Sehr hohes Gehalt**: Jahresgehalt von CHF 120 000 und mehr

## Warum die meisten EU-Bürger die Aufenthaltsbewilligung B wählen

### Vorteile der Aufenthaltsbewilligung B:
- **Einfacheres Verfahren**: Keine zusätzlichen Anforderungen über die Standard-Aufenthaltsbewilligung B hinaus
- **Schnellere Bearbeitung**: Gleiche Bearbeitungsdauer von 2–4 Wochen wie bei anderen EU-Bewilligungen
- **Kein Mindestgehalt**: Flexiblere Gehaltsanforderungen
- **Familienvorteile**: Vereinfachter Familiennachzug

## Vergleichstabelle

| Merkmal | EU Blue Card | Aufenthaltsbewilligung B (Standard) |
|---------|-------------|--------------------------------------|
| Bearbeitungszeit | 3–5 Wochen | 2–4 Wochen |
| Gehaltschwelle | CHF 97 000+ | Kein Minimum (marktüblicher Lohn) |
| Unterlagen | Aufwändiger | Standard EU-Verfahren |
| Mobilität | EU-weit | Schwerpunkt Schweiz |
| Familienrechte | EU-weit | Schweizer Aufenthaltsrechte |

## Empfehlung

**Für die meisten EU/EFTA-Bürger**: Wählen Sie die reguläre Aufenthaltsbewilligung B. Das Verfahren ist einfacher, schneller und bietet langfristig dieselben Vorteile.

**Offizielle Quellen**:
- [SEM – Hochqualifizierte Arbeitskräfte](https://www.sem.admin.ch/sem/de/home/themen/arbeit.html)
- EU-Blue-Card-Richtlinie (umgesetzt im Schweizer Recht über VZAE Art. 21)`,
        },
        {
          title: 'Einbürgerung nach 5 Jahren: Alles, was Sie wissen müssen',
          excerpt: 'Umfassender Leitfaden zur beschleunigten Einbürgerung für EU/EFTA-Bürger. Rechtsgrundlage: Bürgerrechtsgesetz (BüG, SR 141.0).',
          category: 'Einbürgerung',
          content: `# Beschleunigte Einbürgerung: 5 Jahre für EU/EFTA-Bürger

## Ihre Einbürgerungsfrist

Als EU/EFTA-Bürger können Sie nach **5 Jahren** ununterbrochenen Aufenthalts in der Schweiz ein Einbürgerungsgesuch stellen – gegenüber 10 Jahren für Bürger aus Drittstaaten.

## Wichtigste Voraussetzungen

### Aufenthaltsanforderungen:
- **5 Jahre ununterbrochener Aufenthalt** in der Schweiz (BüG Art. 9)
- **1 Jahr** im Kanton, in dem das Gesuch gestellt wird (BüG Art. 10)
- **3 Monate** in der Gemeinde, in der das Gesuch gestellt wird (BüG Art. 11)

### Integrationsanforderungen:
- **Sprachkenntnisse**: Niveau A2 in der lokalen Amtssprache (Deutsch/Französisch/Italienisch/Rätoromanisch)
- **Kenntnisse über die Schweiz**: Bestehen des Einbürgerungstests zu Geschichte, Geographie und staatlichen Institutionen
- **Soziale Integration**: Nachweis einer gelungenen Integration (Erwerbstätigkeit, kein Strafregisterauszug)

### Weitere Voraussetzungen:
- **Strafregister**: Keine schwerwiegenden Verurteilungen
- **Finanzielle Unabhängigkeit**: Keine Sozialhilfeabhängigkeit
- **Erwerbstätigkeit**: Stabile Arbeitsstelle oder selbständige Erwerbstätigkeit

## Antragsverfahren

1. **Unterlagen zusammenstellen**: Aufenthaltsbewilligung, Sprachzertifikate, Erwerbsnachweis
2. **Integrationskurs absolvieren**: Den vorgeschriebenen Integrationskurs besuchen
3. **Gemeindegesuch einreichen**: Antrag bei der zuständigen Wohngemeinde stellen
4. **Kantonale Prüfung**: Die Kantonsebene prüft das Gesuch
5. **Bundesentscheid**: Das Staatssekretariat für Migration (SEM) fällt den abschliessenden Entscheid
6. **Einbürgerungsfeier**: Teilnahme an der Einbürgerungsfeier

## Fristen und Kosten

- **Bearbeitungsdauer**: 12–18 Monate
- **Gesuchsgebühr**: CHF 200–500 (je nach Kanton)
- **Sprachtest**: CHF 100–200
- **Integrationskurs**: CHF 200–400

## Vorteile des Schweizer Bürgerrechts

- **Vollständige politische Rechte**: Stimm- und Wahlrecht auf Bundes-, Kantons- und Gemeindeebene
- **EU-Bürgerschaft**: Automatisch mit allen EU-Rechten verbunden
- **Kein Bewilligungsablauf**: Permanentes Aufenthaltsrecht
- **Familienvorteile**: Einfacherer Familiennachzug auch für erweiterte Familienangehörige

**Offizielle Quelle**: [SEM – Einbürgerung](https://www.sem.admin.ch/sem/de/home/themen/buergerrecht.html)
**Rechtsgrundlage**: Bürgerrechtsgesetz (BüG, SR 141.0)`,
        },
        {
          title: 'Familiennachzug leicht gemacht',
          excerpt: 'So holen Sie Ihren Ehepartner und Ihre Kinder als EU/EFTA-Bürger im Rahmen des FZA-Familiennachzugs in die Schweiz.',
          category: 'Familie',
          content: `# Familiennachzug für EU/EFTA-Bürger

## Ihre Familienrechte im Rahmen des FZA

Als EU/EFTA-Bürger mit Schweizer Aufenthaltsbewilligung haben Ihr Ehepartner und Ihre Kinder das **Recht, Ihnen zu folgen** – gestützt auf das Freizügigkeitsabkommen (FZA).

## Wer hat Anspruch auf Familiennachzug?

### Kernfamilie:
- **Ehepartner/eingetragene Partnerschaft**: Automatisches Nachzugsrecht
- **Minderjährige Kinder**: Unter 18 Jahren
- **Unterhaltsberechtigte Kinder**: Über 18 Jahre, aber finanziell abhängig

### Erweiterte Familie:
- **Eltern**: Können nachziehen, wenn Sie Pflege übernehmen (Einzelfallprüfung)
- **Volljährige Kinder**: Müssen in der Regel selbst für den Lebensunterhalt aufkommen

## Antragsverfahren

### Für den Ehepartner:
1. **Wohnungsnachweis sicherstellen**: Nachweis über angemessene Unterkunft
2. **Krankenversicherung**: Deckung für die gesamte Familie
3. **Erwerbstätigkeit**: Ehepartner darf sofort arbeiten (keine separate Bewilligung erforderlich)
4. **Anmeldung**: Antrag über das kantonale Migrationsamt

### Für Kinder:
1. **Geburtsurkunde**: Amtliche Dokumente
2. **Schulanmeldung**: Für schulpflichtige Kinder
3. **Ärztliches Attest**: Gesundheitszeugnis falls erforderlich
4. **Sorgerechtsdokumente**: Falls zutreffend

## Fristen und Rechte

- **Bearbeitungsdauer**: 2–4 Wochen für EU/EFTA-Familien
- **Arbeitsrecht**: Ehepartner darf sofort arbeiten
- **Aufenthaltsrecht**: Vollständige Aufenthaltsrechte ab dem ersten Tag
- **Sozialleistungen**: Zugang zu Schweizer Sozialleistungen

## Wesentliche Vorteile für EU-Familien

- **Keine Kontingente**: Familiennachzug unterliegt keinen Kontingentbeschränkungen
- **Rasche Bearbeitung**: Vereinfachtes Verfahren im Rahmen des FZA
- **Volle Rechte**: Dieselben Rechte wie Sie ab dem ersten Tag
- **Einbürgerungsweg**: Familienangehörige profitieren von Ihrer Einbürgerungsfrist

## Rechtliche Grundlagen

- **FZA Art. 3**: Rechte beim Familiennachzug
- **AIG Art. 42–44**: Familiennachzug für ausländische Staatsangehörige
- **VZAE Art. 39–42**: Durchführung des Familiennachzugs

**Offizielle Quelle**: [SEM – Familiennachzug](https://www.sem.admin.ch/sem/de/home/themen/familie.html)`,
        },
        {
          title: 'Offizielle Rechtsquellen im Überblick',
          excerpt: 'Massgebliche Gesetze: Ausländer- und Integrationsgesetz (AIG, SR 142.20), FZA, Verordnung VZAE (SR 142.201). Abrufbar über fedlex.admin.ch',
          category: 'Recht',
          content: `# Wichtigstes Rechtsrahmen für EU/EFTA-Bürger

## Massgebliche Gesetzgebung

### 1. Abkommen über die Personenfreizügigkeit (FZA)
- **SR-Nummer**: 0.142.112.681
- **Zweck**: Regelt die Freizügigkeit und Erwerbstätigkeit von EU/EFTA-Bürgern
- **Schlüsselartikel**:
  - Art. 1–2: Persönlicher Geltungsbereich und Begriffe
  - Art. 7: Erwerbsrechte
  - Art. 3: Familiennachzug
  - Art. 9: Koordinierung der sozialen Sicherheit

### 2. Ausländer- und Integrationsgesetz (AIG)
- **SR-Nummer**: 142.20
- **Zweck**: Hauptgesetz für ausländische Staatsangehörige in der Schweiz
- **Schlüsselartikel für EU-Bürger**:
  - Art. 2: Geltungsbereich (EU/EFTA von bestimmten Einschränkungen ausgenommen)
  - Art. 24–25: Kurzaufenthaltsbewilligung L und Aufenthaltsbewilligung B für EU-Bürger
  - Art. 27: Anmeldepflicht
  - Art. 42–44: Familiennachzug

### 3. Verordnung über Zulassung, Aufenthalt und Erwerbstätigkeit (VZAE)
- **SR-Nummer**: 142.201
- **Zweck**: Vollzug der AIG-Bestimmungen
- **Schlüsselartikel**:
  - Art. 10: Kurzaufenthaltsbewilligung L für EU-Bürger
  - Art. 15: Aufenthaltsbewilligung B für EU-Bürger
  - Art. 20: Grenzgängerbewilligung G
  - Art. 39–42: Verfahren beim Familiennachzug

## Bürgerrechtsgesetz

### Bürgerrechtsgesetz (BüG)
- **SR-Nummer**: 141.0
- **Massgebliche Bestimmungen für EU-Bürger**:
  - Art. 9: 5-jährige Aufenthaltspflicht (gegenüber 10 Jahren für Nicht-EU)
  - Art. 10–11: Kantons- und Gemeindevoraussetzungen

## Wo finden Sie die offiziellen Texte?

### Hauptquellen:
- **Fedlex**: [fedlex.admin.ch](https://www.fedlex.admin.ch) – Vollständige Rechtsdatenbank
- **SEM-Website**: [sem.admin.ch](https://www.sem.admin.ch) – Weisungen der Migrationsbehörde
- **CH.ch-Portal**: [ch.ch](https://www.ch.ch) – Offizielles Behördenportal

### Suchtipps:
- Verwenden Sie SR-Nummern für exakte Gesetze (z. B. «142.20» für AIG)
- Suche in Deutsch/Französisch/Italienisch (Amtssprachen)
- «Stand am»-Datum für aktuelle Versionen prüfen

## Wichtige Hinweise

- **Sprache**: Amtliche Texte liegen auf Deutsch/Französisch/Italienisch vor
- **Aktualisierungen**: Gesetze werden regelmässig angepasst – stets aktuelle Versionen prüfen
- **Auslegung**: SEM-Weisungen geben die amtliche Auslegung vor
- **Änderungen**: SEM-Mitteilungen zu Rechtsänderungen im Auge behalten

**Hinweis**: Dies sind allgemeine Informationen. Für Ihre konkrete Situation konsultieren Sie bitte die offiziellen Quellen und qualifizierte Rechtsberatung.`,
        },
      ],
    },
  },
  americans: {
    hero: {
      tagline: 'Ihr Schweizer Erfolg beginnt hier – wir kennen den Weg',
      description: 'Ja, das Kontingentsystem ist wettbewerbsintensiv – aber jedes Jahr gelingt es Tausenden von US-Bürgern! Mit unseren bewährten Strategien, fachkundiger Beratung, Insiderwissen und persönlicher Begleitung helfen wir Ihnen, sicher durch das System zu navigieren. Wir haben hunderten US-amerikanischen Fachkräften zur Bewilligung verholfen – auch Ihr Schweizer Traum ist absolut erreichbar. Vertrauen Sie uns: Wir zeigen Ihnen genau den Weg zum Erfolg. Gemeinsam schaffen wir es.',
      cta: 'Lassen Sie uns Sie zum Erfolg führen',
      stats: [
        { label: 'Bearbeitungszeit', value: '8–12 Wochen', description: 'Standard für Nicht-EU-Bürger – wir helfen Ihnen, alles korrekt vorzubereiten' },
        { label: 'Verbleibende Kontingente 2025', value: '2 500/8 500', description: 'Noch verfügbar – wir helfen Ihnen, strategisch zu bewerben' },
        { label: 'Gehaltsrichtwert', value: 'CHF 100 000+', description: 'Empfohlen für eine erfolgreiche Bewerbung – wir unterstützen Sie bei der Verhandlung' },
        { label: 'Erfolgsquote', value: '30–45 %', description: 'Mit sorgfältiger Vorbereitung – und diese Vorbereitung liefern wir' },
      ],
    },
    visas: {
      title: 'Aufenthaltsoptionen für US/Canada-Staatsangehörige',
      description: 'Nicht-EU-Arbeitsbewilligungen für nordamerikanische Fachkräfte',
      types: [
        {
          name: 'Kurzaufenthaltsbewilligung L',
          description: 'Befristete Bewilligung bis 12 Monate, einmal verlängerbar. Kontingentpflichtig (2025: 4 000 L-Bewilligungen für Drittstaatsangehörige). Geregelt durch AIG Art. 24 und VZAE Art. 23. Rechtsgrundlage: AIG Art. 24, VZAE Art. 23. Offizielle Quelle: [SEM – Arbeitsbewilligungen für Nicht-EU](https://www.sem.admin.ch/sem/de/home/themen/arbeit/nicht-eu_efta-angehoerige.html)',
          timeline: '8–12 Wochen',
          requirements: [
            'Stellenangebot eines Schweizer Arbeitgebers (muss nachweisen, dass kein geeigneter Schweizer/EU-Kandidat verfügbar ist, gemäss VZAE Art. 21 Abs. 1)',
            'Salär oberhalb des kantonalen Schwellenwerts (in der Regel CHF 70 000–100 000+, je nach Kanton, VZAE Art. 21 Abs. 3)',
            'Bildungsabschlüsse (apostilliert und falls nötig übersetzt, AIG Art. 30)',
            'Krankenversicherungsschutz (obligatorisch gemäss AIG Art. 27 Abs. 1)',
            'Kontingentsverfügbarkeit (entscheidend – aktueller Status auf der SEM-Website prüfen, AIG Art. 21)',
            'Arbeitgeber muss Stelle zuerst auf dem lokalen Stellenmarkt ausschreiben (VZAE Art. 21 Abs. 1)',
          ],
          applicable: true,
        },
        {
          name: 'Aufenthaltsbewilligung B',
          description: 'Jährlich erneuerbare Aufenthaltsbewilligung für qualifizierte Fachkräfte. Kontingentpflichtig (2025: 4 500 B-Bewilligungen für Drittstaatsangehörige). Geregelt durch AIG Art. 25. Rechtsgrundlage: AIG Art. 25, VZAE Art. 15. Offizielle Quelle: [SEM – Aufenthaltsbewilligungen](https://www.sem.admin.ch/sem/de/home/themen/arbeit/nicht-eu_efta-angehoerige.html)',
          timeline: '8–12 Wochen',
          requirements: [
            'L-Bewilligungsinhaber (bevorzugt) oder Direktbewerbung in Ausnahmefällen (VZAE Art. 15)',
            'Salär CHF 100 000–120 000+ (wettbewerbsfähig für Kontingentserteilung, VZAE Art. 21 Abs. 3)',
            'Qualifizierter Beruf mit anerkannten Abschlüssen (AIG Art. 30, VZAE Art. 21 Abs. 2)',
            'Kontingentsverfügbarkeit (Kontingentsstatus beim SEM prüfen, AIG Art. 21)',
            'Arbeitgeberbürgschaft und Begründung (VZAE Art. 21 Abs. 1)',
            'Integrationsbemühungen (Sprachkenntnisse empfohlen, AIG Art. 54 Abs. 1)',
          ],
          applicable: true,
        },
        {
          name: 'Investorenvisa',
          description: 'Für Unternehmer, die CHF 100 000+ investieren und Arbeitsplätze schaffen',
          timeline: '12–16 Wochen',
          requirements: [
            'Genehmigter Businessplan',
            'Investition von CHF 100 000+',
            'Schaffung von Arbeitsplätzen für Inländer',
            'Nachweis des wirtschaftlichen Nutzens',
          ],
          applicable: true,
        },
        {
          name: 'Studentenvisum',
          description: 'Studium in der Schweiz mit anschliessender Umwandlung in eine Arbeitsbewilligung',
          timeline: '4–8 Wochen',
          requirements: [
            'Hochschulzulassung',
            'Nachweis ausreichender finanzieller Mittel',
            'Krankenversicherung',
            'Keine Kontingente erforderlich',
          ],
          applicable: true,
        },
      ],
    },
    process: {
      title: 'Ihr Immigrationsweg als US/Canada-Staatsangehöriger',
      description: '7-Schritte-Verfahren für US-amerikanische Fachkräfte',
      steps: [
        {
          step: 1,
          title: 'Stellenangebot einholen',
          description: 'Finden Sie einen Arbeitgeber, der bereit ist, das Bewerbungsverfahren zu unterstützen und durch das Kontingentsystem zu navigieren',
          timeline: 'Individuell',
        },
        {
          step: 2,
          title: 'Unterlagen vorbereiten',
          description: 'Bildungsabschlüsse apostillieren, Referenzen einholen, Lebenslauf nach Schweizer Standard erstellen',
          timeline: '4–6 Wochen',
        },
        {
          step: 3,
          title: 'Arbeitgeber reicht Gesuch ein',
          description: 'Der Arbeitgeber stellt den Bewilligungsantrag beim kantonalen Migrationsamt',
          timeline: '1 Woche',
        },
        {
          step: 4,
          title: 'Kontingentsprüfung',
          description: 'Der Kanton prüft die Kontingentsverfügbarkeit',
          timeline: '2–4 Wochen',
        },
        {
          step: 5,
          title: 'Entscheid',
          description: 'Kantonale Bewilligung oder Ablehnung',
          timeline: 'Gesamtdauer 8–12 Wochen',
        },
        {
          step: 6,
          title: 'Bewilligung erhalten',
          description: 'L- oder B-Bewilligung erhalten und in die Schweiz ziehen',
          timeline: '1–2 Wochen nach Bewilligung',
        },
        {
          step: 7,
          title: 'Weg zur Einbürgerung',
          description: 'Nach 10 Jahren Aufenthalt Einbürgerungsgesuch stellen',
          timeline: '10 Jahre',
        },
      ],
    },
    tools: {
      title: 'Spezifische Tools für US/Canada-Staatsangehörige',
      description: 'Spezialisierte Hilfsmittel für US-amerikanische Fachkräfte',
      items: [
        {
          name: 'H-1B vs. Schweizer Bewilligung – Vergleich',
          description: 'Vergleichen Sie das US-amerikanische Arbeitsvisa-System mit Schweizer Bewilligungen',
          icon: 'compare',
        },
        {
          name: 'Gehaltsreferenz-Rechner',
          description: 'Berechnen Sie ein wettbewerbsfähiges Gehalt für Ihre Stelle und Ihren Kanton',
          icon: 'calculator',
        },
        {
          name: 'Kontingentsverfolgung',
          description: 'Echtzeit-Übersicht über verfügbare Bewilligungen nach Kanton',
          icon: 'chart',
        },
        {
          name: 'Leitfaden zur Apostillierung',
          description: 'Schritt-für-Schritt-Anleitung zur Beglaubigung amerikanischer und kanadischer Dokumente',
          icon: 'file',
        },
      ],
    },
    resources: {
      title: 'Ressourcen für US/Canada-Staatsangehörige',
      description: 'Sorgfältig ausgewählte Inhalte für US-amerikanische Fachkräfte',
      posts: [
        {
          title: 'H-1B vs. Schweizer L-Bewilligung: Umfassender Vergleich',
          excerpt: 'Die wichtigsten Unterschiede zwischen dem US-amerikanischen und dem Schweizer Arbeitsvisa-System verstehen',
          category: 'Vergleich',
        },
        {
          title: 'Kontingentsstrategie für US-amerikanische Fachkräfte',
          excerpt: 'So maximieren Sie Ihre Chancen im wettbewerbsintensiven Kontingentssystem',
          category: 'Strategie',
        },
        {
          title: 'Gehaltsverhandlung für Schweizer Stellen',
          excerpt: 'So verhandeln Sie ein wettbewerbsfähiges Gehalt, das die kantonalen Schwellenwerte erfüllt',
          category: 'Karriere',
        },
        {
          title: 'Von New York nach Zürich: Kostenvergleich',
          excerpt: 'Finanzplanung für US-amerikanische Fachkräfte beim Umzug in die Schweiz',
          category: 'Finanzen',
        },
        {
          title: '10-Jahres-Einbürgerungsweg für US-Bürger',
          excerpt: 'Vollständiger Leitfaden zur Einbürgerung für US-amerikanische und kanadische Staatsangehörige',
          category: 'Einbürgerung',
        },
      ],
    },
  },
  others: {
    hero: {
      tagline: 'Ihr Schweizer Traum ist möglich – wir machen ihn wahr',
      description: 'Das Kontingentsystem ist zwar anspruchsvoll, doch wir sind spezialisiert darauf, Staatsangehörigen aus Drittländern zum Erfolg zu verhelfen! Mit unserem strategischen Ansatz, Insiderwissen, bewährten Methoden und persönlicher Begleitung helfen wir Ihnen, sich aus der Masse hervorzuheben. Tausende haben es vor Ihnen geschafft – aus Indien, China, Brasilien und mehr als 120 weiteren Ländern. Mit der richtigen Beratung, Vorbereitung und Strategie können auch Sie es schaffen. Vertrauen Sie uns als Ihren Partner auf jedem Schritt. Ihre Schweizer Zukunft beginnt hier.',
      cta: 'Starten Sie jetzt Ihre strategische Reise',
      stats: [
        { label: 'Bearbeitungszeit', value: '8–16 Wochen', description: 'Abhängig vom Herkunftsland – wir helfen Ihnen, alles perfekt vorzubereiten' },
        { label: 'Verbleibende Kontingente 2025', value: '2 500/8 500', description: 'Noch verfügbar – wir helfen Ihnen, strategisch zu bewerben' },
        { label: 'Erfolgsquote', value: '15–30 %', description: 'Mit strategischem Ansatz – und diesen Ansatz liefern wir' },
        { label: 'Botschaftsbearbeitung', value: 'Variabel', description: 'Länderspezifisch – wir begleiten Sie durch den Prozess' },
      ],
    },
    visas: {
      title: 'Aufenthaltsoptionen für Drittstaatsangehörige',
      description: 'Vollständige Übersicht der Visumswege für Staatsangehörige aus Nicht-EU/Nicht-USA-Ländern',
      types: [
        {
          name: 'Kurzaufenthaltsbewilligung L',
          description: 'Befristete Bewilligung bis 12 Monate, streng kontingentiert',
          timeline: '8–16 Wochen',
          requirements: [
            'Stellenangebot eines Schweizer Arbeitgebers',
            'Salär über dem hohen Schwellenwert (CHF 100 000+)',
            'Beglaubigte Bildungsabschlüsse (apostilliert)',
            'Kontingentsverfügbarkeit (entscheidend)',
            'Stichhaltige Begründung des Arbeitgebers',
          ],
          applicable: true,
        },
        {
          name: 'Aufenthaltsbewilligung B',
          description: 'Jährlich erneuerbare Bewilligung, Kontingent stark umkämpft',
          timeline: '8–16 Wochen',
          requirements: [
            'L-Bewilligungsinhaber oder ausserordentliches Profil',
            'Salär CHF 100 000–120 000+',
            'Einzigartige Qualifikationen oder Spezialwissen',
            'Kontingentsverfügbarkeit',
            'Lückenlose Unterlagen',
          ],
          applicable: true,
        },
        {
          name: 'Studentenvisum',
          description: 'Studium in der Schweiz mit anschliessender Umwandlung in Arbeitsbewilligung (kontingentfreier Einstieg)',
          timeline: '4–8 Wochen',
          requirements: [
            'Hochschulzulassung',
            'Nachweis ausreichender finanzieller Mittel',
            'Krankenversicherung',
            'Keine Kontingente erforderlich',
          ],
          applicable: true,
        },
        {
          name: 'Familiennachzug',
          description: 'Zusammenführung mit Ehepartner oder Familienangehörigem mit Schweizer Bewilligung',
          timeline: '12–16 Wochen',
          requirements: [
            'Familienangehöriger mit gültiger Schweizer Bewilligung',
            'Nachweis der Verwandtschaft',
            'Ausreichende finanzielle Mittel',
            'Krankenversicherung',
          ],
          applicable: true,
        },
      ],
    },
    process: {
      title: 'Ihr Immigrationsweg als Drittstaatsangehöriger',
      description: 'Umfassendes 8-Schritte-Verfahren mit strategischen Überlegungen',
      steps: [
        {
          step: 1,
          title: 'Recherche und Strategie',
          description: 'Den besten Kanton, das optimale Timing und den geeigneten Ansatz für Ihr Profil ermitteln',
          timeline: '2–4 Wochen',
        },
        {
          step: 2,
          title: 'Stellenangebot einholen',
          description: 'Arbeitgeber finden, der bereit ist, das Sponsoring zu übernehmen und das umkämpfte Kontingent zu nutzen',
          timeline: 'Individuell',
        },
        {
          step: 3,
          title: 'Lückenlose Unterlagen vorbereiten',
          description: 'Alle Abschlüsse apostillieren, Referenzen einholen, Lebenslauf nach Schweizer Standard erstellen',
          timeline: '4–8 Wochen',
        },
        {
          step: 4,
          title: 'Arbeitgeber reicht Gesuch ein',
          description: 'Arbeitgeber stellt Gesuch mit überzeugender Begründung beim kantonalen Migrationsamt',
          timeline: '1–2 Wochen',
        },
        {
          step: 5,
          title: 'Kontingentsprüfung',
          description: 'Kritisch: Der Kanton prüft die Kontingentsverfügbarkeit',
          timeline: '2–4 Wochen',
        },
        {
          step: 6,
          title: 'Entscheid',
          description: 'Kantonale Bewilligung oder Ablehnung (Einsprache möglich)',
          timeline: 'Gesamtdauer 8–16 Wochen',
        },
        {
          step: 7,
          title: 'Botschaftsbearbeitung',
          description: 'Bei Bewilligung: Visum an der Schweizer Botschaft in Ihrem Heimatland einholen',
          timeline: '2–6 Wochen',
        },
        {
          step: 8,
          title: 'Weg zur Einbürgerung',
          description: 'Nach 10 Jahren Aufenthalt Einbürgerungsgesuch stellen',
          timeline: '10 Jahre',
        },
      ],
    },
    tools: {
      title: 'Spezifische Tools für Drittstaatsangehörige',
      description: 'Spezialisierte Hilfsmittel für internationale Bewerber',
      items: [
        {
          name: 'Kontingentsverfolgung nach Region',
          description: 'Echtzeit-Übersicht über verfügbare Kontingente nach Kanton und Branche',
          icon: 'chart',
        },
        {
          name: 'Botschaftsleitfaden nach Land',
          description: 'Finden Sie Ihre Schweizer Botschaft und verstehen Sie die länderspezifischen Bearbeitungsanforderungen',
          icon: 'map',
        },
        {
          name: 'Dokumentenbeglaubigung – Leitfaden',
          description: 'Länderspezifische Anleitungen zur Apostillierung von Dokumenten',
          icon: 'file',
        },
        {
          name: 'Strategischer Timing-Rechner',
          description: 'Berechnen Sie den optimalen Bewerbungszeitpunkt anhand von Kontingentsmustern',
          icon: 'calendar',
        },
      ],
    },
    resources: {
      title: 'Ressourcen für Drittstaatsangehörige',
      description: 'Umfassende Inhalte für internationale Bewerber',
      posts: [
        {
          title: 'Kontingentsstrategie: Ihre Chancen maximieren',
          excerpt: 'So positionieren Sie sich optimal im wettbewerbsintensiven Kontingentssystem',
          category: 'Strategie',
        },
        {
          title: 'Botschaftsbearbeitung nach Region',
          excerpt: 'Umfassender Leitfaden zu den Anforderungen der Schweizer Botschaften nach Land',
          category: 'Botschaft',
        },
        {
          title: 'Bewilligungsweg für indische Staatsangehörige: Vollständiger Leitfaden',
          excerpt: 'Spezialisierter Wegweiser für indische Fachkräfte',
          category: 'Länderspezifisch',
        },
        {
          title: 'Bewilligungsweg für brasilianische Staatsangehörige: Schritt für Schritt',
          excerpt: 'Vollständiger Leitfaden für brasilianische Antragsteller',
          category: 'Länderspezifisch',
        },
        {
          title: 'Bildungsweg: Erst studieren, dann arbeiten',
          excerpt: 'Wie Sie ein Schweizer Studium als kontingentfreie Einwanderungsstrategie nutzen',
          category: 'Wegweiser',
        },
      ],
    },
  },
}
