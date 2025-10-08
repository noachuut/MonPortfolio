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
  type: "web" | "ia" | "mobile" | "reseaux" | "cli";
  technologies: string[];
  skillHighlight: string;
  github?: string;
  demo?: string;
  primaryLink?: string;
  primaryLinkLabel?: string;
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
      { id: "html", name: "HTML5", icon: "/images/technologies/html5.svg" },
      { id: "css", name: "CSS3", icon: "/images/technologies/css3.svg" },
      {
        id: "javascript",
        name: "JavaScript",
        icon: "/images/technologies/javascript.svg"
      },
      { id: "vaadin", name: "Vaadin", icon: "/images/technologies/vaadin.svg" }
    ]
  },
  {
    id: "backend",
    title: "Backend & Frameworks",
    skills: [
      { id: "java", name: "Java", icon: "/images/technologies/java.svg" },
      {
        id: "spring-boot",
        name: "Spring Boot",
        icon: "/images/technologies/spring-boot.svg"
      },
      { id: "python", name: "Python", icon: "/images/technologies/python.svg" },
      { id: "flask", name: "Flask", icon: "/images/technologies/flask.svg" }
    ]
  },
  {
    id: "outils",
    title: "Outils & Bases de données",
    skills: [
      { id: "docker", name: "Docker", icon: "/images/technologies/docker.svg" },
      { id: "git", name: "Git", icon: "/images/technologies/git.svg" },
      {
        id: "postgresql",
        name: "PostgreSQL",
        icon: "/images/technologies/postgresql.svg"
      }
    ]
  }
];

export const experiences: Experience[] = [
  {
    id: "sio-stage-1",
    title: "Stagiaire développeur",
    company: "DINUM NC – Direction du Numérique (Nouméa)",
    period: "04 novembre 2024 – 06 décembre 2024",
    description:
      "Réalisation d’un POC intégrant NC Connect pour offrir une authentification unifiée (SSO) et faciliter la connexion de fournisseurs de données aux applications internes.",
    technologies: [
      "Python",
      "Flask",
      "NC Connect (SSO)",
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
    id: "default-experience-1",
    title: "Alternant Développeur",
    company: "Votre entreprise",
    period: "2023 - Aujourd'hui",
    description:
      "En tant qu'alternant développeur en BTS SIO SLAM, je participe à la conception et à la maintenance d'applications tout en approfondissant mes compétences.",
    technologies: ["React", "TypeScript", "Node.js"],
    achievements: [
      "Ajoutez vos réalisations clés.",
      "Personnalisez cette liste selon votre expérience.",
      "Importez les détails depuis votre portfolio."
    ],
    image: undefined
  }
];

export const projects: Project[] = [
  {
    id: "default-project-1",
    title: "Nom du projet",
    description:
      "Décrivez ici un projet important. Les données doivent être mises à jour avec le contenu de votre portfolio.",
    visual: undefined,
    type: "web",
    technologies: ["React", "TypeScript"],
    skillHighlight: "React",
    github: "#",
    demo: "#",
    primaryLink: "#",
    primaryLinkLabel: "Voir le projet",
    features: [
      "Première fonctionnalité clé.",
      "Deuxième fonctionnalité clé.",
      "Troisième fonctionnalité clé."
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
    image: "/images/certifications/skills-for-all.svg"
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
    image: "/images/certifications/openclassrooms.svg"
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
    image: "/images/certifications/skills-for-all.svg"
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
    image: "/images/certifications/openclassrooms.svg"
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
    image: "/images/certifications/cisco-netacad.svg"
  },
  {
    id: "openclassrooms-php-mysql",
    name: "Concevez votre site web avec PHP et MySQL — OpenClassrooms",
    description:
      "Formation (≈20h) pour réaliser un site dynamique : PHP côté serveur, MySQL, CRUD, sécurité et bonnes pratiques. Formation suivie (certification non obtenue).",
    skills: ["PHP", "MySQL", "SQL/CRUD", "Sécurité web", "MVC basique"],
    image: "/images/certifications/openclassrooms.svg"
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
    image: "/images/certifications/openclassrooms.svg"
  },
  {
    id: "openclassrooms-spring-boot",
    name: "Créez une application Java avec Spring Boot — OpenClassrooms",
    description:
      "Formation (8–11h réelles) : création d’une API REST avec Spring Boot, persistance JPA/Hibernate et tests. Attestation de suivi.",
    skills: ["Spring Boot", "REST API", "JPA/Hibernate", "Maven", "Tests"],
    image: "/images/certifications/openclassrooms.svg"
  }
];

export const techWatchArticles: TechWatchArticle[] = [
  {
    id: "default-article-1",
    title: "Titre de l'article de veille",
    summary:
      "Présentez ici les points clés de votre veille technologique. Remplacez ce contenu par vos découvertes.",
    image: undefined,
    link: "https://example.com",
    publishedAt: "2024"
  }
];

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
