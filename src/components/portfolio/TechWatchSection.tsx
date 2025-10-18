import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  mergeTechWatchArticles,
  techWatchArticles as defaultArticles,
  type TechWatchArticle
} from "@/data/portfolio";
import {
  loadCustomArticles,
  loadHiddenArticleIds,
  subscribeToArticleUpdates
} from "@/lib/portfolioStorage";

const TechWatchSection = () => {
  const [customArticles, setCustomArticles] = useState<TechWatchArticle[]>([]);
  const [hiddenArticleIds, setHiddenArticleIds] = useState<string[]>([]);

  useEffect(() => {
    setCustomArticles(loadCustomArticles());
    setHiddenArticleIds(loadHiddenArticleIds());

    const unsubscribe = subscribeToArticleUpdates(() => {
      setCustomArticles(loadCustomArticles());
      setHiddenArticleIds(loadHiddenArticleIds());
    });

    return unsubscribe;
  }, []);

  const articles = useMemo(
    () =>
      mergeTechWatchArticles(
        defaultArticles,
        customArticles,
        hiddenArticleIds
      ),
    [customArticles, hiddenArticleIds]
  );

  return (
    <section id="veille" className="py-20 section-gradient">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ma <span className="hero-gradient bg-clip-text text-transparent">Veille technologique</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Articles, ressources et innovations qui nourrissent ma réflexion
          </p>
          <div className="mt-6 flex justify-center">
            <a href="/veille-technologique" className="inline-flex items-center px-4 py-2 rounded bg-primary text-white hover:opacity-95 text-sm">Ma m�thode de veille</a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length === 0 && (
            <Card className="p-6 text-center text-muted-foreground border-dashed">
              Ajoutez vos découvertes depuis l'espace d'administration.
            </Card>
          )}
          {articles.map((article, index) => (
            <Card
              key={article.id}
              className="card-gradient border-border overflow-hidden flex flex-col animate-[fade-in_0.6s_ease-out_forwards] opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {article.image && (
                <div className="h-44 overflow-hidden border-b border-border/60">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {article.publishedAt || "Veille"}
                  </p>
                  <h3 className="text-xl font-semibold text-primary mt-2">
                    {article.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {article.summary || "Résumé à ajouter via l'administration."}
                </p>
                <Button asChild size="sm" className="self-start hero-gradient text-white">
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    Lire l'article
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechWatchSection;
