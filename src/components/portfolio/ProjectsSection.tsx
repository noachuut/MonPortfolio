import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useMemo, useState } from "react";
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
import { Link } from "react-router-dom";
import { slugify } from "@/lib/slug";

const normalizeType = (type: string) =>
  type.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const isEventsType = (type: Project["type"]) => {
  const t = normalizeType(String(type)).trim();
  return t === "evenements" || t === "evenement" || t === "events" || t === "event";
};

const canonicalizeType = (type: Project["type"]) => {
  const norm = normalizeType(String(type)).trim();
  return isEventsType(type) ? "evenements" : norm;
};

const formatProjectType = (type: Project["type"]) => {
  const t = normalizeType(String(type)).trim();
  switch (t) {
    case "ia":
      return "IA";
    case "evenements":
    case "evenement":
      return "événements";
    case "reseaux":
      return "Réseaux";
    case "autres":
      return "Autres";
    default:
      return "Web";
  }
};

const ProjectsSection = () => {
  const [selectedType, setSelectedType] = useState("tous");
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

  const combinedProjects = useMemo(
    () => mergeProjects(defaultProjects, customProjects, hiddenProjectIds),
    [customProjects, hiddenProjectIds]
  );

  const projectTypes = useMemo(() => {
    // Fixed base order; ensures no duplicates
    const baseOrder: Project["type"][] = [
      "web",
      "ia",
      "reseaux",
      "evenements",
      "autres"
    ];

    const baseSet = new Set(baseOrder);
    const extras = new Set<string>();
    combinedProjects.forEach((project) => {
      const canonical = canonicalizeType(project.type);
      if (!baseSet.has(canonical as Project["type"])) extras.add(canonical);
    });

    return [...baseOrder, ...Array.from(extras)] as Project["type"][];
  }, [combinedProjects]);

  const filteredProjects =
    selectedType === "tous"
      ? combinedProjects
      : combinedProjects.filter((project) => canonicalizeType(project.type) === selectedType);

  return (
    <section id="projets" className="py-20 section-gradient">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mes <span className="hero-gradient bg-clip-text text-transparent">Projets</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Découvrez mes réalisations qui mettent en valeur mes compétences techniques
          </p>
          <ToggleGroup
            type="single"
            value={selectedType}
            onValueChange={(value) => setSelectedType(value || "tous")}
            className="justify-center mb-8"
          >
            <ToggleGroupItem value="tous" variant="outline">
              Tous
            </ToggleGroupItem>
            {projectTypes.map((type) => (
              <ToggleGroupItem key={type} value={type} variant="outline">
                {formatProjectType(type)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700">
          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              Aucun projet disponible pour cette catégorie pour le moment.
            </div>
          )}
          {filteredProjects.map((project, index) => (
            <Card
              key={project.id}
              className={`card-gradient border-border overflow-hidden group hover:shadow-lg hover:shadow-primary/10 transition-all duration-500 animate-[slide-in-right_0.5s_ease-out] opacity-0 animate-[fade-in_0.6s_ease-out_forwards]`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image/Icon */}
              <div className="h-48 bg-muted/20 flex items-center justify-center text-6xl border-b border-border group-hover:bg-muted/30 transition-colors">
                {project.visual ? (
                  <img
                    src={project.visual}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-4xl" aria-hidden="true">
                    {(project.skillHighlight || project.title)
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </div>

              <div className="p-6">
                {/* Skill highlight badge */}
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Compétences
                  </p>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 font-medium">
                    {project.skillHighlight}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Features: hide for events */}
                {false && !isEventsType(project.type) && project.features?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-sm">Fonctionnalités :</h4>
                    <ul className="space-y-1">
                      {project.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="text-primary">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies masquées sur les cards */}

                {/* Details link */}
                <div className="flex">
                  <Button size="sm" className="flex-1 hero-gradient text-white text-xs" asChild>
                    <Link to={`/projets/${slugify(project.title)}`}>En savoir plus</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;



