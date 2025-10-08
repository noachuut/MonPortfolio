import type {
  Certification,
  Experience,
  Project,
  SkillCategory,
  TechWatchArticle
} from "@/data/portfolio";

const CUSTOM_PROJECTS_KEY = "portfolio-custom-projects";
const CUSTOM_EXPERIENCES_KEY = "portfolio-custom-experiences";
const CUSTOM_SKILLS_KEY = "portfolio-custom-skills";
const CUSTOM_CERTIFICATIONS_KEY = "portfolio-custom-certifications";
const CUSTOM_ARTICLES_KEY = "portfolio-custom-articles";
const HIDDEN_PROJECT_IDS_KEY = "portfolio-hidden-project-ids";
const HIDDEN_EXPERIENCE_IDS_KEY = "portfolio-hidden-experience-ids";
const HIDDEN_SKILL_IDS_KEY = "portfolio-hidden-skill-ids";
const HIDDEN_SKILL_CATEGORY_IDS_KEY = "portfolio-hidden-skill-category-ids";
const HIDDEN_CERTIFICATION_IDS_KEY = "portfolio-hidden-certification-ids";
const HIDDEN_ARTICLE_IDS_KEY = "portfolio-hidden-article-ids";
const SERVER_DATA_VERSION_KEY = "portfolio-server-data-version";
const PROJECTS_EVENT = "portfolio-projects-updated";
const EXPERIENCES_EVENT = "portfolio-experiences-updated";
const SKILLS_EVENT = "portfolio-skills-updated";
const CERTIFICATIONS_EVENT = "portfolio-certifications-updated";
const ARTICLES_EVENT = "portfolio-articles-updated";

const isBrowser = typeof window !== "undefined";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value) as T;
    if (Array.isArray(parsed)) {
      return parsed;
    }

    return fallback;
  } catch (error) {
    console.warn("Impossible d'analyser les données stockées", error);
    return fallback;
  }
};

const safeParseStringArray = (value: string | null) =>
  safeParse<string[]>(value, []);

export const loadCustomProjects = (): Project[] => {
  if (!isBrowser) {
    return [];
  }

  return safeParse<Project[]>(
    window.localStorage.getItem(CUSTOM_PROJECTS_KEY),
    []
  );
};

export const saveCustomProjects = (projects: Project[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(CUSTOM_PROJECTS_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event(PROJECTS_EVENT));
};

export const loadHiddenProjectIds = () => {
  if (!isBrowser) {
    return [] as string[];
  }

  return safeParseStringArray(
    window.localStorage.getItem(HIDDEN_PROJECT_IDS_KEY)
  );
};

export const saveHiddenProjectIds = (ids: string[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(HIDDEN_PROJECT_IDS_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(PROJECTS_EVENT));
};

export const subscribeToProjectUpdates = (callback: () => void) => {
  if (!isBrowser) {
    return () => undefined;
  }

  const handler = () => callback();

  window.addEventListener("storage", handler);
  window.addEventListener(PROJECTS_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(PROJECTS_EVENT, handler);
  };
};

export const loadCustomExperiences = (): Experience[] => {
  if (!isBrowser) {
    return [];
  }

  return safeParse<Experience[]>(
    window.localStorage.getItem(CUSTOM_EXPERIENCES_KEY),
    []
  );
};

export const saveCustomExperiences = (experiences: Experience[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(
    CUSTOM_EXPERIENCES_KEY,
    JSON.stringify(experiences)
  );
  window.dispatchEvent(new Event(EXPERIENCES_EVENT));
};

export const loadHiddenExperienceIds = () => {
  if (!isBrowser) {
    return [] as string[];
  }

  return safeParseStringArray(
    window.localStorage.getItem(HIDDEN_EXPERIENCE_IDS_KEY)
  );
};

export const saveHiddenExperienceIds = (ids: string[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(
    HIDDEN_EXPERIENCE_IDS_KEY,
    JSON.stringify(ids)
  );
  window.dispatchEvent(new Event(EXPERIENCES_EVENT));
};

export const subscribeToExperienceUpdates = (callback: () => void) => {
  if (!isBrowser) {
    return () => undefined;
  }

  const handler = () => callback();

  window.addEventListener("storage", handler);
  window.addEventListener(EXPERIENCES_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EXPERIENCES_EVENT, handler);
  };
};

export const loadCustomSkillCategories = (): SkillCategory[] => {
  if (!isBrowser) {
    return [];
  }

  return safeParse<SkillCategory[]>(
    window.localStorage.getItem(CUSTOM_SKILLS_KEY),
    []
  );
};

export const saveCustomSkillCategories = (categories: SkillCategory[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(
    CUSTOM_SKILLS_KEY,
    JSON.stringify(categories)
  );
  window.dispatchEvent(new Event(SKILLS_EVENT));
};

export const loadHiddenSkillCategoryIds = () => {
  if (!isBrowser) {
    return [] as string[];
  }

  return safeParseStringArray(
    window.localStorage.getItem(HIDDEN_SKILL_CATEGORY_IDS_KEY)
  );
};

export const saveHiddenSkillCategoryIds = (ids: string[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(
    HIDDEN_SKILL_CATEGORY_IDS_KEY,
    JSON.stringify(ids)
  );
  window.dispatchEvent(new Event(SKILLS_EVENT));
};

export const loadHiddenSkillIds = () => {
  if (!isBrowser) {
    return [] as string[];
  }

  return safeParseStringArray(
    window.localStorage.getItem(HIDDEN_SKILL_IDS_KEY)
  );
};

export const saveHiddenSkillIds = (ids: string[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(HIDDEN_SKILL_IDS_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(SKILLS_EVENT));
};

export const subscribeToSkillUpdates = (callback: () => void) => {
  if (!isBrowser) {
    return () => undefined;
  }

  const handler = () => callback();

  window.addEventListener("storage", handler);
  window.addEventListener(SKILLS_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(SKILLS_EVENT, handler);
  };
};

export const loadCustomCertifications = (): Certification[] => {
  if (!isBrowser) {
    return [];
  }

  return safeParse<Certification[]>(
    window.localStorage.getItem(CUSTOM_CERTIFICATIONS_KEY),
    []
  );
};

export const saveCustomCertifications = (items: Certification[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(
    CUSTOM_CERTIFICATIONS_KEY,
    JSON.stringify(items)
  );
  window.dispatchEvent(new Event(CERTIFICATIONS_EVENT));
};

export const loadHiddenCertificationIds = () => {
  if (!isBrowser) {
    return [] as string[];
  }

  return safeParseStringArray(
    window.localStorage.getItem(HIDDEN_CERTIFICATION_IDS_KEY)
  );
};

export const saveHiddenCertificationIds = (ids: string[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(
    HIDDEN_CERTIFICATION_IDS_KEY,
    JSON.stringify(ids)
  );
  window.dispatchEvent(new Event(CERTIFICATIONS_EVENT));
};

export const subscribeToCertificationUpdates = (callback: () => void) => {
  if (!isBrowser) {
    return () => undefined;
  }

  const handler = () => callback();

  window.addEventListener("storage", handler);
  window.addEventListener(CERTIFICATIONS_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(CERTIFICATIONS_EVENT, handler);
  };
};

export const loadCustomArticles = (): TechWatchArticle[] => {
  if (!isBrowser) {
    return [];
  }

  return safeParse<TechWatchArticle[]>(
    window.localStorage.getItem(CUSTOM_ARTICLES_KEY),
    []
  );
};

export const saveCustomArticles = (items: TechWatchArticle[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(CUSTOM_ARTICLES_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(ARTICLES_EVENT));
};

export const loadHiddenArticleIds = () => {
  if (!isBrowser) {
    return [] as string[];
  }

  return safeParseStringArray(
    window.localStorage.getItem(HIDDEN_ARTICLE_IDS_KEY)
  );
};

export const saveHiddenArticleIds = (ids: string[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(HIDDEN_ARTICLE_IDS_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(ARTICLES_EVENT));
};

export const loadServerDataVersion = () => {
  if (!isBrowser) {
    return null;
  }

  return window.localStorage.getItem(SERVER_DATA_VERSION_KEY);
};

export const saveServerDataVersion = (version: string) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(SERVER_DATA_VERSION_KEY, version);
};

export const clearServerDataVersion = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(SERVER_DATA_VERSION_KEY);
};

export const subscribeToArticleUpdates = (callback: () => void) => {
  if (!isBrowser) {
    return () => undefined;
  }

  const handler = () => callback();

  window.addEventListener("storage", handler);
  window.addEventListener(ARTICLES_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(ARTICLES_EVENT, handler);
  };
};
