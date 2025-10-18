import { useEffect, useMemo, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  mergeProjects,
  projects as defaultProjects,
  type Project
} from "@/data/portfolio";
import {
  loadCustomProjects,
  loadHiddenProjectIds,
  subscribeToProjectUpdates
} from "@/lib/portfolioStorage";
import { slugify } from "@/lib/slug";

type ProjectExtraDetails = {
  context?: string;
  objectives?: string[];
  architectureImage?: string;
  architectureDescription?: string;
};

// You can enrich projects here by slug without touching base data
const PROJECT_DETAILS: Record<string, ProjectExtraDetails> = {
  'ia-docubase': {
    context:
      "Projet d’automatisation du traitement des factures pour une GED. En tant qu’étudiant BTS SIO SLAM, j’ai cherché à réduire les tâches manuelles (lecture de champs, vérification) tout en fiabilisant les données. Le flux récupère les documents, extrait les champs clés, compare aux métadonnées existantes et propose une validation simple.",
    objectives: [
      "Automatiser l’extraction des champs (Nom, Prénom, contrat, client)",
      "Mettre en évidence les écarts avec la GED pour correction rapide",
      "Simplifier la validation et tracer les actions",
      "Exporter des indicateurs vers Power BI pour le suivi"
    ],
    architectureImage: "/images/projets/architecture/ia-docubase.svg",
    architectureDescription:
      "Flux principal: Ingestion → Extraction (Batch) → Vérification/Validation (UI) → Mise à jour GED → Reporting (BI)."
  },
  'cyber-escapegame': {
    context:
      "En vue de la Semaine du Numérique, les BTS SIO se sont vu confier une mission : organiser des activités pour les élèves de seconde, afin de les sensibiliser à la cybersécurité.Étant développeurs, il fallait au moins concevoir une application plutôt que de proposer un banal quiz. C’est alors que l’idée de l’Escape Game nous est venue. C’est avec une équipe de cinq personnes que nous avons développé cette application web, qui a ravi les élèves de seconde tout en les sensibilisant aux dangers et aux bonnes attitudes à adopter sur Internet (phishing, chiffrement, mot de passe fort et OSINT).",
    objectives: [
      "Gérer des sessions de jeu et les équipes",
      "Proposer des énigmes chronométrées avec suivi de progression",
      "Stocker les scores et générer un classement",
      "Disposer d’une interface d’admin simple pour gérer le contenu"
    ],
    architectureImage: "/images/projets/architecture/cyber-escapegame.svg",
    architectureDescription:
      "Architecture web classique: Front (HTML/CSS/JS) → API Node.js → PostgreSQL. Documentation des endpoints via OpenAPI/Swagger."
  },
  'jeu-labyrinthe': {
    context:
      "Mini‑jeu en Python (terminal) réalisé en 1re année. Le joueur choisit un personnage, se déplace case par case, évite les pièges et dispose de 5 vies. Ce projet m’a permis d’appliquer la POO et la gestion d’une boucle de jeu",
    objectives: [
      "Mettre en place une boucle de jeu avec rendu terminal",
      "Gérer les collisions, les vies et la fin de partie",
      "Charger/générer un labyrinthe et valider la sortie",
      "Structurer le code en classes (POO)"
    ],
    architectureImage: "/images/projets/architecture/jeu-labyrinthe.svg",
    architectureDescription:
      "Cycle: Entrées clavier → Moteur de jeu (règles) → Mise à jour de l’état → Affichage terminal."
  }
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const [customProjects, setCustomProjects] = useState<Project[]>([]);
  const [hiddenProjectIds, setHiddenProjectIds] = useState<string[]>([]);

  useEffect(() => {
    setCustomProjects(loadCustomProjects());
    setHiddenProjectIds(loadHiddenProjectIds());
    const unsubscribe = subscribeToProjectUpdates(() => {
      setCustomProjects(loadCustomProjects());
      setHiddenProjectIds(loadHiddenProjectIds());
    });
    return unsubscribe;
  }, []);

  const projects = useMemo(
    () => mergeProjects(defaultProjects, customProjects, hiddenProjectIds),
    [customProjects, hiddenProjectIds]
  );

  const project = useMemo(
    () => projects.find((p) => slugify(p.title) === slug),
    [projects, slug]
  );

  const extra: ProjectExtraDetails = useMemo(
    () => (slug ? PROJECT_DETAILS[slug] ?? {} : {}),
    [slug]
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-20">
          <p className="mb-6 text-sm">
            <RouterLink to="/" className="text-primary hover:underline">
              ← Retour à l’accueil
            </RouterLink>
          </p>
          <h1 className="text-3xl font-bold mb-4">Projet introuvable</h1>
          <p className="text-muted-foreground">
            Le projet demandé n’existe pas ou a été masqué.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <p className="mb-6 text-sm">
          <RouterLink to="/" className="text-primary hover:underline">
            ← Retour aux projets
          </RouterLink>
          <span className="text-muted-foreground"> • </span>
          <RouterLink to="/#projets" className="text-primary hover:underline">
            Voir la liste
          </RouterLink>
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h1>
              <p className="text-muted-foreground">
                {project.description}
              </p>
            </div>

            {project.visual && (
              <Card className="overflow-hidden border-border">
                <img
                  src={project.visual}
                  alt={project.title}
                  className="w-full h-72 object-cover"
                />
              </Card>
            )}

            {project.features?.length > 0 && (
              <Card className="p-6 card-gradient border-border">
                <h2 className="text-xl font-semibold mb-3">Fonctionnalités principales</h2>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  {project.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Contexte */}
            <Card className="p-6 border-border">
              <h2 className="text-xl font-semibold mb-3">Contexte</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {extra.context ||
                  "Ajoutez le contexte du projet (besoin métier, problème initial, public visé) dans PROJECT_DETAILS de src/pages/ProjectDetail.tsx."}
              </p>
            </Card>

            {/* Objectifs */}
            <Card className="p-6 border-border">
              <h2 className="text-xl font-semibold mb-3">Objectifs</h2>
              {extra.objectives && extra.objectives.length > 0 ? (
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  {extra.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Ajoutez une liste de 3–6 objectifs clés pour ce projet.
                </p>
              )}
            </Card>

            {/* Architecture (image possible) */}
            <Card className="p-6 border-border">
              <h2 className="text-xl font-semibold mb-3">Architecture</h2>
              {extra.architectureImage ? (
                <div className="overflow-hidden rounded border border-border/60 mb-3">
                  <img
                    src={extra.architectureImage}
                    alt={`Architecture – ${project.title}`}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-48 bg-muted/20 border border-dashed border-border/60 mb-3 flex items-center justify-center text-muted-foreground">
                  Ajoutez une image d'architecture (diagramme, schéma…)
                </div>
              )}
              {extra.architectureDescription && (
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {extra.architectureDescription}
                </p>
              )}
            </Card>

            {/* Détails techniques */}
            <Card className="p-6 border-border">
              <h2 className="text-xl font-semibold mb-3">Détails</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Type</p>
                  <p className="font-medium">{project.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Compétence mise en avant</p>
                  <p className="font-medium">{project.skillHighlight}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-border">
              <h3 className="font-semibold mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-accent/10 text-accent text-xs rounded border border-accent/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>

            {(project.github || project.primaryLink) && (
              <Card className="p-6 border-border">
                <h3 className="font-semibold mb-3">Liens</h3>
                <div className="flex flex-col gap-2">
                  {project.github && (
                    <Button asChild variant="outline" size="sm">
                      <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                    </Button>
                  )}
                  {project.primaryLink && (
                    <Button asChild variant="outline" size="sm">
                      <a href={project.primaryLink} target="_blank" rel="noopener noreferrer">Site</a>
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
