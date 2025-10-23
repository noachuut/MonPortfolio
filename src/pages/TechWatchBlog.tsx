import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { defaultTechWatchProfile, type SocialPlatform, type TechWatchProfile } from "@/data/portfolio";
import { loadCustomTechWatchProfile, subscribeToTechWatchProfileUpdates } from "@/lib/portfolioStorage";

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

  const renderAccountsGrid = (accounts: NonNullable<TechWatchProfile["socialAccounts"]>) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
      {accounts.map((acc) => (
        <HoverCard key={acc.id}>
          <HoverCardTrigger asChild>
            <a
              href={acc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full group focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-lg"
            >
              <Card className="p-5 h-full card-gradient border-border hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="flex flex-col gap-3 items-start">
                  <div className="w-20 h-20 rounded bg-muted/20 border border-border/60 overflow-hidden">
                    {acc.image ? (
                      <img
                        src={acc.image}
                        alt={acc.name}
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                      />
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-semibold text-primary group-hover:underline break-words">{acc.name}</span>
                    <Badge variant="secondary" className="ml-auto">{platformLabel(acc.platform)}</Badge>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{acc.description}</p>
                      </TooltipTrigger>
                      <TooltipContent>Ouvrir la chaîne</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </Card>
            </a>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex gap-3 items-start">
              <div className="w-12 h-12 rounded overflow-hidden bg-muted/20 border border-border/60">
                {acc.image ? (
                  <img src={acc.image} alt={acc.name} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0">
                <div className="font-semibold mb-1">{acc.name}</div>
                <p className="text-xs text-muted-foreground whitespace-pre-line">{acc.description}</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen section-gradient">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Ma veille technologique</h1>
          <p className="text-muted-foreground mt-2">
            Comment je m’informe au quotidien : agrégateurs, réseaux sociaux et sujets de fond.
          </p>
        </div>

        {/* daily.dev */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">daily.dev</h2>
          <Card className="p-6 card-gradient border-border hover:glow-primary transition-shadow">
            <div className="grid md:grid-cols-3 gap-8 items-center">
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
                      Place pour insérer l’image de ma DevCard daily.dev
                    </span>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-[15px] md:text-base leading-7 md:leading-7 text-muted-foreground whitespace-pre-line">
                  {profile.dailyDev?.description ||
                    "Expliquez pourquoi vous utilisez daily.dev et ce que vous en tirez (tendances, articles de fond, veille front/back/IA.)."}
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
          <h2 className="text-2xl font-semibold mb-3 text-primary">Réseaux sociaux</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Chaînes/comptes que je suis, avec une courte description de leur contenu.
          </p>
          <div className="space-y-4">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                {Array.from(accountsByPlatform.keys()).map((p) => (
                  <TabsTrigger key={p} value={p}>{platformLabel(p)}</TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all">
                {renderAccountsGrid(profile.socialAccounts || [])}
              </TabsContent>

              {Array.from(accountsByPlatform.entries()).map(([p, accounts]) => (
                <TabsContent key={p} value={p}>
                  {renderAccountsGrid(accounts)}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        <Separator className="my-10" />

        {/* Sujet favori */}
        <section>
          <Card className="p-6 card-gradient border-border">
            <h2 className="text-2xl font-semibold mb-3">{profile.favoriteTopic.title}</h2>
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2">
                <p className="text-[15px] md:text-base leading-7 md:leading-7 text-muted-foreground whitespace-pre-line">
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
          </Card>
        </section>
      </div>
    </div>
  );
};

export default TechWatchBlog;

