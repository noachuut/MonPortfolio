import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  certifications as defaultCertifications,
  experiences as defaultExperiences,
  projects as defaultProjects,
  skillCategories as defaultSkillCategories,
  techWatchArticles as defaultArticles,
  defaultTechWatchProfile,
  type Certification,
  type Experience,
  type Project,
  type Skill,
  type SkillCategory,
  type TechWatchArticle,
  type TechWatchProfile,
  type SocialPlatform
} from "@/data/portfolio";
import {
  loadCustomArticles,
  loadCustomCertifications,
  loadCustomExperiences,
  loadCustomProjects,
  loadCustomSkillCategories,
  loadCustomTechWatchProfile,
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
  saveCustomTechWatchProfile,
  saveHiddenArticleIds,
  saveHiddenCertificationIds,
  saveHiddenExperienceIds,
  saveHiddenProjectIds,
  saveHiddenSkillCategoryIds,
  saveHiddenSkillIds,
  subscribeToTechWatchProfileUpdates
} from "@/lib/portfolioStorage";
import { resizeImageFile } from "@/lib/image";
import {
  applyPortfolioSnapshot,
  createPortfolioSnapshot,
  normalizePortfolioSnapshot
} from "@/lib/portfolioSnapshot";
import { syncServerData } from "@/lib/serverSync";

const projectTypeOptions: { value: Project["type"]; label: string }[] = [
  { value: "web", label: "Web" },
  { value: "ia", label: "IA" },
  { value: "évenements", label: "Evenements" },
  { value: "reseaux", label: "Réseaux" },
  { value: "autres", label: "Autres" }
];

const generateId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

const parseCommaSeparated = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const mergeById = <T extends { id: string }>(defaults: T[], custom: T[]) => {
  const map = new Map<string, T>();
  defaults.forEach((item) => map.set(item.id, item));
  custom.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
};

type ProjectFormState = {
  id: string | null;
  title: string;
  description: string;
  type: Project["type"];
  technologies: string;
  skillHighlight: string;
  github: string;
  demo: string;
  primaryLink: string;
  primaryLinkLabel: string;
  features: string;
  visual?: string;
};

type ExperienceFormState = {
  id: string | null;
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string;
  achievements: string;
  image?: string;
};

type CategoryFormState = {
  id: string | null;
  title: string;
};

type SkillFormState = {
  id: string | null;
  categoryId: string;
  name: string;
  icon: string;
};

type CertificationFormState = {
  id: string | null;
  name: string;
  description: string;
  skills: string;
  link: string;
  image?: string;
};

type ArticleFormState = {
  id: string | null;
  title: string;
  summary: string;
  link: string;
  publishedAt: string;
  image?: string;
};

const emptyProjectForm: ProjectFormState = {
  id: null,
  title: "",
  description: "",
  type: "web",
  technologies: "",
  skillHighlight: "",
  github: "",
  demo: "",
  primaryLink: "",
  primaryLinkLabel: "Voir le projet",
  features: "",
  visual: undefined
};

const emptyExperienceForm: ExperienceFormState = {
  id: null,
  title: "",
  company: "",
  period: "",
  description: "",
  technologies: "",
  achievements: "",
  image: undefined
};

const emptyCategoryForm: CategoryFormState = {
  id: null,
  title: ""
};

const emptySkillForm: SkillFormState = {
  id: null,
  categoryId: "",
  name: "",
  icon: ""
};

const emptyCertificationForm: CertificationFormState = {
  id: null,
  name: "",
  description: "",
  skills: "",
  link: "",
  image: undefined
};

const emptyArticleForm: ArticleFormState = {
  id: null,
  title: "",
  summary: "",
  link: "",
  publishedAt: "",
  image: undefined
};

type TechWatchAccountForm = {
  id: string | null;
  platform: SocialPlatform;
  name: string;
  link: string;
  description: string;
  image?: string;
};

const emptyTechWatchAccountForm: TechWatchAccountForm = {
  id: null,
  platform: "youtube",
  name: "",
  link: "",
  description: "",
  image: undefined
};

const Admin = () => {
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [serverVersion, setServerVersion] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const formattedServerVersion = useMemo(() => {
    if (!serverVersion) {
      return "Aucune synchronisation enregistrée";
    }

    const parsed = new Date(serverVersion);

    if (Number.isNaN(parsed.getTime())) {
      return serverVersion;
    }

    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(parsed);
  }, [serverVersion]);

  const [projectForm, setProjectForm] = useState<ProjectFormState>(
    emptyProjectForm
  );
  const [experienceForm, setExperienceForm] =
    useState<ExperienceFormState>(emptyExperienceForm);
  const [categoryForm, setCategoryForm] =
    useState<CategoryFormState>(emptyCategoryForm);
  const [skillForm, setSkillForm] = useState<SkillFormState>(emptySkillForm);
  const [certificationForm, setCertificationForm] = useState<
    CertificationFormState
  >(emptyCertificationForm);
  const [articleForm, setArticleForm] =
    useState<ArticleFormState>(emptyArticleForm);

  const [customProjects, setCustomProjects] = useState<Project[]>([]);
  const [hiddenProjectIds, setHiddenProjectIds] = useState<string[]>([]);
  const [customExperiences, setCustomExperiences] = useState<Experience[]>([]);
  const [hiddenExperienceIds, setHiddenExperienceIds] = useState<string[]>([]);
  const [customSkillCategories, setCustomSkillCategories] =
    useState<SkillCategory[]>([]);
  const [hiddenSkillCategoryIds, setHiddenSkillCategoryIds] = useState<
    string[]
  >([]);
  const [hiddenSkillIds, setHiddenSkillIds] = useState<string[]>([]);
  const [customCertifications, setCustomCertifications] =
    useState<Certification[]>([]);
  const [hiddenCertificationIds, setHiddenCertificationIds] = useState<
    string[]
  >([]);
  const [customArticles, setCustomArticles] = useState<TechWatchArticle[]>([]);
  const [hiddenArticleIds, setHiddenArticleIds] = useState<string[]>([]);
  const [techProfile, setTechProfile] = useState<TechWatchProfile>(
    defaultTechWatchProfile
  );
  const [accountForm, setAccountForm] = useState<TechWatchAccountForm>(
    emptyTechWatchAccountForm
  );

  useEffect(() => {
    setCustomProjects(loadCustomProjects());
    setHiddenProjectIds(loadHiddenProjectIds());
    setCustomExperiences(loadCustomExperiences());
    setHiddenExperienceIds(loadHiddenExperienceIds());
    setCustomSkillCategories(loadCustomSkillCategories());
    setHiddenSkillCategoryIds(loadHiddenSkillCategoryIds());
    setHiddenSkillIds(loadHiddenSkillIds());
    setCustomCertifications(loadCustomCertifications());
    setHiddenCertificationIds(loadHiddenCertificationIds());
    setCustomArticles(loadCustomArticles());
    setHiddenArticleIds(loadHiddenArticleIds());
    setServerVersion(loadServerDataVersion());
    const customProfile = loadCustomTechWatchProfile();
    setTechProfile({
      ...defaultTechWatchProfile,
      ...(customProfile || {})
    });

    const unsubTech = subscribeToTechWatchProfileUpdates(() => {
      const cp = loadCustomTechWatchProfile();
      setTechProfile({ ...defaultTechWatchProfile, ...(cp || {}) });
    });
    return () => {
      unsubTech();
    };
  }, []);

  const refreshFromStorage = () => {
    setCustomProjects(loadCustomProjects());
    setHiddenProjectIds(loadHiddenProjectIds());
    setCustomExperiences(loadCustomExperiences());
    setHiddenExperienceIds(loadHiddenExperienceIds());
    setCustomSkillCategories(loadCustomSkillCategories());
    setHiddenSkillCategoryIds(loadHiddenSkillCategoryIds());
    setHiddenSkillIds(loadHiddenSkillIds());
    setCustomCertifications(loadCustomCertifications());
    setHiddenCertificationIds(loadHiddenCertificationIds());
    setCustomArticles(loadCustomArticles());
    setHiddenArticleIds(loadHiddenArticleIds());
    setServerVersion(loadServerDataVersion());
    const cp = loadCustomTechWatchProfile();
    setTechProfile({ ...defaultTechWatchProfile, ...(cp || {}) });
  };

  const allProjects = useMemo(
    () => mergeById(defaultProjects, customProjects),
    [customProjects]
  );
  const allExperiences = useMemo(
    () => mergeById(defaultExperiences, customExperiences),
    [customExperiences]
  );
  const allSkillCategories = useMemo(
    () => mergeById(defaultSkillCategories, customSkillCategories),
    [customSkillCategories]
  );
  const allCertifications = useMemo(
    () => mergeById(defaultCertifications, customCertifications),
    [customCertifications]
  );
  const allArticles = useMemo(
    () => mergeById(defaultArticles, customArticles),
    [customArticles]
  );

  const resetProjectForm = () => setProjectForm(emptyProjectForm);
  const resetExperienceForm = () => setExperienceForm(emptyExperienceForm);
  const resetCategoryForm = () => setCategoryForm(emptyCategoryForm);
  const resetSkillForm = () => setSkillForm(emptySkillForm);
  const resetCertificationForm = () =>
    setCertificationForm(emptyCertificationForm);
  const resetArticleForm = () => setArticleForm(emptyArticleForm);

  const upsertCustomProjects = (items: Project[]) => {
    setCustomProjects(items);
    saveCustomProjects(items);
  };

  const upsertHiddenProjects = (ids: string[]) => {
    setHiddenProjectIds(ids);
    saveHiddenProjectIds(ids);
  };

  const upsertCustomExperiences = (items: Experience[]) => {
    setCustomExperiences(items);
    saveCustomExperiences(items);
  };

  const upsertHiddenExperiences = (ids: string[]) => {
    setHiddenExperienceIds(ids);
    saveHiddenExperienceIds(ids);
  };

  const upsertCustomSkillCategories = (items: SkillCategory[]) => {
    setCustomSkillCategories(items);
    saveCustomSkillCategories(items);
  };

  const upsertHiddenSkillCategories = (ids: string[]) => {
    setHiddenSkillCategoryIds(ids);
    saveHiddenSkillCategoryIds(ids);
  };

  const upsertHiddenSkills = (ids: string[]) => {
    setHiddenSkillIds(ids);
    saveHiddenSkillIds(ids);
  };

  const upsertCustomCertifications = (items: Certification[]) => {
    setCustomCertifications(items);
    saveCustomCertifications(items);
  };

  const upsertHiddenCertifications = (ids: string[]) => {
    setHiddenCertificationIds(ids);
    saveHiddenCertificationIds(ids);
  };

  const upsertCustomArticles = (items: TechWatchArticle[]) => {
    setCustomArticles(items);
    saveCustomArticles(items);
  };

  const upsertHiddenArticles = (ids: string[]) => {
    setHiddenArticleIds(ids);
    saveHiddenArticleIds(ids);
  };

  const handleSnapshotExport = () => {
    try {
      const snapshot = createPortfolioSnapshot();
      const json = JSON.stringify(snapshot, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const safeTimestamp = snapshot.version.replace(/[:.]/g, "-");
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `portfolio-data-${safeTimestamp}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);

      toast({
        title: "Export prêt",
        description:
          "Le fichier JSON contient vos ajouts et peut être déposé dans public/data/portfolio-data.json."
      });
    } catch (error) {
      console.error("Export impossible", error);
      toast({
        title: "Échec de l'export",
        description:
          "Le fichier n'a pas pu être généré. Réessayez ou contactez l'administrateur.",
        variant: "destructive"
      });
    }
  };

  const handleSnapshotImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const payload = JSON.parse(text) as unknown;
      const snapshot = normalizePortfolioSnapshot(payload);

      if (!snapshot) {
        throw new Error("Fichier invalide");
      }

      applyPortfolioSnapshot(snapshot);
      refreshFromStorage();

      toast({
        title: "Import terminé",
        description: "Les données ont été chargées depuis le fichier sélectionné."
      });
    } catch (error) {
      console.error("Import impossible", error);
      toast({
        title: "Impossible de lire le fichier",
        description:
          "Vérifiez que le JSON provient bien de l'export de l'admin avant de réessayer.",
        variant: "destructive"
      });
    } finally {
      event.target.value = "";
    }
  };

  const openImportDialog = () => {
    fileInputRef.current?.click();
  };

  const handleServerResync = async () => {
    if (isSyncing) {
      return;
    }

    setIsSyncing(true);

    try {
      const result = await syncServerData();
      refreshFromStorage();

      if (result.status === "missing") {
        toast({
          title: "Aucun fichier trouvé",
          description:
            "Déposez un fichier public/data/portfolio-data.json sur le serveur pour partager vos modifications."
        });
        return;
      }

      if (result.status === "updated") {
        toast({
          title: "Contenu synchronisé",
          description: "La vitrine reflète désormais les données du fichier serveur."
        });
        return;
      }

      toast({
        title: "Déjà à jour",
        description: "Les données locales correspondent déjà à la dernière version disponible."
      });
    } catch (error) {
      toast({
        title: "Synchronisation impossible",
        description:
          "Le fichier n'a pas pu être chargé. Vérifiez son accessibilité ou réessayez plus tard.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Tech Watch profile handlers
  const handleDevcardImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImageFile(file, 1024, 1024);
    setTechProfile((prev) => ({
      ...prev,
      dailyDev: { ...prev.dailyDev, devCardImage: dataUrl }
    }));
  };

  const handleFavoriteImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImageFile(file, 1400, 900);
    setTechProfile((prev) => ({
      ...prev,
      favoriteTopic: { ...prev.favoriteTopic, image: dataUrl }
    }));
  };

  const handleAccountImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImageFile(file, 400, 400);
    setAccountForm((prev) => ({ ...prev, image: dataUrl }));
  };

  const addSocialAccount = () => {
    if (!accountForm.name.trim() || !accountForm.link.trim()) {
      toast({
        title: "Champs requis",
        description: "Renseignez au moins le nom et le lien.",
        variant: "destructive"
      });
      return;
    }
    const id = accountForm.id ?? generateId("tw-acc");
    setTechProfile((prev) => ({
      ...prev,
      socialAccounts: [
        ...prev.socialAccounts.filter((a) => a.id !== id),
        {
          id,
          platform: accountForm.platform,
          name: accountForm.name.trim(),
          link: accountForm.link.trim(),
          description: accountForm.description.trim(),
          image: accountForm.image
        }
      ]
    }));
    setAccountForm(emptyTechWatchAccountForm);
  };

  const editSocialAccount = (id: string) => {
    const acc = techProfile.socialAccounts.find((a) => a.id === id);
    if (!acc) return;
    setAccountForm({
      id: acc.id,
      platform: acc.platform,
      name: acc.name,
      link: acc.link,
      description: acc.description,
      image: acc.image
    });
  };

  const removeSocialAccount = (id: string) => {
    setTechProfile((prev) => ({
      ...prev,
      socialAccounts: prev.socialAccounts.filter((a) => a.id !== id)
    }));
  };

  const saveTechWatchProfile = () => {
    saveCustomTechWatchProfile(techProfile);
    toast({ title: "Profil de veille enregistré" });
  };

  const handleProjectSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const technologies = parseCommaSeparated(projectForm.technologies);
    const features = parseLines(projectForm.features);
    const skillHighlight =
      projectForm.skillHighlight.trim() || technologies[0] || "Compétence";
    const primaryLink =
      projectForm.primaryLink.trim() ||
      projectForm.demo.trim() ||
      projectForm.github.trim();

    if (!primaryLink) {
      toast({
        title: "Lien requis",
        description:
          "Ajoutez au moins un lien (démo, dépôt ou lien principal) pour le projet.",
        variant: "destructive"
      });
      return;
    }

    const projectId = projectForm.id ?? generateId("custom-project");
    const updatedProject: Project = {
      id: projectId,
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      type: projectForm.type,
      technologies,
      skillHighlight,
      github: projectForm.github.trim() || undefined,
      demo: projectForm.demo.trim() || undefined,
      primaryLink,
      primaryLinkLabel:
        projectForm.primaryLinkLabel.trim() || "Voir le projet",
      features: features.length > 0 ? features : ["Fonctionnalité à décrire"],
      visual: projectForm.visual
    };

    const nextProjects = [
      ...customProjects.filter((item) => item.id !== projectId),
      updatedProject
    ];

    upsertCustomProjects(nextProjects);
    upsertHiddenProjects(hiddenProjectIds.filter((id) => id !== projectId));
    resetProjectForm();

    toast({
      title: "Projet sauvegardé",
      description: "Le projet sera visible dans la section publique."
    });
  };

  const handleExperienceSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const technologies = parseCommaSeparated(experienceForm.technologies);
    const achievements = parseLines(experienceForm.achievements);

    const experienceId =
      experienceForm.id ?? generateId("custom-experience");

    const updatedExperience: Experience = {
      id: experienceId,
      title: experienceForm.title.trim(),
      company: experienceForm.company.trim(),
      period: experienceForm.period.trim(),
      description: experienceForm.description.trim(),
      technologies,
      achievements:
        achievements.length > 0
          ? achievements
          : ["Réalisations à détailler"],
      image: experienceForm.image
    };

    const nextExperiences = [
      ...customExperiences.filter((item) => item.id !== experienceId),
      updatedExperience
    ];

    upsertCustomExperiences(nextExperiences);
    upsertHiddenExperiences(
      hiddenExperienceIds.filter((id) => id !== experienceId)
    );
    resetExperienceForm();

    toast({
      title: "Expérience sauvegardée",
      description: "Votre expérience est prête à être affichée."
    });
  };

  const handleProjectImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const resized = await resizeImageFile(file);
      setProjectForm((previous) => ({ ...previous, visual: resized }));
      toast({
        title: "Image projet prête",
        description: "L'image a été redimensionnée et ajoutée au projet."
      });
    } catch (error) {
      toast({
        title: "Erreur d'image",
        description:
          "Impossible de traiter cette image. Réessayez avec un autre fichier.",
        variant: "destructive"
      });
    }
  };

  const handleExperienceImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const resized = await resizeImageFile(file);
      setExperienceForm((previous) => ({ ...previous, image: resized }));
      toast({
        title: "Image expérience prête",
        description: "L'image a été redimensionnée et ajoutée à l'expérience."
      });
    } catch (error) {
      toast({
        title: "Erreur d'image",
        description:
          "Impossible de traiter cette image. Réessayez avec un autre fichier.",
        variant: "destructive"
      });
    }
  };

  const handleCertificationImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const resized = await resizeImageFile(file);
      setCertificationForm((previous) => ({ ...previous, image: resized }));
      toast({
        title: "Image certification prête",
        description:
          "L'image a été redimensionnée et ajoutée à la certification."
      });
    } catch (error) {
      toast({
        title: "Erreur d'image",
        description:
          "Impossible de traiter cette image. Réessayez avec un autre fichier.",
        variant: "destructive"
      });
    }
  };

  const handleArticleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const resized = await resizeImageFile(file);
      setArticleForm((previous) => ({ ...previous, image: resized }));
      toast({
        title: "Image article prête",
        description: "L'image a été redimensionnée et ajoutée à l'article."
      });
    } catch (error) {
      toast({
        title: "Erreur d'image",
        description:
          "Impossible de traiter cette image. Réessayez avec un autre fichier.",
        variant: "destructive"
      });
    }
  };

  const editProject = (project: Project) => {
    setProjectForm({
      id: project.id,
      title: project.title,
      description: project.description,
      type: project.type,
      technologies: project.technologies.join(", "),
      skillHighlight: project.skillHighlight,
      github: project.github ?? "",
      demo: project.demo ?? "",
      primaryLink: project.primaryLink ?? project.demo ?? project.github ?? "",
      primaryLinkLabel: project.primaryLinkLabel ?? "Voir le projet",
      features: project.features.join("\n"),
      visual: project.visual
    });
  };

  const editExperience = (experience: Experience) => {
    setExperienceForm({
      id: experience.id,
      title: experience.title,
      company: experience.company,
      period: experience.period,
      description: experience.description,
      technologies: experience.technologies.join(", "),
      achievements: experience.achievements.join("\n"),
      image: experience.image
    });
  };

  const editCategory = (category: SkillCategory) => {
    setCategoryForm({
      id: category.id,
      title: category.title
    });
  };

  const editSkill = (skill: Skill, categoryId: string) => {
    setSkillForm({
      id: skill.id,
      categoryId,
      name: skill.name,
      icon: skill.icon
    });
  };

  const editCertification = (item: Certification) => {
    setCertificationForm({
      id: item.id,
      name: item.name,
      description: item.description,
      skills: item.skills.join(", "),
      link: item.link ?? "",
      image: item.image
    });
  };

  const editArticle = (item: TechWatchArticle) => {
    setArticleForm({
      id: item.id,
      title: item.title,
      summary: item.summary,
      link: item.link,
      publishedAt: item.publishedAt ?? "",
      image: item.image
    });
  };

  const removeProject = (project: Project) => {
    const isDefault = defaultProjects.some((item) => item.id === project.id);
    const nextCustom = customProjects.filter((item) => item.id !== project.id);
    upsertCustomProjects(nextCustom);

    if (isDefault) {
      const nextHidden = hiddenProjectIds.includes(project.id)
        ? hiddenProjectIds
        : [...hiddenProjectIds, project.id];
      upsertHiddenProjects(nextHidden);
    } else {
      upsertHiddenProjects(hiddenProjectIds.filter((id) => id !== project.id));
    }

    if (projectForm.id === project.id) {
      resetProjectForm();
    }

    toast({ title: "Projet supprimé" });
  };

  const restoreProject = (projectId: string) => {
    upsertHiddenProjects(hiddenProjectIds.filter((id) => id !== projectId));
    toast({ title: "Projet restauré" });
  };

  const removeExperience = (experience: Experience) => {
    const isDefault = defaultExperiences.some(
      (item) => item.id === experience.id
    );
    const nextCustom = customExperiences.filter(
      (item) => item.id !== experience.id
    );
    upsertCustomExperiences(nextCustom);

    if (isDefault) {
      const nextHidden = hiddenExperienceIds.includes(experience.id)
        ? hiddenExperienceIds
        : [...hiddenExperienceIds, experience.id];
      upsertHiddenExperiences(nextHidden);
    } else {
      upsertHiddenExperiences(
        hiddenExperienceIds.filter((id) => id !== experience.id)
      );
    }

    if (experienceForm.id === experience.id) {
      resetExperienceForm();
    }

    toast({ title: "Expérience supprimée" });
  };

  const restoreExperience = (experienceId: string) => {
    upsertHiddenExperiences(
      hiddenExperienceIds.filter((id) => id !== experienceId)
    );
    toast({ title: "Expérience restaurée" });
  };

  const handleCategorySubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!categoryForm.title.trim()) {
      toast({
        title: "Titre requis",
        description: "Saisissez un titre pour la catégorie.",
        variant: "destructive"
      });
      return;
    }

    const categoryId = categoryForm.id ?? generateId("skill-category");
    const baseCategory =
      customSkillCategories.find((item) => item.id === categoryId) ||
      defaultSkillCategories.find((item) => item.id === categoryId);

    const updatedCategory: SkillCategory = {
      id: categoryId,
      title: categoryForm.title.trim(),
      skills: baseCategory ? [...baseCategory.skills] : []
    };

    const nextCategories = [
      ...customSkillCategories.filter((item) => item.id !== categoryId),
      updatedCategory
    ];

    upsertCustomSkillCategories(nextCategories);
    upsertHiddenSkillCategories(
      hiddenSkillCategoryIds.filter((id) => id !== categoryId)
    );
    resetCategoryForm();

    toast({ title: "Catégorie sauvegardée" });
  };

  const handleSkillSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!skillForm.categoryId) {
      toast({
        title: "Catégorie requise",
        description: "Sélectionnez une catégorie pour la compétence.",
        variant: "destructive"
      });
      return;
    }

    if (!skillForm.name.trim()) {
      toast({
        title: "Nom requis",
        description: "Indiquez le nom de la compétence.",
        variant: "destructive"
      });
      return;
    }

    const skillId = skillForm.id ?? generateId("skill");
    const baseCategory =
      customSkillCategories.find((item) => item.id === skillForm.categoryId) ||
      defaultSkillCategories.find((item) => item.id === skillForm.categoryId);

    if (!baseCategory) {
      toast({
        title: "Catégorie introuvable",
        description:
          "Ajoutez d'abord la catégorie avant d'y associer une compétence.",
        variant: "destructive"
      });
      return;
    }

    const updatedCategory: SkillCategory = {
      id: baseCategory.id,
      title: baseCategory.title,
      skills: [
        ...baseCategory.skills.filter((skill) => skill.id !== skillId),
        {
          id: skillId,
          name: skillForm.name.trim(),
          icon: skillForm.icon.trim() || "/images/technologies/typescript.svg"
        }
      ]
    };

    const nextCategories = [
      ...customSkillCategories.filter((item) => item.id !== updatedCategory.id),
      updatedCategory
    ];

    upsertCustomSkillCategories(nextCategories);
    upsertHiddenSkills(hiddenSkillIds.filter((id) => id !== skillId));
    resetSkillForm();

    toast({ title: "Compétence sauvegardée" });
  };

  const removeCategory = (category: SkillCategory) => {
    const isDefault = defaultSkillCategories.some(
      (item) => item.id === category.id
    );
    const nextCustom = customSkillCategories.filter(
      (item) => item.id !== category.id
    );
    upsertCustomSkillCategories(nextCustom);

    if (isDefault) {
      const nextHidden = hiddenSkillCategoryIds.includes(category.id)
        ? hiddenSkillCategoryIds
        : [...hiddenSkillCategoryIds, category.id];
      upsertHiddenSkillCategories(nextHidden);
    } else {
      upsertHiddenSkillCategories(
        hiddenSkillCategoryIds.filter((id) => id !== category.id)
      );
    }

    if (categoryForm.id === category.id) {
      resetCategoryForm();
    }

    toast({ title: "Catégorie masquée" });
  };

  const restoreCategory = (categoryId: string) => {
    upsertHiddenSkillCategories(
      hiddenSkillCategoryIds.filter((id) => id !== categoryId)
    );
    toast({ title: "Catégorie restaurée" });
  };

  const removeSkill = (skill: Skill) => {
    const category = allSkillCategories.find((cat) =>
      cat.skills.some((item) => item.id === skill.id)
    );

    if (!category) {
      return;
    }

    const baseCategory =
      customSkillCategories.find((item) => item.id === category.id) ||
      category;

    const updatedCategory: SkillCategory = {
      id: baseCategory.id,
      title: baseCategory.title,
      skills: baseCategory.skills.filter((item) => item.id !== skill.id)
    };

    const nextCategories = [
      ...customSkillCategories.filter((item) => item.id !== category.id),
      updatedCategory
    ];

    upsertCustomSkillCategories(nextCategories);

    const isDefaultSkill = defaultSkillCategories.some((cat) =>
      cat.skills.some((item) => item.id === skill.id)
    );

    if (isDefaultSkill) {
      const nextHidden = hiddenSkillIds.includes(skill.id)
        ? hiddenSkillIds
        : [...hiddenSkillIds, skill.id];
      upsertHiddenSkills(nextHidden);
    } else {
      upsertHiddenSkills(hiddenSkillIds.filter((id) => id !== skill.id));
    }

    if (skillForm.id === skill.id) {
      resetSkillForm();
    }

    toast({ title: "Compétence masquée" });
  };

  const restoreSkill = (skillId: string) => {
    upsertHiddenSkills(hiddenSkillIds.filter((id) => id !== skillId));
    toast({ title: "Compétence restaurée" });
  };

  const handleCertificationSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!certificationForm.name.trim()) {
      toast({
        title: "Nom requis",
        description: "Ajoutez un nom pour la certification.",
        variant: "destructive"
      });
      return;
    }

    const certificationId =
      certificationForm.id ?? generateId("certification");
    const skills = parseCommaSeparated(certificationForm.skills);

    const updatedCertification: Certification = {
      id: certificationId,
      name: certificationForm.name.trim(),
      description: certificationForm.description.trim(),
      skills,
      link: certificationForm.link.trim() || undefined,
      image: certificationForm.image
    };

    const nextCertifications = [
      ...customCertifications.filter((item) => item.id !== certificationId),
      updatedCertification
    ];

    upsertCustomCertifications(nextCertifications);
    upsertHiddenCertifications(
      hiddenCertificationIds.filter((id) => id !== certificationId)
    );
    resetCertificationForm();

    toast({ title: "Certification sauvegardée" });
  };

  const removeCertification = (item: Certification) => {
    const isDefault = defaultCertifications.some(
      (cert) => cert.id === item.id
    );

    const nextCustom = customCertifications.filter(
      (cert) => cert.id !== item.id
    );
    upsertCustomCertifications(nextCustom);

    if (isDefault) {
      const nextHidden = hiddenCertificationIds.includes(item.id)
        ? hiddenCertificationIds
        : [...hiddenCertificationIds, item.id];
      upsertHiddenCertifications(nextHidden);
    } else {
      upsertHiddenCertifications(
        hiddenCertificationIds.filter((id) => id !== item.id)
      );
    }

    if (certificationForm.id === item.id) {
      resetCertificationForm();
    }

    toast({ title: "Certification masquée" });
  };

  const restoreCertification = (certificationId: string) => {
    upsertHiddenCertifications(
      hiddenCertificationIds.filter((id) => id !== certificationId)
    );
    toast({ title: "Certification restaurée" });
  };

  const handleArticleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!articleForm.title.trim()) {
      toast({
        title: "Titre requis",
        description: "Ajoutez un titre pour l'article de veille.",
        variant: "destructive"
      });
      return;
    }

    if (!articleForm.link.trim()) {
      toast({
        title: "Lien requis",
        description: "Indiquez l'URL de l'article.",
        variant: "destructive"
      });
      return;
    }

    const articleId = articleForm.id ?? generateId("article");

    const updatedArticle: TechWatchArticle = {
      id: articleId,
      title: articleForm.title.trim(),
      summary: articleForm.summary.trim(),
      link: articleForm.link.trim(),
      publishedAt: articleForm.publishedAt.trim() || undefined,
      image: articleForm.image
    };

    const nextArticles = [
      ...customArticles.filter((item) => item.id !== articleId),
      updatedArticle
    ];

    upsertCustomArticles(nextArticles);
    upsertHiddenArticles(hiddenArticleIds.filter((id) => id !== articleId));
    resetArticleForm();

    toast({ title: "Article sauvegardé" });
  };

  const removeArticle = (item: TechWatchArticle) => {
    const isDefault = defaultArticles.some((article) => article.id === item.id);
    const nextCustom = customArticles.filter((article) => article.id !== item.id);
    upsertCustomArticles(nextCustom);

    if (isDefault) {
      const nextHidden = hiddenArticleIds.includes(item.id)
        ? hiddenArticleIds
        : [...hiddenArticleIds, item.id];
      upsertHiddenArticles(nextHidden);
    } else {
      upsertHiddenArticles(hiddenArticleIds.filter((id) => id !== item.id));
    }

    if (articleForm.id === item.id) {
      resetArticleForm();
    }

    toast({ title: "Article masqué" });
  };

  const restoreArticle = (articleId: string) => {
    upsertHiddenArticles(hiddenArticleIds.filter((id) => id !== articleId));
    toast({ title: "Article restauré" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted pb-20">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Administration</p>
            <h1 className="text-2xl font-bold">Gestion du portfolio</h1>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">← Retour au site</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-10 space-y-16">
        <section>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <Card className="p-6 h-full space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Synchroniser le contenu</h2>
                <p className="text-sm text-muted-foreground">
                  Les changements réalisés dans cette interface sont stockés dans le navigateur. Pour les partager sur
                  le serveur, exportez-les puis remplacez le fichier <code>public/data/portfolio-data.json</code> avant
                  le déploiement.
                </p>
              </div>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Exportez un instantané JSON lorsque vos ajouts sont terminés.</li>
                <li>Importez un fichier existant pour retrouver une sauvegarde ou préparer une mise à jour.</li>
                <li>Rechargez les données publiées pour vérifier qu’elles correspondent à la production.</li>
              </ul>
            </Card>
            <Card className="p-6 h-full space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Version serveur appliquée
                </p>
                <p className="text-base font-semibold">{formattedServerVersion}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleSnapshotExport}>Exporter le JSON</Button>
                <Button variant="secondary" onClick={openImportDialog}>
                  Importer un JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={handleServerResync}
                  disabled={isSyncing}
                >
                  {isSyncing ? "Synchronisation..." : "Recharger depuis le serveur"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Après export, copiez le fichier généré dans <code>public/data/portfolio-data.json</code>,
                validez-le dans votre dépôt puis relancez le déploiement. Les visiteurs chargeront automatiquement
                cette version.
              </p>
            </Card>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleSnapshotImport}
          />
        </section>

        {/* Méthode de veille – daily.dev, Réseaux, Sujet favori */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Méthode de veille</h2>
              <p className="text-sm text-muted-foreground">
                Gérez daily.dev, vos comptes suivis (YouTube, TikTok, Instagram) et votre sujet favori.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href="/veille-technologique" target="_blank" rel="noopener noreferrer">Voir la page publique</a>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">daily.dev</h3>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={techProfile.dailyDev?.description || ""}
                  onChange={(e) =>
                    setTechProfile((p) => ({
                      ...p,
                      dailyDev: { ...p.dailyDev, description: e.target.value }
                    }))
                  }
                />
              </div>
              <div className="grid gap-2 mt-3">
                <Label>Lien de profil</Label>
                <Input
                  value={techProfile.dailyDev?.profileLink || ""}
                  onChange={(e) =>
                    setTechProfile((p) => ({
                      ...p,
                      dailyDev: { ...p.dailyDev, profileLink: e.target.value }
                    }))
                  }
                />
              </div>
              <div className="grid gap-2 mt-3">
                <Label>Image DevCard</Label>
                <Input type="file" accept="image/*" onChange={handleDevcardImageChange} />
                {techProfile.dailyDev?.devCardImage && (
                  <img
                    src={techProfile.dailyDev.devCardImage}
                    alt="DevCard"
                    className="mt-2 h-32 object-contain border rounded"
                  />
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Comptes suivis</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Plateforme</Label>
                  <select
                    className="h-9 rounded border border-input bg-background px-2"
                    value={accountForm.platform}
                    onChange={(e) =>
                      setAccountForm((p) => ({ ...p, platform: e.target.value as any }))
                    }
                  >
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Nom</Label>
                  <Input
                    value={accountForm.name}
                    onChange={(e) => setAccountForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Lien</Label>
                  <Input
                    value={accountForm.link}
                    onChange={(e) => setAccountForm((p) => ({ ...p, link: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Image</Label>
                  <Input type="file" accept="image/*" onChange={handleAccountImageChange} />
                </div>
              </div>
              <div className="grid gap-2 mt-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={accountForm.description}
                  onChange={(e) => setAccountForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={addSocialAccount}>
                  {accountForm.id ? "Mettre à jour" : "Ajouter"}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setAccountForm(emptyTechWatchAccountForm)}
                >
                  Annuler
                </Button>
              </div>
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-2">
                {techProfile.socialAccounts.map((acc) => (
                  <div key={acc.id} className="rounded border p-2 flex items-start gap-3">
                    {acc.image && (
                      <img src={acc.image} alt={acc.name} className="w-10 h-10 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {acc.name}{" "}
                        <span className="text-xs text-muted-foreground">({acc.platform})</span>
                      </p>
                      <p className="text-xs text-muted-foreground break-all">{acc.link}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => editSocialAccount(acc.id)}>
                        Modifier
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => removeSocialAccount(acc.id)}>
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Sujet favori</h3>
              <div className="grid gap-2">
                <Label>Titre</Label>
                <Input
                  value={techProfile.favoriteTopic.title}
                  onChange={(e) =>
                    setTechProfile((p) => ({
                      ...p,
                      favoriteTopic: { ...p.favoriteTopic, title: e.target.value }
                    }))
                  }
                />
              </div>
              <div className="grid gap-2 mt-2">
                <Label>Contenu</Label>
                <Textarea
                  rows={5}
                  value={techProfile.favoriteTopic.content}
                  onChange={(e) =>
                    setTechProfile((p) => ({
                      ...p,
                      favoriteTopic: { ...p.favoriteTopic, content: e.target.value }
                    }))
                  }
                />
              </div>
            </Card>
            <Card className="p-4">
              <div className="grid gap-2">
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={handleFavoriteImageChange} />
                {techProfile.favoriteTopic.image && (
                  <img
                    src={techProfile.favoriteTopic.image}
                    alt="Sujet favori"
                    className="mt-2 h-40 object-cover border rounded"
                  />
                )}
              </div>
            </Card>
          </div>

          <div className="mt-4">
            <Button onClick={saveTechWatchProfile}>Enregistrer la méthode de veille</Button>
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Projets</h2>
              <p className="text-sm text-muted-foreground">
                Ajouter, modifier ou masquer les projets (Web, IA, Mobile, Réseaux).
              </p>
            </div>
            {projectForm.id && (
              <Button variant="ghost" onClick={resetProjectForm}>
                Annuler l'édition
              </Button>
            )}
          </div>

          <Card className="p-6 mb-8">
            <form className="grid gap-4" onSubmit={handleProjectSubmit}>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="project-title">Titre</Label>
                  <Input
                    id="project-title"
                    value={projectForm.title}
                    onChange={(event) =>
                      setProjectForm((previous) => ({
                        ...previous,
                        title: event.target.value
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-type">Type</Label>
                  <select
                    id="project-type"
                    value={projectForm.type}
                    onChange={(event) =>
                      setProjectForm((previous) => ({
                        ...previous,
                        type: event.target.value as Project["type"]
                      }))
                    }
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {projectTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={projectForm.description}
                  onChange={(event) =>
                    setProjectForm((previous) => ({
                      ...previous,
                      description: event.target.value
                    }))
                  }
                  rows={3}
                  required
                />
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="project-technologies">
                    Technologies (séparées par des virgules)
                  </Label>
                  <Input
                    id="project-technologies"
                    placeholder="React, TypeScript, Tailwind"
                    value={projectForm.technologies}
                    onChange={(event) =>
                      setProjectForm((previous) => ({
                        ...previous,
                        technologies: event.target.value
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-skill">Compétence mise en avant</Label>
                  <Input
                    id="project-skill"
                    value={projectForm.skillHighlight}
                    onChange={(event) =>
                      setProjectForm((previous) => ({
                        ...previous,
                        skillHighlight: event.target.value
                      }))
                    }
                    placeholder="React"
                  />
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="project-link">Lien principal</Label>
                  <Input
                    id="project-link"
                    type="url"
                    placeholder="https://..."
                    value={projectForm.primaryLink}
                    onChange={(event) =>
                      setProjectForm((previous) => ({
                        ...previous,
                        primaryLink: event.target.value
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-github">Lien code (GitHub)</Label>
                  <Input
                    id="project-github"
                    type="url"
                    placeholder="https://github.com/..."
                    value={projectForm.github}
                    onChange={(event) =>
                      setProjectForm((previous) => ({
                        ...previous,
                        github: event.target.value
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-demo">Lien démo</Label>
                  <Input
                    id="project-demo"
                    type="url"
                    placeholder="https://..."
                    value={projectForm.demo}
                    onChange={(event) =>
                      setProjectForm((previous) => ({
                        ...previous,
                        demo: event.target.value
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="project-features">
                    Fonctionnalités (une par ligne)
                  </Label>
                  <Textarea
                    id="project-features"
                    placeholder={"Authentification\nTableau de bord\nNotifications"}
                    value={projectForm.features}
                    onChange={(event) =>
                      setProjectForm((previous) => ({
                        ...previous,
                        features: event.target.value
                      }))
                    }
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-link-label">Texte du bouton</Label>
                  <Input
                    id="project-link-label"
                    value={projectForm.primaryLinkLabel}
                    onChange={(event) =>
                      setProjectForm((previous) => ({
                        ...previous,
                        primaryLinkLabel: event.target.value
                      }))
                    }
                  />
                  <div className="grid gap-2">
                    <Label htmlFor="project-image">Illustration du projet</Label>
                    <Input
                      id="project-image"
                      type="file"
                      accept="image/*"
                      onChange={handleProjectImageChange}
                    />
                  </div>
                </div>
              </div>

              {projectForm.visual && (
                <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
                  <p className="text-sm font-medium mb-2">Aperçu de l'image</p>
                  <img
                    src={projectForm.visual}
                    alt="Aperçu du projet"
                    className="max-h-48 w-full object-cover rounded-md"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button type="submit" className="self-start">
                  {projectForm.id ? "Mettre à jour" : "Enregistrer le projet"}
                </Button>
                {projectForm.id && (
                  <Button variant="secondary" onClick={resetProjectForm}>
                    Nouveau projet
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Projets gérés ({allProjects.length})
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {allProjects.map((project) => {
                const isHidden = hiddenProjectIds.includes(project.id);
                return (
                  <div
                    key={project.id}
                    className="rounded-lg border border-border/60 bg-background/60 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          {project.title}
                          {isHidden && (
                            <Badge variant="outline" className="text-xs">
                              Masqué
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {
                            projectTypeOptions.find(
                              (opt) => opt.value === project.type
                            )?.label ?? project.type.toUpperCase()
                          }
                          {" • "}
                          {project.skillHighlight}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editProject(project)}>
                          Modifier
                        </Button>
                        {isHidden ? (
                          <Button size="sm" variant="secondary" onClick={() => restoreProject(project.id)}>
                            Restaurer
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeProject(project)}
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Expériences</h2>
              <p className="text-sm text-muted-foreground">
                Ajoutez vos expériences professionnelles et contrôlez leur visibilité.
              </p>
            </div>
            {experienceForm.id && (
              <Button variant="ghost" onClick={resetExperienceForm}>
                Annuler l'édition
              </Button>
            )}
          </div>

          <Card className="p-6 mb-8">
            <form className="grid gap-4" onSubmit={handleExperienceSubmit}>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="experience-title">Poste</Label>
                  <Input
                    id="experience-title"
                    value={experienceForm.title}
                    onChange={(event) =>
                      setExperienceForm((previous) => ({
                        ...previous,
                        title: event.target.value
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience-company">Entreprise</Label>
                  <Input
                    id="experience-company"
                    value={experienceForm.company}
                    onChange={(event) =>
                      setExperienceForm((previous) => ({
                        ...previous,
                        company: event.target.value
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience-period">Période</Label>
                  <Input
                    id="experience-period"
                    placeholder="2022 - 2023"
                    value={experienceForm.period}
                    onChange={(event) =>
                      setExperienceForm((previous) => ({
                        ...previous,
                        period: event.target.value
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="experience-description">Description</Label>
                <Textarea
                  id="experience-description"
                  rows={3}
                  value={experienceForm.description}
                  onChange={(event) =>
                    setExperienceForm((previous) => ({
                      ...previous,
                      description: event.target.value
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="experience-technologies">
                    Technologies (séparées par des virgules)
                  </Label>
                  <Input
                    id="experience-technologies"
                    placeholder="React, Node.js, PostgreSQL"
                    value={experienceForm.technologies}
                    onChange={(event) =>
                      setExperienceForm((previous) => ({
                        ...previous,
                        technologies: event.target.value
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience-achievements">
                    Réalisations (une par ligne)
                  </Label>
                  <Textarea
                    id="experience-achievements"
                    placeholder={"Mise en place CI/CD\nOptimisation performances"}
                    value={experienceForm.achievements}
                    onChange={(event) =>
                      setExperienceForm((previous) => ({
                        ...previous,
                        achievements: event.target.value
                      }))
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="experience-image">Image ou logo</Label>
                <Input
                  id="experience-image"
                  type="file"
                  accept="image/*"
                  onChange={handleExperienceImageChange}
                />
              </div>

              {experienceForm.image && (
                <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
                  <p className="text-sm font-medium mb-2">Aperçu de l'image</p>
                  <img
                    src={experienceForm.image}
                    alt="Aperçu de l'expérience"
                    className="max-h-48 w-full object-cover rounded-md"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button type="submit" className="self-start">
                  {experienceForm.id ? "Mettre à jour" : "Enregistrer l'expérience"}
                </Button>
                {experienceForm.id && (
                  <Button variant="secondary" onClick={resetExperienceForm}>
                    Nouvelle expérience
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Expériences gérées ({allExperiences.length})
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {allExperiences.map((experience) => {
                const isHidden = hiddenExperienceIds.includes(experience.id);
                return (
                  <div
                    key={experience.id}
                    className="rounded-lg border border-border/60 bg-background/60 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          {experience.title}
                          {isHidden && (
                            <Badge variant="outline" className="text-xs">
                              Masquée
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {experience.company} • {experience.period}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {experience.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editExperience(experience)}>
                          Modifier
                        </Button>
                        {isHidden ? (
                          <Button size="sm" variant="secondary" onClick={() => restoreExperience(experience.id)}>
                            Restaurer
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeExperience(experience)}
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="md:w-1/2 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Catégories de compétences</h2>
                    <p className="text-sm text-muted-foreground">
                      Gérez les regroupements de compétences (Frontend, Backend...).
                    </p>
                  </div>
                  {categoryForm.id && (
                    <Button variant="ghost" onClick={resetCategoryForm}>
                      Annuler l'édition
                    </Button>
                  )}
                </div>

                <Card className="p-6">
                  <form className="grid gap-4" onSubmit={handleCategorySubmit}>
                    <div className="grid gap-2">
                      <Label htmlFor="category-title">Titre de la catégorie</Label>
                      <Input
                        id="category-title"
                        value={categoryForm.title}
                        onChange={(event) =>
                          setCategoryForm((previous) => ({
                            ...previous,
                            title: event.target.value
                          }))
                        }
                        placeholder="Frontend"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button type="submit">
                        {categoryForm.id ? "Mettre à jour" : "Enregistrer"}
                      </Button>
                      {categoryForm.id && (
                        <Button variant="secondary" onClick={resetCategoryForm}>
                          Nouvelle catégorie
                        </Button>
                      )}
                    </div>
                  </form>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Catégories ({allSkillCategories.length})
                </h3>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {allSkillCategories.map((category) => {
                    const isHidden = hiddenSkillCategoryIds.includes(category.id);
                    return (
                      <div
                        key={category.id}
                        className="rounded-lg border border-border/60 bg-background/60 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold flex items-center gap-2">
                              {category.title}
                              {isHidden && (
                                <Badge variant="outline" className="text-xs">
                                  Masquée
                                </Badge>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {category.skills.length} compétences
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => editCategory(category)}>
                              Modifier
                            </Button>
                            {isHidden ? (
                              <Button size="sm" variant="secondary" onClick={() => restoreCategory(category.id)}>
                                Restaurer
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeCategory(category)}
                              >
                                Masquer
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            <div className="md:w-1/2 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Compétences</h2>
                    <p className="text-sm text-muted-foreground">
                      Ajoutez des compétences et associez-les à une catégorie.
                    </p>
                  </div>
                  {skillForm.id && (
                    <Button variant="ghost" onClick={resetSkillForm}>
                      Annuler l'édition
                    </Button>
                  )}
                </div>

                <Card className="p-6">
                  <form className="grid gap-4" onSubmit={handleSkillSubmit}>
                    <div className="grid gap-2">
                      <Label htmlFor="skill-category">Catégorie</Label>
                      <select
                        id="skill-category"
                        value={skillForm.categoryId}
                        onChange={(event) =>
                          setSkillForm((previous) => ({
                            ...previous,
                            categoryId: event.target.value
                          }))
                        }
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        required
                      >
                        <option value="">Sélectionnez une catégorie</option>
                        {allSkillCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="skill-name">Nom de la compétence</Label>
                      <Input
                        id="skill-name"
                        value={skillForm.name}
                        onChange={(event) =>
                          setSkillForm((previous) => ({
                            ...previous,
                            name: event.target.value
                          }))
                        }
                        placeholder="React"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="skill-icon">Icône (URL)</Label>
                      <Input
                        id="skill-icon"
                        value={skillForm.icon}
                        onChange={(event) =>
                          setSkillForm((previous) => ({
                            ...previous,
                            icon: event.target.value
                          }))
                        }
                        placeholder="/images/technologies/react.svg"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Button type="submit">
                        {skillForm.id ? "Mettre à jour" : "Enregistrer"}
                      </Button>
                      {skillForm.id && (
                        <Button variant="secondary" onClick={resetSkillForm}>
                          Nouvelle compétence
                        </Button>
                      )}
                    </div>
                  </form>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Compétences ({allSkillCategories.reduce((total, category) => total + category.skills.length, 0)})
                </h3>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {allSkillCategories.map((category) => (
                    <div key={category.id} className="space-y-3">
                      <p className="text-sm font-semibold text-primary">
                        {category.title}
                      </p>
                      <div className="grid gap-2">
                        {category.skills.map((skill) => {
                          const isHidden = hiddenSkillIds.includes(skill.id);
                          return (
                            <div
                              key={skill.id}
                              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/60 p-3"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={skill.icon}
                                  alt={skill.name}
                                  className="w-8 h-8 object-contain"
                                />
                                <div>
                                  <p className="font-medium flex items-center gap-2">
                                    {skill.name}
                                    {isHidden && (
                                      <Badge variant="outline" className="text-xs">
                                        Masquée
                                      </Badge>
                                    )}
                                  </p>
                                  <p className="text-xs text-muted-foreground">ID : {skill.id}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => editSkill(skill, category.id)}
                                >
                                  Modifier
                                </Button>
                                {isHidden ? (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => restoreSkill(skill.id)}
                                  >
                                    Restaurer
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeSkill(skill)}
                                  >
                                    Masquer
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Certifications</h2>
              <p className="text-sm text-muted-foreground">
                Ajoutez vos certifications, leurs visuels et les compétences associées.
              </p>
            </div>
            {certificationForm.id && (
              <Button variant="ghost" onClick={resetCertificationForm}>
                Annuler l'édition
              </Button>
            )}
          </div>

          <Card className="p-6 mb-8">
            <form className="grid gap-4" onSubmit={handleCertificationSubmit}>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="certification-name">Nom</Label>
                  <Input
                    id="certification-name"
                    value={certificationForm.name}
                    onChange={(event) =>
                      setCertificationForm((previous) => ({
                        ...previous,
                        name: event.target.value
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="certification-link">Lien (optionnel)</Label>
                  <Input
                    id="certification-link"
                    type="url"
                    placeholder="https://..."
                    value={certificationForm.link}
                    onChange={(event) =>
                      setCertificationForm((previous) => ({
                        ...previous,
                        link: event.target.value
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="certification-description">Description</Label>
                <Textarea
                  id="certification-description"
                  rows={3}
                  value={certificationForm.description}
                  onChange={(event) =>
                    setCertificationForm((previous) => ({
                      ...previous,
                      description: event.target.value
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="certification-skills">
                  Compétences couvertes (séparées par des virgules)
                </Label>
                <Input
                  id="certification-skills"
                  placeholder="Gestion de projet, Sécurité"
                  value={certificationForm.skills}
                  onChange={(event) =>
                    setCertificationForm((previous) => ({
                      ...previous,
                      skills: event.target.value
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="certification-image">Image de la certification</Label>
                <Input
                  id="certification-image"
                  type="file"
                  accept="image/*"
                  onChange={handleCertificationImageChange}
                />
              </div>

              {certificationForm.image && (
                <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
                  <p className="text-sm font-medium mb-2">Aperçu de l'image</p>
                  <img
                    src={certificationForm.image}
                    alt="Aperçu de la certification"
                    className="max-h-48 w-full object-cover rounded-md"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button type="submit">
                  {certificationForm.id ? "Mettre à jour" : "Enregistrer"}
                </Button>
                {certificationForm.id && (
                  <Button variant="secondary" onClick={resetCertificationForm}>
                    Nouvelle certification
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Certifications ({allCertifications.length})
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {allCertifications.map((item) => {
                const isHidden = hiddenCertificationIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border/60 bg-background/60 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          {item.name}
                          {isHidden && (
                            <Badge variant="outline" className="text-xs">
                              Masquée
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.skills.join(", ") || "Compétences à préciser"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editCertification(item)}>
                          Modifier
                        </Button>
                        {isHidden ? (
                          <Button size="sm" variant="secondary" onClick={() => restoreCertification(item.id)}>
                            Restaurer
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeCertification(item)}
                          >
                            Masquer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Veille technologique</h2>
              <p className="text-sm text-muted-foreground">
                Centralisez vos articles de veille avec un visuel, un résumé et un lien.
              </p>
            </div>
            {articleForm.id && (
              <Button variant="ghost" onClick={resetArticleForm}>
                Annuler l'édition
              </Button>
            )}
          </div>

          <Card className="p-6 mb-8">
            <form className="grid gap-4" onSubmit={handleArticleSubmit}>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="article-title">Titre</Label>
                  <Input
                    id="article-title"
                    value={articleForm.title}
                    onChange={(event) =>
                      setArticleForm((previous) => ({
                        ...previous,
                        title: event.target.value
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="article-link">Lien</Label>
                  <Input
                    id="article-link"
                    type="url"
                    placeholder="https://..."
                    value={articleForm.link}
                    onChange={(event) =>
                      setArticleForm((previous) => ({
                        ...previous,
                        link: event.target.value
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="article-summary">Résumé</Label>
                <Textarea
                  id="article-summary"
                  rows={3}
                  value={articleForm.summary}
                  onChange={(event) =>
                    setArticleForm((previous) => ({
                      ...previous,
                      summary: event.target.value
                    }))
                  }
                />
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="article-published">Date ou période</Label>
                  <Input
                    id="article-published"
                    placeholder="Janvier 2024"
                    value={articleForm.publishedAt}
                    onChange={(event) =>
                      setArticleForm((previous) => ({
                        ...previous,
                        publishedAt: event.target.value
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="article-image">Image de l'article</Label>
                  <Input
                    id="article-image"
                    type="file"
                    accept="image/*"
                    onChange={handleArticleImageChange}
                  />
                </div>
              </div>

              {articleForm.image && (
                <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
                  <p className="text-sm font-medium mb-2">Aperçu de l'image</p>
                  <img
                    src={articleForm.image}
                    alt="Aperçu de l'article"
                    className="max-h-48 w-full object-cover rounded-md"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button type="submit">
                  {articleForm.id ? "Mettre à jour" : "Enregistrer"}
                </Button>
                {articleForm.id && (
                  <Button variant="secondary" onClick={resetArticleForm}>
                    Nouvel article
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Articles ({allArticles.length})
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {allArticles.map((item) => {
                const isHidden = hiddenArticleIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border/60 bg-background/60 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          {item.title}
                          {isHidden && (
                            <Badge variant="outline" className="text-xs">
                              Masqué
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.publishedAt || "Date non précisée"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editArticle(item)}>
                          Modifier
                        </Button>
                        {isHidden ? (
                          <Button size="sm" variant="secondary" onClick={() => restoreArticle(item.id)}>
                            Restaurer
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeArticle(item)}
                          >
                            Masquer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Admin;
