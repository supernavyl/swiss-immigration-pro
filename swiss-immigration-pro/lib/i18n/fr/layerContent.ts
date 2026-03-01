// French translations for layer content - Natural and native speaking style

import type { LayerContent } from '../../layerContent'

export const LAYER_CONTENT_FR: Record<string, LayerContent> = {
  europeans: {
    hero: {
      tagline: 'Votre Rêve Suisse Commence Ici - Nous Rendant Tout Simple',
      description: 'En tant que citoyen UE/AELE, s\'installer en Suisse est plus simple que vous ne le pensez ! Aucun quota, traitement rapide (2-4 semaines), et un parcours clair de 5 ans vers la naturalisation. Avec nos conseils d\'experts, nos stratégies éprouvées et notre accompagnement pas à pas, vous pouvez naviguer dans le processus en toute confiance. Des milliers ont réussi avant vous - laissez-nous vous guider à chaque étape. Votre avenir suisse n\'est qu\'à une décision près.',
      cta: 'Commencez Votre Parcours Simple Aujourd\'hui',
      stats: [
        { label: 'Délai de Traitement', value: '2-4 Semaines', description: 'Voie rapide pour les citoyens UE/AELE - nous vous aidons à tout préparer parfaitement' },
        { label: 'Restrictions de Quota', value: 'Aucune', description: 'Avantages de la libre circulation - postulez à tout moment, n\'importe où' },
        { label: 'Délai de Naturalisation', value: '5 Ans', description: 'contre 10 ans pour les non-UE - nous vous aidons à suivre vos progrès' },
        { label: 'Taux de Réussite', value: '95%+', description: 'Pour les candidats qualifiés - et nous vous aidons à vous qualifier' },
      ],
    },
    visas: {
      title: 'Options de Visa UE/AELE',
      description: 'En tant que citoyen UE/AELE, vous avez un accès simplifié aux permis de séjour suisses sous l\'Accord sur la libre circulation des personnes (ALCP). Sources officielles : SEM, AuG (RS 142.20), VZAE (RS 142.201).',
      types: [
        {
          name: 'Permis B (Séjour)',
          description: 'Permis de séjour complet pour les citoyens UE/AELE avec offre d\'emploi ou activité indépendante. Régit par l\'Accord sur la libre circulation des personnes (ALCP) et la Loi sur les étrangers (AuG, RS 142.20). Base légale : AuG Art. 25, VZAE Art. 15. Source officielle : [Directives SEM](https://www.sem.admin.ch/sem/en/home/themen/arbeit/eu_efta-angehoerige.html)',
          timeline: '2-4 semaines',
          requirements: [
            'Contrat de travail valide ou preuve d\'activité indépendante (ALCP Art. 7, AuG Art. 25)',
            'Couverture d\'assurance maladie (obligatoire selon AuG Art. 27 al. 1)',
            'Preuve de moyens financiers (si indépendant, VZAE Art. 15 al. 2)',
            'Inscription auprès de la commune dans les 14 jours suivant l\'arrivée (AuG Art. 27 al. 2)',
            'Aucun casier judiciaire (peut être vérifié selon AuG Art. 28)',
          ],
          applicable: true,
        },
        {
          name: 'Permis L (Court Terme)',
          description: 'Permis temporaire pour les citoyens UE/AELE pour un emploi jusqu\'à 12 mois. Renouvelable selon les dispositions de l\'ALCP. Base légale : AuG Art. 24, VZAE Art. 10. Source officielle : [SEM - Permis de Courte Durée](https://www.sem.admin.ch/sem/en/home/themen/arbeit/eu_efta-angehoerige.html)',
          timeline: '1-3 semaines',
          requirements: [
            'Contrat de travail (minimum 3 mois, VZAE Art. 10 al. 1)',
            'Couverture d\'assurance maladie (AuG Art. 27 al. 1)',
            'Preuve de logement (VZAE Art. 10 al. 2)',
            'Inscription auprès de la commune dans les 14 jours (AuG Art. 27 al. 2)',
          ],
          applicable: true,
        },
        {
          name: 'Permis G (Frontalier)',
          description: 'Pour les résidents frontaliers travaillant en Suisse mais résidant dans un pays UE/AELE. Régit par l\'ALCP et l\'AuG Art. 25. Base légale : AuG Art. 25, VZAE Art. 20. Source officielle : [SEM - Travailleurs Frontaliers](https://www.sem.admin.ch/sem/en/home/themen/arbeit/grenzgaenger.html)',
          timeline: '1-2 semaines',
          requirements: [
            'Résidence dans une région frontalière (DE/FR/IT/AT/LI) à distance raisonnable (VZAE Art. 20 al. 1)',
            'Contrat de travail en Suisse (AuG Art. 25)',
            'Capacité de retourner à la résidence au moins une fois par semaine (VZAE Art. 20 al. 2)',
            'Assurance maladie (couverture suisse ou UE, AuG Art. 27 al. 1)',
          ],
          applicable: true,
        },
        {
          name: 'Carte Bleue UE',
          description: 'Optionnelle pour les professionnels UE hautement qualifiés. Peu utilisée en Suisse car le permis B standard est plus simple sous l\'ALCP. Régie par la Directive Carte Bleue UE. Source officielle : [SEM - Travailleurs Hautement Qualifiés](https://www.sem.admin.ch/sem/en/home/themen/arbeit.html)',
          timeline: '3-5 semaines',
          requirements: [
            'Diplôme universitaire ou équivalent (5+ ans d\'expérience professionnelle selon la Directive UE)',
            'Salaire répondant au seuil (varie selon le canton, généralement CHF 97 000+, VZAE Art. 21)',
            'Emploi qualifié correspondant aux qualifications (Directive Carte Bleue UE Art. 5)',
          ],
          applicable: true,
        },
      ],
    },
    process: {
      title: 'Votre Processus d\'Immigration UE/AELE',
      description: 'Processus simplifié en 5 étapes pour les citoyens UE/AELE',
      steps: [
        {
          step: 1,
          title: 'Obtenir une Offre d\'Emploi ou Démarrer une Activité Indépendante',
          description: 'Trouvez un emploi ou établissez une activité indépendante en Suisse. Sous l\'ALCP, les citoyens UE/AELE peuvent chercher du travail jusqu\'à 3 mois sans permis.',
          timeline: 'Variable',
        },
        {
          step: 2,
          title: 'S\'Inscrire auprès de la Commune (Gemeinde)',
          description: 'Inscrivez votre résidence dans les 14 jours suivant l\'arrivée (AuG Art. 27). Apportez : passeport, contrat de travail et preuve de logement.',
          timeline: '1 jour',
        },
        {
          step: 3,
          title: 'Demander le Permis via la Commune',
          description: 'La commune transmet votre demande à l\'office cantonal des migrations. Pour les citoyens UE/AELE, le traitement est simplifié sous l\'ALCP.',
          timeline: '1 semaine',
        },
        {
          step: 4,
          title: 'Recevoir le Permis',
          description: 'Obtenez votre permis B ou L. Le traitement prend généralement 2-4 semaines pour les citoyens UE/AELE (contre 8-12 semaines pour les non-UE).',
          timeline: '2-4 semaines',
        },
        {
          step: 5,
          title: 'Parcours vers la Naturalisation',
          description: 'Après 5 ans de résidence continue avec le permis B, vous pouvez demander la naturalisation (contre 10 ans pour les non-UE). Base légale : Loi sur la nationalité (StAG, RS 141.0) Art. 15 al. 1. Source officielle : [SEM - Naturalisation](https://www.sem.admin.ch/sem/en/home/themen/buergerrecht.html)',
          timeline: '5 ans',
        },
      ],
    },
    tools: {
      title: 'Outils Spécifiques UE/AELE',
      description: 'Ressources spécialisées pour les citoyens UE/AELE',
      items: [
        {
          name: 'Calculateur d\'Éligibilité au Permis',
          description: 'Calculez vos chances d\'obtenir un permis de travail suisse',
          icon: 'calculator',
          link: '/tools/permit-calculator',
        },
        {
          name: 'Planificateur de Délais',
          description: 'Planifiez votre parcours d\'immigration avec des jalons personnalisés',
          icon: 'calendar',
          link: '/tools/timeline-planner',
        },
        {
          name: 'Calculateur de Permis G',
          description: 'Calculez si le travail frontalier est avantageux pour vous',
          icon: 'calculator',
        },
        {
          name: 'Éligibilité Carte Bleue UE',
          description: 'Vérifiez si la Carte Bleue UE offre des avantages par rapport au permis B standard',
          icon: 'card',
        },
        {
          name: 'Guide de Regroupement Familial',
          description: 'Processus simplifié pour faire venir les membres de votre famille en Suisse',
          icon: 'family',
        },
        {
          name: 'Planificateur de Naturalisation 5 Ans',
          description: 'Suivez vos progrès vers l\'éligibilité à la nationalité suisse',
          icon: 'calendar',
        },
      ],
    },
    resources: {
      title: 'Ressources UE/AELE',
      description: 'Contenu sélectionné pour les citoyens européens avec références légales officielles',
      posts: [
        {
          title: 'Permis G : Meilleure Option pour les Résidents Frontaliers',
          excerpt: 'Pourquoi vivre dans votre pays d\'origine et travailler en Suisse pourrait être le choix le plus intelligent. Base légale : ALCP et AuG Art. 25.',
          category: 'Permis',
          content: `# Permis G : Le Choix Intelligent pour les Résidents Frontaliers

## Pourquoi Choisir un Permis G ?

Le permis G (permis de frontalier) vous permet de vivre dans votre pays d'origine UE/AELE tout en travaillant en Suisse. Cette disposition offre plusieurs avantages :

### Avantages Clés :
- **Avantages Fiscaux** : Payez des impôts uniquement dans votre pays d'origine (généralement des taux plus bas)
- **Coûts du Logement** : Vivez dans un logement UE plus abordable
- **Vie Familiale** : Maintenez votre style de vie actuel et vos connexions sociales
- **Aucune Exigence d'Intégration** : Exigences linguistiques moins strictes

## Exigences d'Éligibilité

Pour être éligible au permis G, vous devez :
- Vivre dans un pays UE/AELE à distance raisonnable (généralement 30-60 km)
- Travailler en Suisse
- Retourner à votre résidence au moins une fois par semaine
- Avoir un contrat de travail valide

## Processus de Demande

1. **Trouver un Emploi** : Obtenez une offre d'emploi d'un employeur suisse
2. **S'Inscrire** : Postulez via l'office cantonal des migrations dans votre canton de travail
3. **Documentation** : Soumettez passeport, contrat de travail et preuve de résidence
4. **Traitement** : Généralement 1-2 semaines selon les dispositions de l'ALCP

## Références Légales
- **Accord ALCP** : Régit les droits des travailleurs frontaliers
- **AuG Art. 25** : Permis pour les travailleurs frontaliers
- **VZAE Art. 20** : Exigences spécifiques pour les permis G

**Source Officielle** : [SEM - Travailleurs Frontaliers](https://www.sem.admin.ch/sem/en/home/themen/arbeit/grenzgaenger.html)`,
        },
        {
          title: 'Carte Bleue UE vs. Permis B : Lequel est Meilleur ?',
          excerpt: 'Comparez les deux options pour les professionnels UE hautement qualifiés. La plupart des citoyens UE choisissent le permis B car il est plus simple.',
          category: 'Comparaison',
          content: `# Carte Bleue UE vs. Permis B : Faire le Bon Choix

## La Carte Bleue UE en Suisse

La Carte Bleue UE est un permis optionnel pour les travailleurs non-UE hautement qualifiés, mais les citoyens UE/AELE l'utilisent rarement car les permis standard sont plus simples.

### Quand la Carte Bleue UE Peut Avoir du Sens :
- **Mobilité Internationale** : Si vous prévoyez de travailler dans plusieurs pays UE
- **Salaire Très Élevé** : Salaire annuel de CHF 120 000+
- **Qualifications Spécifiques** : Diplôme universitaire + 5+ ans d'expérience

## Pourquoi la Plupart des Citoyens UE Choisissent le Permis B

### Avantages du Permis B :
- **Processus Plus Simple** : Aucune exigence supplémentaire au-delà du permis B standard
- **Traitement Plus Rapide** : Même délai de 2-4 semaines que les autres permis UE
- **Aucun Salaire Minimum** : Exigences salariales plus flexibles
- **Avantages Familiaux** : Regroupement familial plus facile

## Tableau Comparatif

| Aspect | Carte Bleue UE | Permis B Standard |
|--------|----------------|-------------------|
| Délai de Traitement | 3-5 semaines | 2-4 semaines |
| Seuil de Salaire | CHF 97 000+ | Aucun minimum (taux du marché) |
| Documentation | Plus complexe | Processus UE standard |
| Mobilité | À l'échelle de l'UE | Axé sur la Suisse |
| Droits Familiaux | À l'échelle de l'UE | Droits de résidence suisses |

## Recommandation

**Pour la plupart des citoyens UE/AELE** : Choisissez le permis B standard. Il est plus simple, plus rapide et offre les mêmes avantages à long terme.

**Sources Officielles** :
- [SEM - Travailleurs Hautement Qualifiés](https://www.sem.admin.ch/sem/en/home/themen/arbeit.html)
- Directive Carte Bleue UE (implémentée dans la loi suisse via VZAE Art. 21)`,
        },
        {
          title: 'Naturalisation en 5 Ans : Ce que Vous Devez Savoir',
          excerpt: 'Guide complet de la naturalisation accélérée pour les citoyens UE/AELE. Base légale : Loi sur la nationalité (StAG, RS 141.0).',
          category: 'Naturalisation',
          content: `# Naturalisation Accélérée : 5 Ans pour les Citoyens UE/AELE

## Votre Délai de Naturalisation

En tant que citoyen UE/AELE, vous êtes éligible à la naturalisation après **5 ans** de résidence continue en Suisse, contre 10 ans pour les citoyens non-UE.

## Exigences Clés

### Exigences de Résidence :
- **5 ans de résidence continue** en Suisse (StAG Art. 9)
- **1 an** dans le canton où vous postulez (StAG Art. 10)
- **3 mois** dans la commune où vous postulez (StAG Art. 11)

### Exigences d'Intégration :
- **Maîtrise de la Langue** : Niveau A2 dans la langue locale (allemand/français/italien/romanche)
- **Connaissance de la Suisse** : Réussir le test de naturalisation sur l'histoire, la géographie et les institutions suisses
- **Intégration Sociale** : Démontrer une bonne intégration (emploi, aucun casier judiciaire)

### Exigences Supplémentaires :
- **Casier Judiciaire Propre** : Aucune condamnation pénale grave
- **Indépendance Financière** : Aucune dépendance à l'assistance sociale
- **Emploi** : Emploi stable ou activité indépendante

## Processus de Demande

1. **Préparer les Documents** : Rassemblez permis de séjour, certificats linguistiques, preuve d'emploi
2. **Suivre le Cours d'Intégration** : Complétez le cours d'intégration requis
3. **Postuler à la Commune** : Soumettez votre demande à votre commune locale
4. **Examen Cantonal** : Les autorités cantonales examinent votre demande
5. **Approbation Fédérale** : L'Office fédéral de la nationalité prend la décision finale
6. **Cérémonie** : Assistez à la cérémonie de naturalisation

## Délais et Coûts

- **Délai de Traitement** : 12-18 mois
- **Frais de Demande** : CHF 200-500 (varie selon le canton)
- **Test Linguistique** : CHF 100-200
- **Cours d'Intégration** : CHF 200-400

## Avantages de la Nationalité Suisse

- **Droits Politiques Complets** : Vote aux élections fédérales, cantonales et communales
- **Citoyenneté UE** : Citoyenneté UE automatique avec tous les droits
- **Aucun Renouvellement de Permis** : Droits de résidence permanents
- **Avantages Familiaux** : Plus facile de faire venir la famille élargie

**Source Officielle** : [SEM - Naturalisation](https://www.sem.admin.ch/sem/en/home/themen/buergerrecht.html)
**Base Légale** : Loi sur la nationalité (StAG, RS 141.0)`,
        },
        {
          title: 'Regroupement Familial Simplifié',
          excerpt: 'Comment faire venir votre conjoint et vos enfants en Suisse en tant que citoyen UE sous les dispositions de regroupement familial de l\'ALCP.',
          category: 'Famille',
          content: `# Regroupement Familial pour les Citoyens UE/AELE

## Vos Droits Familiaux sous l'ALCP

En tant que citoyen UE/AELE avec un permis de séjour suisse, votre conjoint et vos enfants ont le **droit de vous rejoindre** en Suisse sous l'Accord sur la libre circulation.

## Qui est Éligible au Regroupement Familial ?

### Famille Immédiate :
- **Conjoint/Partenaire Enregistré** : Droit automatique de vous rejoindre
- **Enfants Mineurs** : Moins de 18 ans
- **Enfants à Charge** : Plus de 18 ans mais financièrement dépendants

### Famille Étendue :
- **Parents** : Peuvent vous rejoindre si vous fournissez des soins (au cas par cas)
- **Enfants Adultes** : Doivent généralement être autonomes

## Processus de Demande

### Pour le Conjoint :
1. **Sécuriser le Logement** : Preuve de logement adéquat
2. **Assurance Maladie** : Couverture pour toute la famille
3. **Emploi** : Le conjoint peut travailler immédiatement (aucun permis nécessaire)
4. **S'Inscrire** : Postuler via l'office cantonal des migrations

### Pour les Enfants :
1. **Acte de Naissance** : Documents officiels
2. **Inscription Scolaire** : Pour les enfants d'âge scolaire
3. **Examen Médical** : Certificat de santé si requis
4. **Documents de Garde** : Si applicable

## Délais et Droits

- **Délai de Traitement** : 2-4 semaines pour les familles UE/AELE
- **Droits de Travail** : Le conjoint peut travailler immédiatement
- **Droits de Résidence** : Droits de résidence complets dès le premier jour
- **Prestations Sociales** : Accès aux services sociaux suisses

## Avantages Clés pour les Familles UE

- **Aucun Quota** : Le regroupement familial n'est pas soumis aux quotas
- **Traitement Rapide** : Procédure simplifiée sous l'ALCP
- **Droits Complets** : Mêmes droits que vous dès l'arrivée
- **Parcours vers la Naturalisation** : Les membres de la famille suivent votre délai de naturalisation

## Références Légales

- **ALCP Art. 3** : Droits de regroupement familial
- **AuG Art. 42-44** : Permis familiaux pour les étrangers
- **VZAE Art. 39-42** : Mise en œuvre du regroupement familial

**Source Officielle** : [SEM - Regroupement Familial](https://www.sem.admin.ch/sem/en/home/themen/familie.html)`,
        },
        {
          title: 'Références Légales Officielles',
          excerpt: 'Lois clés : Loi sur les étrangers (AuG, RS 142.20), Accord ALCP, Ordonnance VZAE (RS 142.201). Accès via Fedlex.admin.ch',
          category: 'Légal',
          content: `# Cadre Juridique Essentiel pour les Citoyens UE/AELE

## Législation Principale

### 1. Accord sur la Libre Circulation des Personnes (ALCP)
- **Numéro RS** : 0.142.112.681
- **Objectif** : Régit le mouvement et l'emploi des citoyens UE/AELE
- **Articles Clés** :
  - Art. 1-2 : Champ d'application personnel et définitions
  - Art. 7 : Droits d'emploi
  - Art. 3 : Regroupement familial
  - Art. 9 : Coordination de la sécurité sociale

### 2. Loi sur les Étrangers (AuG)
- **Numéro RS** : 142.20
- **Objectif** : Loi principale régissant les étrangers en Suisse
- **Articles Clés pour les Citoyens UE** :
  - Art. 2 : Champ d'application (exclut UE/AELE de certaines restrictions)
  - Art. 24-25 : Permis L et B pour les citoyens UE
  - Art. 27 : Exigences d'inscription
  - Art. 42-44 : Regroupement familial

### 3. Ordonnance sur l'Admission, le Séjour et l'Activité Lucrative (VZAE)
- **Numéro RS** : 142.201
- **Objectif** : Mise en œuvre des dispositions de l'AuG
- **Articles Clés** :
  - Art. 10 : Permis L pour les citoyens UE
  - Art. 15 : Permis B pour les citoyens UE
  - Art. 20 : Permis G pour les travailleurs frontaliers
  - Art. 39-42 : Procédures de regroupement familial

## Loi sur la Nationalité

### Loi sur la Nationalité (StAG)
- **Numéro RS** : 141.0
- **Dispositions Clés pour les Citoyens UE** :
  - Art. 9 : Exigence de résidence de 5 ans (contre 10 pour les non-UE)
  - Art. 10-11 : Exigences cantonales et communales

## Où Trouver les Textes Officiels

### Sources Principales :
- **Fedlex** : [fedlex.admin.ch](https://www.fedlex.admin.ch) - Base de données juridique complète
- **Site Web SEM** : [sem.admin.ch](https://www.sem.admin.ch) - Orientation de l'autorité migratoire
- **Portail CH.ch** : [ch.ch](https://www.ch.ch) - Portail gouvernemental officiel

### Conseils de Recherche :
- Utilisez les numéros RS pour les lois exactes (par ex. "142.20" pour AuG)
- Recherchez en allemand/français/italien (langues officielles)
- Vérifiez les dates "Stand am" pour les versions actuelles

## Notes Importantes

- **Langue** : Les textes officiels sont en allemand/français/italien
- **Mises à Jour** : Les lois sont régulièrement mises à jour - vérifiez toujours les versions actuelles
- **Interprétation** : Les directives SEM fournissent l'interprétation officielle
- **Changements** : Surveillez les annonces SEM pour les changements de politique

**Avertissement** : Ceci est une information générale. Consultez les sources officielles et des conseils juridiques professionnels pour votre situation spécifique.`,
        },
      ],
    },
  },
  americans: {
    hero: {
      tagline: 'Votre Histoire de Succès Suisse Commence Ici - Nous Connaissons le Chemin',
      description: 'Oui, le système de quotas est compétitif, mais des milliers d\'Américains réussissent chaque année ! Avec nos stratégies éprouvées, nos conseils d\'experts, nos connaissances internes et notre soutien personnalisé, nous vous aidons à naviguer dans le système en toute confiance. Nous avons aidé des centaines de professionnels américains à obtenir leurs permis - votre rêve suisse est absolument réalisable. Faites-nous confiance pour vous montrer exactement comment réussir. Faisons-le ensemble !',
      cta: 'Laissez-Nous Vous Guider vers le Succès',
      stats: [
        { label: 'Délai de Traitement', value: '8-12 Semaines', description: 'Standard pour les non-UE - nous vous aidons à tout préparer correctement' },
        { label: 'Quotas 2025 Restants', value: '2 500/8 500', description: 'Toujours disponibles - nous vous aidons à postuler stratégiquement' },
        { label: 'Seuil de Salaire', value: 'CHF 100k+', description: 'Recommandé pour le succès - nous vous aidons à négocier' },
        { label: 'Taux de Réussite', value: '30-45%', description: 'Avec une préparation appropriée - et nous fournissons cette préparation' },
      ],
    },
    visas: {
      title: 'Options de Visa US/Canada',
      description: 'Permis de travail non-UE adaptés aux professionnels américains',
      types: [
        {
          name: 'Permis L (Court Terme)',
          description: 'Permis temporaire jusqu\'à 12 mois, renouvelable une fois. Soumis aux quotas annuels (2025 : 4 000 permis L pour les non-UE). Régit par AuG Art. 24 et VZAE Art. 23. Base légale : AuG Art. 24, VZAE Art. 23. Source officielle : [SEM - Permis de Travail Non-UE](https://www.sem.admin.ch/sem/en/home/themen/arbeit/nicht-eu_efta-angehoerige.html)',
          timeline: '8-12 semaines',
          requirements: [
            'Offre d\'emploi d\'un employeur suisse (doit prouver qu\'aucun candidat suisse/UE approprié n\'est disponible selon VZAE Art. 21 al. 1)',
            'Salaire répondant aux seuils cantonaux (généralement CHF 70k-100k+ selon le canton, VZAE Art. 21 al. 3)',
            'Certificats d\'éducation (apostillés et traduits si nécessaire, AuG Art. 30)',
            'Couverture d\'assurance maladie (obligatoire selon AuG Art. 27 al. 1)',
            'Disponibilité des quotas (critique - vérifiez le site web SEM pour le statut actuel, AuG Art. 21)',
            'L\'employeur doit d\'abord publier le poste localement (VZAE Art. 21 al. 1)',
          ],
          applicable: true,
        },
        {
          name: 'Permis B (Séjour)',
          description: 'Permis de séjour renouvelable annuellement pour les professionnels qualifiés. Soumis aux quotas annuels (2025 : 4 500 permis B pour les non-UE). Régit par AuG Art. 25. Base légale : AuG Art. 25, VZAE Art. 15. Source officielle : [SEM - Permis de Séjour](https://www.sem.admin.ch/sem/en/home/themen/arbeit/nicht-eu_efta-angehoerige.html)',
          timeline: '8-12 semaines',
          requirements: [
            'Titulaire de permis L (préféré) ou demande directe pour cas exceptionnels (VZAE Art. 15)',
            'Salaire CHF 100k-120k+ (compétitif pour l\'approbation du quota, VZAE Art. 21 al. 3)',
            'Profession qualifiée avec éducation reconnue (AuG Art. 30, VZAE Art. 21 al. 2)',
            'Disponibilité des quotas (vérifiez le statut des quotas SEM, AuG Art. 21)',
            'Parrainage et justification de l\'employeur (VZAE Art. 21 al. 1)',
            'Efforts d\'intégration (compétences linguistiques recommandées, AuG Art. 54 al. 1)',
          ],
          applicable: true,
        },
        {
          name: 'Visa d\'Investissement',
          description: 'Pour les entrepreneurs investissant CHF 100k+ et créant des emplois',
          timeline: '12-16 semaines',
          requirements: [
            'Approbation du plan d\'affaires',
            'Investissement de CHF 100k+',
            'Création d\'emplois pour les locaux',
            'Preuve de contribution économique',
          ],
          applicable: true,
        },
        {
          name: 'Visa d\'Étudiant',
          description: 'Étudier en Suisse, puis convertir en permis de travail',
          timeline: '4-8 semaines',
          requirements: [
            'Admission universitaire',
            'Preuve de moyens financiers',
            'Assurance maladie',
            'Aucun quota nécessaire',
          ],
          applicable: true,
        },
      ],
    },
    process: {
      title: 'Votre Processus d\'Immigration US/Canada',
      description: 'Processus en 7 étapes pour les professionnels américains',
      steps: [
        {
          step: 1,
          title: 'Obtenir une Offre d\'Emploi',
          description: 'Trouvez un employeur prêt à parrainer et à naviguer dans le système de quotas',
          timeline: 'Variable',
        },
        {
          step: 2,
          title: 'Préparer la Documentation',
          description: 'Apostiller les certificats d\'éducation, obtenir des références, CV style suisse',
          timeline: '4-6 semaines',
        },
        {
          step: 3,
          title: 'L\'Employeur Dépose la Demande',
          description: 'L\'employeur soumet la demande de permis à l\'autorité cantonale',
          timeline: '1 semaine',
        },
        {
          step: 4,
          title: 'Vérification des Quotas',
          description: 'Le canton vérifie la disponibilité des quotas',
          timeline: '2-4 semaines',
        },
        {
          step: 5,
          title: 'Décision',
          description: 'Approbation ou rejet cantonal',
          timeline: '8-12 semaines au total',
        },
        {
          step: 6,
          title: 'Recevoir le Permis',
          description: 'Obtenez le permis L ou B et déménagez en Suisse',
          timeline: '1-2 semaines après approbation',
        },
        {
          step: 7,
          title: 'Parcours vers la Naturalisation',
          description: 'Après 10 ans de résidence, demandez la naturalisation',
          timeline: '10 ans',
        },
      ],
    },
    tools: {
      title: 'Outils Spécifiques US/Canada',
      description: 'Ressources spécialisées pour les professionnels américains',
      items: [
        {
          name: 'Comparaison H-1B vs Permis Suisse',
          description: 'Comparez le système de visa de travail américain avec les permis suisses',
          icon: 'compare',
        },
        {
          name: 'Calculateur de Référence Salariale',
          description: 'Calculez un salaire compétitif pour votre rôle et canton',
          icon: 'calculator',
        },
        {
          name: 'Suivi des Quotas',
          description: 'Suivi en temps réel des permis disponibles par canton',
          icon: 'chart',
        },
        {
          name: 'Guide d\'Apostille des Documents',
          description: 'Guide étape par étape pour légaliser les documents américains/canadiens',
          icon: 'file',
        },
      ],
    },
    resources: {
      title: 'Ressources US/Canada',
      description: 'Contenu sélectionné pour les professionnels américains',
      posts: [
        {
          title: 'H-1B vs. Permis L Suisse : Comparaison Complète',
          excerpt: 'Comprendre les différences entre les systèmes de visa de travail américain et suisse',
          category: 'Comparaison',
        },
        {
          title: 'Stratégie de Quotas pour les Professionnels Américains',
          excerpt: 'Comment maximiser vos chances dans le système de quotas compétitif',
          category: 'Stratégie',
        },
        {
          title: 'Négociation Salariale pour les Emplois Suisses',
          excerpt: 'Comment négocier des salaires compétitifs qui répondent aux seuils cantonaux',
          category: 'Carrière',
        },
        {
          title: 'Déménager de NYC à Zurich : Comparaison des Coûts',
          excerpt: 'Planification financière pour les professionnels américains qui déménagent en Suisse',
          category: 'Finance',
        },
        {
          title: 'Parcours de Naturalisation de 10 Ans pour les Américains',
          excerpt: 'Guide complet de la naturalisation pour les citoyens US/Canadiens',
          category: 'Naturalisation',
        },
      ],
    },
  },
  others: {
    hero: {
      tagline: 'Votre Rêve Suisse est Possible - Nous le Rendant Réalité',
      description: 'Le système de quotas est compétitif, mais nous sommes spécialisés dans l\'aide aux ressortissants de pays tiers pour réussir ! Avec notre approche stratégique, nos connaissances internes, nos méthodes éprouvées et notre soutien dédié, nous vous aidons à vous démarquer de la concurrence. Des milliers ont réussi avant vous - d\'Inde, de Chine, du Brésil et de 120+ autres pays. Avec les bons conseils, la préparation et la stratégie, vous pouvez absolument y arriver aussi. Faites-nous confiance pour être votre partenaire à chaque étape. Votre avenir suisse commence ici !',
      cta: 'Commencez Votre Parcours Stratégique',
      stats: [
        { label: 'Délai de Traitement', value: '8-16 Semaines', description: 'Varie selon le pays - nous vous aidons à tout préparer parfaitement' },
        { label: 'Quotas 2025 Restants', value: '2 500/8 500', description: 'Toujours disponibles - nous vous aidons à postuler stratégiquement' },
        { label: 'Taux de Réussite', value: '15-30%', description: 'Avec une approche stratégique - et nous fournissons cette stratégie' },
        { label: 'Traitement par l\'Ambassade', value: 'Varie', description: 'Spécifique au pays - nous vous guidons à travers' },
      ],
    },
    visas: {
      title: 'Options de Visa Pays Tiers',
      description: 'Voies de visa complètes pour les ressortissants non-UE/non-américains',
      types: [
        {
          name: 'Permis L (Court Terme)',
          description: 'Permis temporaire jusqu\'à 12 mois, soumis à des quotas stricts',
          timeline: '8-16 semaines',
          requirements: [
            'Offre d\'emploi d\'un employeur suisse',
            'Salaire répondant aux seuils élevés (CHF 100k+)',
            'Certificats d\'éducation (apostillés)',
            'Disponibilité des quotas (critique)',
            'Justification solide de l\'employeur',
          ],
          applicable: true,
        },
        {
          name: 'Permis B (Séjour)',
          description: 'Permis renouvelable annuellement, quota hautement compétitif',
          timeline: '8-16 semaines',
          requirements: [
            'Titulaire de permis L ou profil exceptionnel',
            'Salaire CHF 100k-120k+',
            'Compétences ou expertise uniques',
            'Disponibilité des quotas',
            'Documentation parfaite',
          ],
          applicable: true,
        },
        {
          name: 'Visa d\'Étudiant',
          description: 'Étudier en Suisse, puis convertir (entrée sans quota)',
          timeline: '4-8 semaines',
          requirements: [
            'Admission universitaire',
            'Preuve de moyens financiers',
            'Assurance maladie',
            'Aucun quota nécessaire',
          ],
          applicable: true,
        },
        {
          name: 'Regroupement Familial',
          description: 'Rejoindre un conjoint ou un membre de la famille avec un permis suisse',
          timeline: '12-16 semaines',
          requirements: [
            'Membre de la famille avec permis valide',
            'Preuve de relation',
            'Moyens financiers',
            'Assurance maladie',
          ],
          applicable: true,
        },
      ],
    },
    process: {
      title: 'Votre Processus d\'Immigration Pays Tiers',
      description: 'Processus complet en 8 étapes avec considérations stratégiques',
      steps: [
        {
          step: 1,
          title: 'Recherche et Stratégie',
          description: 'Identifier le meilleur canton, le timing et l\'approche pour votre profil',
          timeline: '2-4 semaines',
        },
        {
          step: 2,
          title: 'Obtenir une Offre d\'Emploi',
          description: 'Trouvez un employeur prêt à parrainer et à naviguer dans le quota compétitif',
          timeline: 'Variable',
        },
        {
          step: 3,
          title: 'Préparer une Documentation Parfaite',
          description: 'Apostiller tous les certificats, obtenir des références, CV style suisse',
          timeline: '4-8 semaines',
        },
        {
          step: 4,
          title: 'L\'Employeur Dépose la Demande',
          description: 'L\'employeur soumet avec justification solide à l\'autorité cantonale',
          timeline: '1-2 semaines',
        },
        {
          step: 5,
          title: 'Vérification des Quotas',
          description: 'Critique : Le canton vérifie la disponibilité des quotas',
          timeline: '2-4 semaines',
        },
        {
          step: 6,
          title: 'Décision',
          description: 'Approbation ou rejet cantonal (peut inclure un appel)',
          timeline: '8-16 semaines au total',
        },
        {
          step: 7,
          title: 'Traitement par l\'Ambassade',
          description: 'Si approuvé, obtenez le visa de l\'ambassade suisse dans votre pays',
          timeline: '2-6 semaines',
        },
        {
          step: 8,
          title: 'Parcours vers la Naturalisation',
          description: 'Après 10 ans de résidence, demandez la naturalisation',
          timeline: '10 ans',
        },
      ],
    },
    tools: {
      title: 'Outils Spécifiques Pays Tiers',
      description: 'Ressources spécialisées pour les candidats internationaux',
      items: [
        {
          name: 'Suivi des Quotas par Région',
          description: 'Disponibilité des quotas en temps réel par canton et industrie',
          icon: 'chart',
        },
        {
          name: 'Guide de l\'Ambassade par Pays',
          description: 'Trouvez votre ambassade suisse et comprenez les exigences de traitement',
          icon: 'map',
        },
        {
          name: 'Guide de Légalisation des Documents',
          description: 'Guides spécifiques par pays pour apostiller les documents',
          icon: 'file',
        },
        {
          name: 'Calculateur de Timing Stratégique',
          description: 'Calculez le timing optimal de demande basé sur les modèles de quotas',
          icon: 'calendar',
        },
      ],
    },
    resources: {
      title: 'Ressources Pays Tiers',
      description: 'Contenu complet pour les candidats internationaux',
      posts: [
        {
          title: 'Stratégie de Quotas : Maximiser Vos Chances',
          excerpt: 'Comment vous positionner dans le système de quotas compétitif',
          category: 'Stratégie',
        },
        {
          title: 'Traitement par l\'Ambassade par Région',
          excerpt: 'Guide complet des exigences de l\'ambassade suisse par pays',
          category: 'Ambassade',
        },
        {
          title: 'Visa pour les Indiens : Guide Complet',
          excerpt: 'Guide de voie spécialisé pour les professionnels indiens',
          category: 'Spécifique au Pays',
        },
        {
          title: 'Visa pour les Brésiliens : Étape par Étape',
          excerpt: 'Guide complet pour les candidats brésiliens',
          category: 'Spécifique au Pays',
        },
        {
          title: 'Voie Éducative : Étudier Puis Travailler',
          excerpt: 'Comment utiliser l\'éducation suisse comme stratégie d\'entrée sans quota',
          category: 'Voie',
        },
      ],
    },
  },
}





