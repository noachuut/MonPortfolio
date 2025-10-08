import type {
  Certification,
  Experience,
  Project,
  SkillCategory,
  TechWatchArticle
} from "@/data/portfolio";
import {
  loadCustomArticles,
  loadCustomCertifications,
  loadCustomExperiences,
  loadCustomProjects,
  loadCustomSkillCategories,
  loadHiddenArticleIds,
  loadHiddenCertificationIds,
  loadHiddenExperienceIds,
  loadHiddenProjectIds,
  loadHiddenSkillCategoryIds,
  loadHiddenSkillIds,
  loadServerDataVersion,
  saveCustomArticles,
  saveCustomCertifications,
  saveCustomExperiences,
  saveCustomProjects,
  saveCustomSkillCategories,
  saveHiddenArticleIds,
  saveHiddenCertificationIds,
  saveHiddenExperienceIds,
  saveHiddenProjectIds,
  saveHiddenSkillCategoryIds,
  saveHiddenSkillIds,
  saveServerDataVersion
} from "@/lib/portfolioStorage";

const SCHEMA_VERSION = 1;

type BaseSnapshot = {
  schemaVersion: number;
  version: string;
  exportedAt: string;
  projects: Project[];
  hiddenProjectIds: string[];
  experiences: Experience[];
  hiddenExperienceIds: string[];
  skillCategories: SkillCategory[];
  hiddenSkillCategoryIds: string[];
  hiddenSkillIds: string[];
  certifications: Certification[];
  hiddenCertificationIds: string[];
  techWatchArticles: TechWatchArticle[];
  hiddenArticleIds: string[];
};

export type PortfolioSnapshot = BaseSnapshot & {
  source?: string;
  note?: string;
};

const ensureStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
};

const ensureProjectArray = (value: unknown): Project[] =>
  Array.isArray(value) ? (value as Project[]) : [];

const ensureExperienceArray = (value: unknown): Experience[] =>
  Array.isArray(value) ? (value as Experience[]) : [];

const ensureSkillCategoryArray = (value: unknown): SkillCategory[] =>
  Array.isArray(value) ? (value as SkillCategory[]) : [];

const ensureCertificationArray = (value: unknown): Certification[] =>
  Array.isArray(value) ? (value as Certification[]) : [];

const ensureArticleArray = (value: unknown): TechWatchArticle[] =>
  Array.isArray(value) ? (value as TechWatchArticle[]) : [];

export const createPortfolioSnapshot = (): PortfolioSnapshot => {
  const now = new Date().toISOString();

  return {
    schemaVersion: SCHEMA_VERSION,
    version: now,
    exportedAt: now,
    source: "admin",
    note: "Export généré depuis l'interface d'administration",
    projects: loadCustomProjects(),
    hiddenProjectIds: loadHiddenProjectIds(),
    experiences: loadCustomExperiences(),
    hiddenExperienceIds: loadHiddenExperienceIds(),
    skillCategories: loadCustomSkillCategories(),
    hiddenSkillCategoryIds: loadHiddenSkillCategoryIds(),
    hiddenSkillIds: loadHiddenSkillIds(),
    certifications: loadCustomCertifications(),
    hiddenCertificationIds: loadHiddenCertificationIds(),
    techWatchArticles: loadCustomArticles(),
    hiddenArticleIds: loadHiddenArticleIds()
  };
};

export const normalizePortfolioSnapshot = (
  input: unknown
): PortfolioSnapshot | null => {
  if (!input || typeof input !== "object") {
    return null;
  }

  const data = input as Record<string, unknown>;
  const rawVersion = data.version;
  const version =
    typeof rawVersion === "string" && rawVersion.trim().length > 0
      ? rawVersion
      : new Date().toISOString();

  const exportedAtRaw = data.exportedAt;
  const exportedAt =
    typeof exportedAtRaw === "string" && exportedAtRaw.trim().length > 0
      ? exportedAtRaw
      : version;

  const schemaVersionRaw = data.schemaVersion;
  const schemaVersion =
    typeof schemaVersionRaw === "number" && Number.isFinite(schemaVersionRaw)
      ? schemaVersionRaw
      : SCHEMA_VERSION;

  const snapshot: PortfolioSnapshot = {
    schemaVersion,
    version,
    exportedAt,
    source: typeof data.source === "string" ? data.source : undefined,
    note: typeof data.note === "string" ? data.note : undefined,
    projects: ensureProjectArray(data.projects),
    hiddenProjectIds: ensureStringArray(data.hiddenProjectIds),
    experiences: ensureExperienceArray(data.experiences),
    hiddenExperienceIds: ensureStringArray(data.hiddenExperienceIds),
    skillCategories: ensureSkillCategoryArray(data.skillCategories),
    hiddenSkillCategoryIds: ensureStringArray(data.hiddenSkillCategoryIds),
    hiddenSkillIds: ensureStringArray(data.hiddenSkillIds),
    certifications: ensureCertificationArray(data.certifications),
    hiddenCertificationIds: ensureStringArray(data.hiddenCertificationIds),
    techWatchArticles: ensureArticleArray(
      data.techWatchArticles ?? data.articles
    ),
    hiddenArticleIds: ensureStringArray(data.hiddenArticleIds)
  };

  return snapshot;
};

export const applyPortfolioSnapshot = (snapshot: PortfolioSnapshot) => {
  saveCustomProjects(snapshot.projects);
  saveHiddenProjectIds(snapshot.hiddenProjectIds);
  saveCustomExperiences(snapshot.experiences);
  saveHiddenExperienceIds(snapshot.hiddenExperienceIds);
  saveCustomSkillCategories(snapshot.skillCategories);
  saveHiddenSkillCategoryIds(snapshot.hiddenSkillCategoryIds);
  saveHiddenSkillIds(snapshot.hiddenSkillIds);
  saveCustomCertifications(snapshot.certifications);
  saveHiddenCertificationIds(snapshot.hiddenCertificationIds);
  saveCustomArticles(snapshot.techWatchArticles);
  saveHiddenArticleIds(snapshot.hiddenArticleIds);
  saveServerDataVersion(snapshot.version);
};

export const hasAppliedSnapshotVersion = (version: string | null) => {
  if (!version) {
    return false;
  }

  return loadServerDataVersion() === version;
};

