import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { defaultTechWatchProfile, type SocialPlatform, type TechWatchProfile } from "@/data/portfolio";
import {
  loadCustomTechWatchProfile,
  subscribeToTechWatchProfileUpdates
} from "@/lib/portfolioStorage";

const platformLabel = (p: SocialPlatform) => {
  switch (p) {
    case "youtube":
      return "YouTube";
    case "tiktok":
      return "TikTok";
    case "instagram":
      return "Instagram";
    default:
      return "Autres";
  }
};

const TechWatchBlog = () => {
  const [custom, setCustom] = useState<TechWatchProfile | null>(null);

  useEffect(() => {
    setCustom(loadCustomTechWatchProfile());
    const unsub = subscribeToTechWatchProfileUpdates(() => {
      setCustom(loadCustomTechWatchProfile());
    });
    return unsub;
  }, []);

  const profile = useMemo<TechWatchProfile>(
    () => ({
      ...defaultTechWatchProfile,
      ...(custom || {})
    }),
    [custom]
  );

  const accountsByPlatform = useMemo(() => {
    const map = new Map<SocialPlatform, typeof profile.socialAccounts>();
    (profile.socialAccounts || []).forEach((acc) => {
      const list = map.get(acc.platform) || [];
      list.push(acc);
      map.set(acc.platform, list);
    });
    return map;
  }, [profile.socialAccounts]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Ma veille technologique</h1>
          <p className="text-muted-foreground mt-2">
            Comment je m’informe au quotidien: agrégateurs, réseaux sociaux et sujets de fond.
          </p>
        </div>

                {/* daily.dev */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">daily.dev</h2>
          <Card className="p-6 card-gradient border-border">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1">
                <div className="border border-border/60 rounded-lg overflow-hidden bg-muted/10 h-80 md:h-[32rem] flex items-center justify-center">
                  {profile.dailyDev?.devCardImage ? (
                    <img
                      src={profile.dailyDev.devCardImage}
                      alt="Ma devCard daily.dev"
                      className="h-full w-auto object-contain"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground p-4 text-center">
                      Place pour inserer l'image de ma DevCard daily.dev
                    </span>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {profile.dailyDev?.description ||
                    "Expliquez pourquoi vous utilisez daily.dev et ce que vous en tirez (tendances, articles de fond, veille front/back/IA�)."}
                </p>
                {profile.dailyDev?.profileLink && (
                  <div className="mt-4">
                    <Button asChild size="sm" variant="outline">
                      <a href={profile.dailyDev.profileLink} target="_blank" rel="noopener noreferrer">Voir mon profil daily.dev</a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Réseaux sociaux */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">Réseaux sociaux</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Chaînes/comptes que je suis, avec une courte description de leur contenu.
          </p>
          <div className="space-y-8">
            {Array.from(accountsByPlatform.entries()).map(([platform, accounts]) => (
              <div key={platform}>
                <h3 className="text-xl font-semibold mb-3">{platformLabel(platform)}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {accounts.map((acc) => (
                    <Card key={acc.id} className="p-4 border-border">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded bg-muted/20 border border-border/60 overflow-hidden flex-shrink-0">
                          {acc.image ? (
                            <img src={acc.image} alt={acc.name} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <a
                            className="font-semibold text-primary hover:underline break-words"
                            href={acc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {acc.name}
                          </a>
                          <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">
                            {acc.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {accountsByPlatform.size === 0 && (
              <Card className="p-6 text-center text-muted-foreground border-dashed">
                Ajoutez vos comptes suivis depuis l’admin (YouTube, TikTok, Instagram…).
              </Card>
            )}
          </div>
        </section>

        <Separator className="my-10" />

        {/* Sujet favori */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">{profile.favoriteTopic.title}</h2>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {profile.favoriteTopic.content}
              </p>
            </div>
            <div className="md:col-span-1">
              <div className="border border-border/60 rounded-lg overflow-hidden bg-muted/10 h-48 flex items-center justify-center">
                {profile.favoriteTopic.image ? (
                  <img
                    src={profile.favoriteTopic.image}
                    alt={profile.favoriteTopic.title}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TechWatchBlog;

