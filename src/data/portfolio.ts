/**
 * Contenu centralisé du portfolio.
 * Remplacez ces valeurs par celles de https://nmorandeau.btsinfo.nc lorsque vous y avez accès.
 */

export type NavigationLink = {
  id: string;
  label: string;
};

export type HeroContent = {
  intro: string;
  name: string;
  highlight: string;
  tagline: string;
  cvDownload: {
    label: string;
    href: string;
  };
  primaryCta: {
    label: string;
    targetId: string;
  };
  secondaryCta: {
    label: string;
    targetId: string;
  };
};

export type Skill = {
  id: string;
  name: string;
  icon: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  skills: Skill[];
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
  image?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  visual?: string;
  type: "web" | "ia" | "évenements" | "reseaux" | "autres";
  technologies: string[];
  skillHighlight: string;
  github?: string;
  demo?: string;
  primaryLink?: string;
  primaryLinkLabel?: string;
  // When true, hide the primary action button even if a link exists
  hidePrimaryButton?: boolean;
  features: string[];
};

export type Certification = {
  id: string;
  name: string;
  description: string;
  image?: string;
  skills: string[];
  link?: string;
};

export type TechWatchArticle = {
  id: string;
  title: string;
  summary: string;
  image?: string;
  link: string;
  publishedAt?: string;
};

export type SocialPlatform = "youtube" | "tiktok" | "instagram" | "other";

export type SocialAccount = {
  id: string;
  platform: SocialPlatform;
  name: string;
  link: string;
  image?: string;
  description: string;
};

export type TechWatchProfile = {
  dailyDev: {
    description?: string;
    devCardImage?: string; // URL ou data URL de la devCard
    profileLink: "https://app.daily.dev/morandeaunoa";
  };
  socialAccounts: SocialAccount[]; // comptes suivis avec plateforme
  favoriteTopic: {
    title: string;
    content: string;
    image?: string;
  };
};

export type ContactDetail = {
  icon: string;
  title: string;
  value: string;
  link: string;
};

export type SocialLink = {
  icon: string;
  label: string;
  link: string;
};

export const siteMeta = {
  brand: "Noa Morandeau",
  role: "Alternant Développeur",
  location: "Nouméa, Nouvelle-Calédonie",
  email: "noamorandeau@gmail.com"
};

export const navigationLinks: NavigationLink[] = [
  { id: "accueil", label: "Accueil" },
  { id: "competences", label: "Compétences" },
  { id: "experience", label: "Expérience" },
  { id: "projets", label: "Projets" },
  { id: "certifications", label: "Certifications" },
  { id: "veille", label: "Veille" },
  { id: "contact", label: "Contact" }
];

export const heroContent: HeroContent = {
  intro: "Bonjour, je suis",
  name: "Noa Morandeau",
  highlight: "Alternant Développeur",
  tagline:
    "Étudiant en BTS SIO option SLAM, je conçois et développe des solutions adaptées aux besoins métiers tout en consolidant mes compétences techniques.",
  cvDownload: {
    label: "Télécharger mon CV",
    href: "/CV_NOA_MORANDEAU.pdf"
  },
  primaryCta: {
    label: "Voir mes projets",
    targetId: "projets"
  },
  secondaryCta: {
    label: "Me contacter",
    targetId: "contact"
  }
};

export const referentialDownload = {
  label: "Télécharger le référentiel BTS SIO",
  href: "/Noa_MORANDEAU_Referentiel_E4.pdf"
};

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Langages & Frontend",
    skills: [
      { id: "html", name: "HTML5", icon: "/images/technologies/html.png" },
      { id: "css", name: "CSS3", icon: "/images/technologies/css.png" },
      {
        id: "javascript",
        name: "JavaScript",
        icon: "/images/technologies/JS.png"
      },
      { id: "vaadin", name: "Vaadin", icon: "/images/technologies/vaadin.png" }
    ]
  },
  {
    id: "backend",
    title: "Backend & Frameworks",
    skills: [
      { id: "java", name: "Java", icon: "/images/technologies/java.png" },
      {
        id: "spring-boot",
        name: "Spring Boot",
        icon: "/images/technologies/spring-boot.png"
      },
      { id: "python", name: "Python", icon: "/images/technologies/python.png" },
      { id: "flask", name: "Flask", icon: "/images/technologies/flask.png" }
    ]
  },
  {
    id: "outils",
    title: "Outils & Bases de données",
    skills: [
      { id: "docker", name: "Docker", icon: "/images/technologies/docker.png" },
      { id: "git", name: "Git", icon: "/images/technologies/git.png" },
      {
        id: "postgresql",
        name: "PostgreSQL",
        icon: "/images/technologies/postgresql.png"
      }
    ]
  }
];

export const experiences: Experience[] = [
  {
    id: "sio-stage-1",
    title: "Stagiaire développeur",
    company: "DINUM NC – Direction du Numérique et de la modernisation",
    period: "04 novembre 2024 – 06 décembre 2024",
    description:
      "Réalisation d’un POC intégrant NC Connect pour offrir une authentification unifiée (SSO) et faciliter la connexion de fournisseurs de données aux applications internes.",
    technologies: [
      "Python",
      "Flask",
      "NC Connect ",
      "OpenID Connect",
      "JWT",
      "API REST"
    ],
    achievements: [
      "Conception et réalisation d’un POC fonctionnel avec Flask",
      "Intégration de l’authentification unifiée via NC Connect (SSO)",
      "Mise à disposition d’endpoints REST pour l’accès aux données fournisseurs"
    ],
    image: undefined
  },
  {
    id: "opt-alternance",
    title: "Alternant Développeur",
    company: "Office des postes et  télécommunications NC",
    period: "08 janvier - 31 décembre",
    description:
      "Participation à la conception et à l’évolution d’applications internes. réalisation d'un POC IA-Docubase (fiabilisation des données de factures) et travaux de réflexion/POC sur la détection d’anomalies (qualité des données, écarts, doublons, cas atypiques) pour soutenir les équipes métier.",
    technologies: ["Java", "SpringBoot", "SpringBatch", "LLM"],
    achievements: [
      "Réalisation POC IA-Docubase : extraction de champs, rapprochement avec les métadonnées, contrôle/validation.",
      "Conception d’un POC de détection d’anomalies : critères règles-based + pistes statistiques/LLM",
      "Mise en place de jeux de tests et suivi de la qualité des données sur lots de factures."
    ],
    image: undefined
  }
];

export const projects: Project[] = [
  {
    id: "1",
    title: "IA-Docubase",
    description:
      "Docubase automatise le traitement des factures : centralisation, extraction des champs clés (Nom, Prénom, BP, n° de contrat, n° client), comparaison aux métadonnées et signalement des écarts en rouge. Validation/correction rapide, puis mise à jour de la GED avec des données fiables.",
    visual: "/images/projets/docubase.png",
    type: "ia",
    technologies: ["Spring Boot","Spring Batch","Vaadin","Docker"],
    skillHighlight: "Java",
    github: "#",
    demo: "#",
    primaryLink: "#",
    primaryLinkLabel: "Voir le projet",
    features: [
      "Extraire automatiquement les champs clés",
      "Mettre en évidence les écarts avec la GED",
      "Mettre à jour la GED avec les données vérifiées"
    ],
    hidePrimaryButton: true 
  },
  {
    id: "2",
    title: "Cyber EscapeGame",
    description:
      "jeu pédagogique de cybersécurité pour lycéens : propose des parcours d’énigmes chronométrés portées sur la cybersécurité. Classement finale pour mettre en compétitions. Projet de sensibilisation réaliser pour la semaine du Numérique au Lycée Dick Ukeiwe ",
    visual: "/images/projets/escape-game.png",
    type: "web",
    technologies: ["Node.js",  "PostgreSQL", "OpenAPI/Swagger", "HTML,CSS,JavaScript"],
    skillHighlight: "Node.js",
    github: "https://github.com/noachuut/EscapeGame",
    demo: "#",
    primaryLink: "https://escape-game.btsinfo.nc/",
    primaryLinkLabel: "Voir le projet",
    features: [
      "Créer des sessions et gérer les énigmes",
      "Chronométrer les parcours (timer)",
      "Enregistrer la progression et les scores"
    ]
  },
  {
    id: "3",
    title: "Jeu Labyrinthe",
    description:
      "Mini-jeu de labyrinthe en Python (terminal) réalisé en 1ʳᵉ année de BTS SIO. Le joueur doit trouver la sortie en naviguant case par case dans un labyrinthe . le joueur choisis son personnage et a 5 vies pour terminer ce labbyrinthe facile en apparence mais remplis de piège. Un agent vocale est mis a disposition pour lire les consignes.",
    visual: "/images/projets/labyrinthGame.png",
    type: "autres",
    technologies: ["Python"],
    skillHighlight: "POO Python",
    github: "#",
    demo: "#",
    primaryLink: "https://github.com/noachuut/LabyrinthGame",
    primaryLinkLabel: "Voir le Github",
    features: [
      "Déplacements clavier (z q s d) et affichage en temps réel dans le terminal",
      "Création du labyrinthe",
      "Menus avec règles, lancement du jeu et choix du personnage"
    ]
  },
  {
    id: "4",
    title: "TélécabNc - Space4NC",
    description:
      "Space4NC, c’est 24 heures pour prototyper un projet entrepreneurial à impact, en mobilisant les données et technologies spatiales avec l’accompagnement de coachs, d’experts du CNES et de partenaires locaux. Nous avons eu l’honneur de participer à ce hackathon et d’y remporter la première place avec notre projet TélécabNC.",
    visual: "/images/projets/hackathon.webp",
    type: "évenements",
    technologies: ["Travail d'équipe", "Prototypage rapide", "Présentation"],
    skillHighlight: "Innovation",
    github: "#",
    demo: "#",
    primaryLink: "",
    primaryLinkLabel: "Voir le Github",
    features: [
      ""
    ]

  },
  {
    id: "5",
    title: "Hackagou 2024",
    description:
      "Cet événement réunit les passionnés et les curieux du numérique lors d’une journée exceptionnelle, rythmée par des défis de cybersécurité, des conférences inspirantes et des échanges enrichissants avec des professionnels du secteur. Nous y avons participé en équipe et avons remporté le 3ème prix du challenge de cybersécurité dans la catégorie étudiant.",
    visual: "/images/projets/hackagou.jpg",
    type: "évenements",
    technologies: ["Travail d'équipe", "Résolution de problèmes cybersécurité"],
    skillHighlight: "Cybersécurité",
    github: "#",
    demo: "#",
    primaryLink: "",
    primaryLinkLabel: "Voir l'article",
    features: [
      ""
    ]

  }
];

export const contactDetails: ContactDetail[] = [
  {
    icon: "📧",
    title: "Email",
    value: siteMeta.email,
    link: `mailto:${siteMeta.email}`
  },
  {
    icon: "📍",
    title: "Localisation",
    value: siteMeta.location,
    link: "#"
  }
];

export const socialLinks: SocialLink[] = [
  { icon: "github", label: "GitHub", link: "https://github.com/noachuut" },
  { icon: "linkedin", label: "LinkedIn", link: "https://www.linkedin.com/in/noa-morandeau-3122182b7/" }
];

export const certifications: Certification[] = [
  {
    id: "skills-for-all-cybersecurity",
    name: "Introduction à la cybersécurité — Skills for All",
    description:
      "Formation (6h) d’initiation aux fondamentaux de la cybersécurité : risques courants, bonnes pratiques et hygiène numérique. Attestation de suivi (pas de certification officielle).",
    skills: [
      "Cybersécurité de base",
      "Menaces et risques",
      "Bonnes pratiques",
      "Sensibilisation"
    ],
    image: "/images/certifications/cisco.png"
  },
  {
    id: "openclassrooms-comprendre-web",
    name: "Comprendre le Web — OpenClassrooms",
    description:
      "Formation (6h) qui explique le fonctionnement du Web : HTTP, DNS, navigateurs, hébergement et déploiement simple. Attestation de suivi.",
    skills: [
      "HTTP/DNS",
      "Architecture web",
      "Hébergement",
      "Déploiement",
      "Culture web"
    ],
    image: "/images/certifications/openclassrooms.png"
  },
  {
    id: "skills-for-all-networks",
    name: "Notions de base sur les réseaux — Skills for All",
    description:
      "Formation (20h) sur les fondamentaux réseaux : modèles OSI/TCP-IP, adressage IP, commutation/routage de base. Attestation de suivi.",
    skills: [
      "Réseaux",
      "Modèle OSI",
      "TCP/IP",
      "Adressage IP",
      "Routage de base"
    ],
    image: "/images/certifications/cisco.png"
  },
  {
    id: "openclassrooms-html-css",
    name: "Créez votre site web avec HTML5 et CSS3 — OpenClassrooms",
    description:
      "Formation (14h) aux bases du front-end : sémantique HTML5, mise en page CSS (Flexbox/Grid), responsive et accessibilité. Attestation de suivi.",
    skills: [
      "HTML5",
      "CSS3",
      "Responsive design",
      "Flexbox",
      "Grid",
      "Accessibilité"
    ],
    image: "/images/certifications/openclassrooms.png"
  },
  {
    id: "cisco-netacad-linux-unhatched",
    name: "Linux Unhatched — Cisco NetAcad",
    description:
      "Formation (6h) d’initiation à Linux : ligne de commande, arborescence, permissions, gestion de paquets. Attestation de suivi.",
    skills: [
      "Linux",
      "CLI",
      "Bash",
      "Permissions",
      "Paquets logiciels"
    ],
    image: "/images/certifications/cisco.png"
  },
  {
    id: "openclassrooms-php-mysql",
    name: "Concevez votre site web avec PHP et MySQL — OpenClassrooms",
    description:
      "Formation (≈20h) pour réaliser un site dynamique : PHP côté serveur, MySQL, CRUD, sécurité et bonnes pratiques. Formation suivie (certification non obtenue).",
    skills: ["PHP", "MySQL", "SQL/CRUD", "Sécurité web", "MVC basique"],
    image: "/images/certifications/openclassrooms.png"
  },
  {
    id: "openclassrooms-java",
    name: "Apprenez à programmer en Java — OpenClassrooms",
    description:
      "Formation (10h) d’introduction à Java : bases du langage, POO, exceptions, collections et tests simples. Attestation de suivi.",
    skills: [
      "Java",
      "Programmation orientée objet",
      "Exceptions",
      "Collections",
      "Tests"
    ],
    image: "/images/certifications/openclassrooms.png"
  },
  {
    id: "openclassrooms-spring-boot",
    name: "Créez une application Java avec Spring Boot — OpenClassrooms",
    description:
      "Formation (8–11h réelles) : création d’une API REST avec Spring Boot, persistance JPA/Hibernate et tests. Attestation de suivi.",
    skills: ["Spring Boot", "REST API", "JPA/Hibernate", "Maven", "Tests"],
    image: "/images/certifications/openclassrooms.png"
  }
];

export const techWatchArticles: TechWatchArticle[] = [

];

export const defaultTechWatchProfile: TechWatchProfile = {
  dailyDev: {
    description:
      "Daily.dev est une plateforme gratuite et open-source qui centralise l’actu tech. C’est un peu comme un flux RSS, sauf que je n’ai rien à configurer : le contenu vient à moi et devient plus pertinent avec mes clics. J’utilise surtout leur extension Chrome : à chaque nouvel onglet, j’ai ma veille sous les yeux. Je lis direct ou j’enregistre pour plus tard, je choisis mes thèmes… ou je me laisse surprendre.J’aime aussi le côté communauté : les articles sont notés, commentés, et les discussions sont souvent utiles. On peut même afficher une DevCard sur GitHub avec les sujets qu’on a lus. Je n’ai pas encore testé la partie forum/entraide, mais l’idée est de faciliter le partage entre devs.",
    devCardImage: "/images/veille/devcard.png",
    profileLink: "https://app.daily.dev/morandeaunoa"
  },
  socialAccounts: [
    { id: "yt-1", 
      platform: "youtube", 
      name: "Underscore", 
      link: "https://www.youtube.com/@Underscore_", 
      image: "/images/projets/underscore.jpg", 
      description: "Décodage des tendances numériques : enjeux, usages et impacts sans buzz ni raccourcis. Cette chaine youtube, fais énormément d'interview, de vidéos l'actualité numérique (et surtout sur l'Ia) en vulgarisant le plus possible. Très agréable a régarder " 
    },
    { id: "yt-2", 
      platform: "youtube", 
      name: "Tech IA News", 
      link: "https://www.youtube.com/@Tech_IA_news", 
      image: "/images/projets/technews.jpg", 
      description: "C’est une chaîne que je regarde souvent pour rester à jour sur l’actualité de l’intelligence artificielle. J’aime le fait que les vidéos soient claires et sans jargon : on comprend rapidement ce qui change, pourquoi c’est important, et ce que ça implique pour les développeurs. Le format est court, concret, et me permet de suivre les grandes tendances IA sans devoir passer des heures à lire des articles." 
    }

    
  ],
  favoriteTopic: {
    title: "La place de l’IA dans notre quotidien",
    content:
      "Je m’intéresse beaucoup à la façon dont l’intelligence artificielle s’intègre dans nos usages au quotidien. Que ce soit pour automatiser certaines tâches, améliorer la rédaction ou l’analyse de code, ou encore proposer des recommandations plus pertinentes, l’IA transforme peu à peu notre manière de travailler et d’apprendre.C'est un sujet que j'ai choisis dû aux misions qui m'ont été confiées en alternance, toutes ce porter sur l'IA, j'ai donc du me former et c'est un sujet qui m'a séduis par son évolution constante. Ce qui me passionne, c’est de comprendre comment ces outils fonctionnent et jusqu’où ils peuvent nous aider sans remplacer la réflexion humaine. À travers ma veille, j’essaie de rester attentif aux enjeux éthiques et techniques : les biais, la sécurité des données, la conformité RGPD ou encore l’impact sur nos métiers.Cette approche me permet de garder un regard critique, d’expérimenter les nouveaux outils avec recul, et de choisir ceux qui apportent une vraie valeur ajoutée selon les besoins réels d’un projet.",
    image: undefined
  }
};

const normalizeKey = (value: string) => value.trim().toLowerCase();

const dedupeBy = <T>(items: T[], getKey: (item: T) => string) => {
  const map = new Map<string, T>();

  items.forEach((item) => {
    const key = getKey(item);

    if (!key) {
      return;
    }

    map.set(key, item);
  });

  return Array.from(map.values());
};

/**
 * Fusionne les expériences par clef "poste + entreprise" en privilégiant les entrées
 * personnalisées lorsqu'elles existent déjà côté vitrine.
 */
export const mergeExperiences = (
  defaults: Experience[],
  custom: Experience[],
  hiddenIds: string[] = []
) =>
  dedupeBy<Experience>([...defaults, ...custom], (item) => item.id).filter(
    (item) => !hiddenIds.includes(item.id)
  );

/**
 * Fusionne les projets par clef "titre" afin d'éviter les doublons entre le contenu
 * fourni par défaut et les projets ajoutés via l'interface d'administration.
 */
export const mergeProjects = (
  defaults: Project[],
  custom: Project[],
  hiddenIds: string[] = []
) =>
  dedupeBy<Project>([...defaults, ...custom], (item) => item.id).filter(
    (item) => !hiddenIds.includes(item.id)
  );

export const mergeSkillCategories = (
  defaults: SkillCategory[],
  custom: SkillCategory[],
  hiddenCategoryIds: string[] = [],
  hiddenSkillIds: string[] = []
) =>
  dedupeBy<SkillCategory>([...defaults, ...custom], (item) => item.id)
    .filter((category) => !hiddenCategoryIds.includes(category.id))
    .map((category) => ({
      ...category,
      skills: category.skills.filter(
        (skill) => !hiddenSkillIds.includes(skill.id)
      )
    }));

export const mergeCertifications = (
  defaults: Certification[],
  custom: Certification[],
  hiddenIds: string[] = []
) =>
  dedupeBy<Certification>([...defaults, ...custom], (item) => item.id).filter(
    (item) => !hiddenIds.includes(item.id)
  );

export const mergeTechWatchArticles = (
  defaults: TechWatchArticle[],
  custom: TechWatchArticle[],
  hiddenIds: string[] = []
) =>
  dedupeBy<TechWatchArticle>([...defaults, ...custom], (item) => item.id).filter(
    (item) => !hiddenIds.includes(item.id)
  );
