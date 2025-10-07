import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  experiences as defaultExperiences,
  projects as defaultProjects,
  type Experience,
  type Project
} from "@/data/portfolio";
import {
  loadCustomExperiences,
  loadCustomProjects,
  saveCustomExperiences,
  saveCustomProjects
} from "@/lib/portfolioStorage";
import { resizeImageFile } from "@/lib/image";

const initialProjectForm = {
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
  visual: undefined as string | undefined
};

const initialExperienceForm = {
  title: "",
  company: "",
  period: "",
  description: "",
  technologies: "",
  achievements: "",
  image: undefined as string | undefined
};

const Admin = () => {
  const { toast } = useToast();
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [experienceForm, setExperienceForm] = useState(initialExperienceForm);
  const [customProjects, setCustomProjects] = useState<Project[]>([]);
  const [customExperiences, setCustomExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    setCustomProjects(loadCustomProjects());
    setCustomExperiences(loadCustomExperiences());
  }, []);

  const allProjects = useMemo(
    () => [...defaultProjects, ...customProjects],
    [customProjects]
  );

  const allExperiences = useMemo(
    () => [...defaultExperiences, ...customExperiences],
    [customExperiences]
  );

  const handleProjectSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const technologies = projectForm.technologies
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);
    const features = projectForm.features
      .split("\n")
      .map((feature) => feature.trim())
      .filter(Boolean);

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

    const newProject: Project = {
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      type: projectForm.type.trim() || "web",
      technologies,
      skillHighlight,
      github: projectForm.github.trim() || undefined,
      demo: projectForm.demo.trim() || undefined,
      primaryLink,
      primaryLinkLabel: projectForm.primaryLinkLabel.trim() || "Voir le projet",
      features: features.length > 0 ? features : ["Fonctionnalité à décrire"],
      visual: projectForm.visual
    };

    const updatedProjects = [...customProjects, newProject];
    setCustomProjects(updatedProjects);
    saveCustomProjects(updatedProjects);
    setProjectForm(initialProjectForm);
    toast({
      title: "Projet ajouté",
      description: "Le projet a été enregistré et sera visible sur la page d'accueil."
    });
  };

  const handleExperienceSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const technologies = experienceForm.technologies
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);
    const achievements = experienceForm.achievements
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const newExperience: Experience = {
      title: experienceForm.title.trim(),
      company: experienceForm.company.trim(),
      period: experienceForm.period.trim(),
      description: experienceForm.description.trim(),
      technologies,
      achievements: achievements.length > 0 ? achievements : ["Réalisations à détailler"],
      image: experienceForm.image
    };

    const updatedExperiences = [...customExperiences, newExperience];
    setCustomExperiences(updatedExperiences);
    saveCustomExperiences(updatedExperiences);
    setExperienceForm(initialExperienceForm);
    toast({
      title: "Expérience ajoutée",
      description: "Votre expérience a été enregistrée et sera affichée sur la page d'accueil."
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
        description: "Impossible de traiter cette image. Réessayez avec un autre fichier.",
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
        description: "Impossible de traiter cette image. Réessayez avec un autre fichier.",
        variant: "destructive"
      });
    }
  };

  const removeCustomProject = (project: Project) => {
    const updated = customProjects.filter((item) => item !== project);
    setCustomProjects(updated);
    saveCustomProjects(updated);
    toast({ title: "Projet supprimé" });
  };

  const removeCustomExperience = (experience: Experience) => {
    const updated = customExperiences.filter((item) => item !== experience);
    setCustomExperiences(updated);
    saveCustomExperiences(updated);
    toast({ title: "Expérience supprimée" });
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
          <h2 className="text-xl font-semibold mb-6">Ajouter un projet</h2>
          <Card className="p-6">
            <form className="grid gap-4" onSubmit={handleProjectSubmit}>
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

              <div className="grid gap-2 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="project-type">Type</Label>
                  <Input
                    id="project-type"
                    value={projectForm.type}
                    onChange={(event) =>
                      setProjectForm((previous) => ({
                        ...previous,
                        type: event.target.value
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
                  />
                </div>
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
                    required={!projectForm.demo && !projectForm.github}
                  />
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
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
              </div>

              <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
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
                </div>
                <div>
                  <Label htmlFor="project-image">Illustration du projet</Label>
                  <Input
                    id="project-image"
                    type="file"
                    accept="image/*"
                    onChange={handleProjectImageChange}
                  />
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

              <Button type="submit" className="self-start">
                Enregistrer le projet
              </Button>
            </form>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6">Ajouter une expérience</h2>
          <Card className="p-6">
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

              <Button type="submit" className="self-start">
                Enregistrer l'expérience
              </Button>
            </form>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6">Contenu existant</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Projets ({allProjects.length})</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {allProjects.map((project, index) => {
                  const isCustom = index >= defaultProjects.length;
                  return (
                    <div
                      key={`${project.title}-${index}`}
                      className="rounded-lg border border-border/60 bg-background/60 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{project.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {project.type} • {project.skillHighlight}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {isCustom && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeCustomProject(project)}
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Expériences ({allExperiences.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {allExperiences.map((experience, index) => {
                  const isCustom = index >= defaultExperiences.length;
                  return (
                    <div
                      key={`${experience.title}-${index}`}
                      className="rounded-lg border border-border/60 bg-background/60 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{experience.title}</p>
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
                        {isCustom && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeCustomExperience(experience)}
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
