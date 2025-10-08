import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import {
  experiences as defaultExperiences,
  mergeExperiences,
  type Experience
} from "@/data/portfolio";
import {
  loadCustomExperiences,
  loadHiddenExperienceIds,
  subscribeToExperienceUpdates
} from "@/lib/portfolioStorage";

const ExperienceSection = () => {
  const [customExperiences, setCustomExperiences] = useState<Experience[]>([]);
  const [hiddenExperienceIds, setHiddenExperienceIds] = useState<string[]>([]);

  useEffect(() => {
    setCustomExperiences(loadCustomExperiences());
    setHiddenExperienceIds(loadHiddenExperienceIds());
    const unsubscribe = subscribeToExperienceUpdates(() => {
      setCustomExperiences(loadCustomExperiences());
      setHiddenExperienceIds(loadHiddenExperienceIds());
    });

    return unsubscribe;
  }, []);

  const combinedExperiences = useMemo(
    () =>
      mergeExperiences(
        defaultExperiences,
        customExperiences,
        hiddenExperienceIds
      ),
    [customExperiences, hiddenExperienceIds]
  );

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mon <span className="hero-gradient bg-clip-text text-transparent">Expérience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Parcours professionnel et réalisations marquantes
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {combinedExperiences.length === 0 && (
            <p className="text-center text-muted-foreground">
              Ajoutez vos expériences professionnelles depuis l'interface d'administration pour les afficher ici.
            </p>
          )}
          {combinedExperiences.map((exp, index) => (
            <div key={exp.id} className="relative">
              {/* Timeline line */}
              {index !== combinedExperiences.length - 1 && (
                <div className="absolute left-8 top-20 bottom-0 w-0.5 hero-gradient"></div>
              )}

              <div className={`flex items-start gap-8 mb-12 slide-in-left`} style={{ animationDelay: `${index * 0.3}s` }}>
                {/* Timeline dot */}
                <div className="relative">
                  <div className="w-16 h-16 hero-gradient rounded-full flex items-center justify-center glow-primary">
                    <div className="w-8 h-8 bg-background rounded-full"></div>
                  </div>
                </div>

                {/* Content */}
                <Card className="flex-1 card-gradient border-border p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  {exp.image && (
                    <div className="mb-4 flex justify-start">
                      <div className="w-32 h-32 overflow-hidden rounded-lg border border-border/60">
                        <img
                          src={exp.image}
                          alt={`Illustration de ${exp.title}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-1">{exp.title}</h3>
                      <p className="text-lg text-accent font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full mt-2 md:mt-0">
                      {exp.period}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{exp.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-foreground">Réalisations :</h4>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-primary">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;