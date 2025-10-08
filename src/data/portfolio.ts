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
  { id: "certifications", label: "Certifications" },
  { id: "veille", label: "Veille" },
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
    id: "frontend",
    title: "Frontend",
    skills: [
      { id: "react", name: "React", icon: "/images/technologies/react.svg" },
      {
        id: "typescript",
        name: "TypeScript",
        icon: "/images/technologies/typescript.svg"
      },
      {
        id: "tailwind",
        name: "Tailwind CSS",
        icon: "/images/technologies/tailwind.svg"
      }
    ]
  },
  {
    id: "backend",
    title: "Backend",
    skills: [
      { id: "nodejs", name: "Node.js", icon: "/images/technologies/nodejs.svg" },
      { id: "express", name: "Express", icon: "/images/technologies/express.svg" },
      {
        id: "postgresql",
        name: "PostgreSQL",
        icon: "/images/technologies/postgresql.svg"
      }
    ]
  },
  {
    id: "outils",
    title: "Outils",
    skills: [
      { id: "git", name: "Git", icon: "/images/technologies/git.svg" },
      { id: "docker", name: "Docker", icon: "/images/technologies/docker.svg" },
      { id: "figma", name: "Figma", icon: "/images/technologies/figma.svg" }
    ]
  }
];

export const experiences: Experience[] = [
  {
    id: "default-experience-1",
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
  { icon: "🐙", label: "GitHub", link: "https://github.com" },
  { icon: "💼", label: "LinkedIn", link: "https://linkedin.com" }
];

export const certifications: Certification[] = [
  {
    id: "default-certification-1",
    name: "Certification professionnelle",
    description:
      "Ajoutez ici la description de votre certification, son impact et les compétences démontrées.",
    skills: ["Gestion de projet", "Développement web"],
    image: undefined,
    link: "#"
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
