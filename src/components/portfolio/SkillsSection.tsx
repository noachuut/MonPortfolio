import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  mergeSkillCategories,
  skillCategories as defaultSkillCategories,
  type SkillCategory
} from "@/data/portfolio";
import {
  loadCustomSkillCategories,
  loadHiddenSkillCategoryIds,
  loadHiddenSkillIds,
  subscribeToSkillUpdates
} from "@/lib/portfolioStorage";

const SkillsSection = () => {
  const [customCategories, setCustomCategories] = useState<SkillCategory[]>([]);
  const [hiddenCategoryIds, setHiddenCategoryIds] = useState<string[]>([]);
  const [hiddenSkillIds, setHiddenSkillIds] = useState<string[]>([]);

  useEffect(() => {
    setCustomCategories(loadCustomSkillCategories());
    setHiddenCategoryIds(loadHiddenSkillCategoryIds());
    setHiddenSkillIds(loadHiddenSkillIds());

    const unsubscribe = subscribeToSkillUpdates(() => {
      setCustomCategories(loadCustomSkillCategories());
      setHiddenCategoryIds(loadHiddenSkillCategoryIds());
      setHiddenSkillIds(loadHiddenSkillIds());
    });

    return unsubscribe;
  }, []);

  const categories = useMemo(
    () =>
      mergeSkillCategories(
        defaultSkillCategories,
        customCategories,
        hiddenCategoryIds,
        hiddenSkillIds
      ),
    [customCategories, hiddenCategoryIds, hiddenSkillIds]
  );

  return (
    <section id="competences" className="py-20 section-gradient">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mes <span className="hero-gradient bg-clip-text text-transparent">Compétences</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Technologies et outils que je maîtrise pour créer des solutions complètes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.length === 0 && (
            <p className="md:col-span-3 text-center text-muted-foreground">
              Ajoutez vos compétences dans <code>src/data/portfolio.ts</code> pour les afficher ici.
            </p>
          )}
          {categories.map((category, categoryIndex) => (
            <Card
              key={category.title}
              className={`card-gradient border-border p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-500 scale-in`}
              style={{ animationDelay: `${categoryIndex * 0.2}s` }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-center text-primary">
                {category.title}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {category.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-10 h-10 object-contain rounded-md bg-background/80 ring-1 ring-border p-1"
                      loading="lazy"
                    />
                    <span className="font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;


