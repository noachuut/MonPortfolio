import type { Experience, Project } from "@/data/portfolio";

const CUSTOM_PROJECTS_KEY = "portfolio-custom-projects";
const CUSTOM_EXPERIENCES_KEY = "portfolio-custom-experiences";
const PROJECTS_EVENT = "portfolio-projects-updated";
const EXPERIENCES_EVENT = "portfolio-experiences-updated";

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
