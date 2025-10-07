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
  primaryCta: {
    label: string;
    targetId: string;
  };
  secondaryCta: {
    label: string;
    targetId: string;
  };
};

export type SkillCategory = {
  title: string;
  skills: {
    name: string;
    icon: string;
  }[];
};

export type Experience = {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
  image?: string;
};

export type Project = {
  title: string;
  description: string;
  visual?: string;
  type: string;
  technologies: string[];
  skillHighlight: string;
  github?: string;
  demo?: string;
  primaryLink?: string;
  primaryLinkLabel?: string;
  features: string[];
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
  brand: "Portfolio",
  role: "Développeur Full Stack",
  location: "Nouméa, Nouvelle-Calédonie",
  email: "contact@portfolio.dev"
};

export const navigationLinks: NavigationLink[] = [
  { id: "accueil", label: "Accueil" },
  { id: "competences", label: "Compétences" },
  { id: "experience", label: "Expérience" },
  { id: "projets", label: "Projets" },
  { id: "contact", label: "Contact" }
];

export const heroContent: HeroContent = {
  intro: "Bonjour, je suis",
  name: "Votre Nom",
  highlight: "Développeur Full Stack",
  tagline:
    "Je conçois et développe des solutions web modernes. Remplacez ce texte par les informations provenant de votre portfolio.",
  primaryCta: {
    label: "Voir mes projets",
    targetId: "projets"
  },
  secondaryCta: {
    label: "Me contacter",
    targetId: "contact"
  }
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: "/images/technologies/react.svg" },
      { name: "TypeScript", icon: "/images/technologies/typescript.svg" },
      { name: "Tailwind CSS", icon: "/images/technologies/tailwind.svg" }
    ]
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: "/images/technologies/nodejs.svg" },
      { name: "Express", icon: "/images/technologies/express.svg" },
      { name: "PostgreSQL", icon: "/images/technologies/postgresql.svg" }
    ]
  },
  {
    title: "Outils",
    skills: [
      { name: "Git", icon: "/images/technologies/git.svg" },
      { name: "Docker", icon: "/images/technologies/docker.svg" },
      { name: "Figma", icon: "/images/technologies/figma.svg" }
    ]
  }
];

export const experiences: Experience[] = [
  {
    title: "Votre poste",
    company: "Votre entreprise",
    period: "2023 - Aujourd'hui",
    description:
      "Décrivez votre rôle ici. Remplacez ces informations par celles provenant de votre portfolio.",
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
  { icon: "🐙", label: "GitHub", link: "https://github.com" },
  { icon: "💼", label: "LinkedIn", link: "https://linkedin.com" }
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
  custom: Experience[]
) =>
  dedupeBy<Experience>([...defaults, ...custom], (item) =>
    normalizeKey(`${item.title}-${item.company}`)
  );

/**
 * Fusionne les projets par clef "titre" afin d'éviter les doublons entre le contenu
 * fourni par défaut et les projets ajoutés via l'interface d'administration.
 */
export const mergeProjects = (defaults: Project[], custom: Project[]) =>
  dedupeBy<Project>([...defaults, ...custom], (item) => normalizeKey(item.title));
