import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  defaultTechWatchProfile,
  type SocialPlatform,
  type TechWatchProfile,
} from "@/data/portfolio";
import {
  loadCustomTechWatchProfile,
  subscribeToTechWatchProfileUpdates,
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
      ...(custom || {}),
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

  const renderAccountsGrid = (
    accounts: NonNullable<TechWatchProfile["socialAccounts"]>
  ) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mt-6">
      {accounts.map((acc) => (
            <a key={acc.id}
              href={acc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group focus:outline-none focus:ring-2 focus:ring-violet-500/40 rounded-xl"
            >
              <Card className="p-6 h-full bg-gradient-to-br from-gray-900/60 to-gray-800/50 border border-violet-500/20 rounded-xl backdrop-blur-md hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300">
                <div className="flex gap-5 items-start">
                  <img
                    src={acc.image}
                    alt={acc.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-md shadow-violet-800/10 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-violet-300 group-hover:text-violet-400">
                        {acc.name}
                      </h3>
                      <Badge variant="secondary">{platformLabel(acc.platform)}</Badge>
                    </div>
                    <p className="text-sm text-gray-400 leading-snug">
                      {acc.description}
                    </p>
                  </div>
                </div>
              </Card>
            </a>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        {/* HERO */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">
            Ma veille technologique
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Comment je m’informe, expérimente et reste à jour sur les tendances
            du numérique et de l’intelligence artificielle.
          </p>
        </div>

        {/* DAILY.DEV */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-violet-400 flex items-center gap-2">
            🧭 daily.dev
          </h2>
          <Card className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 border border-violet-500/20 rounded-2xl backdrop-blur-md hover:border-violet-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
            <div className="grid md:grid-cols-3 gap-10 items-center p-8">
              <div className="md:col-span-1 flex justify-center">
                {profile.dailyDev?.devCardImage ? (
                  <img
                    src={profile.dailyDev.devCardImage}
                    alt="Ma devCard daily.dev"
                    className="rounded-xl w-full max-w-xs shadow-md shadow-violet-700/10 hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-sm text-gray-500">
                    Image daily.dev manquante
                  </span>
                )}
              </div>
              <div className="md:col-span-2 text-gray-300 leading-relaxed">
                <p>{profile.dailyDev?.description}</p>
                {profile.dailyDev?.profileLink && (
                  <div className="mt-5">
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={profile.dailyDev.profileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voir mon profil daily.dev
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* RÉSEAUX SOCIAUX */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-violet-400">
            🌐 Réseaux sociaux
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Chaînes et comptes que je suis, avec une courte description de leur contenu.
          </p>
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Tous</TabsTrigger>
              {Array.from(accountsByPlatform.keys()).map((p) => (
                <TabsTrigger key={p} value={p}>
                  {platformLabel(p)}
                </TabsTrigger>
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
        </section>

        <Separator className="my-14 bg-gray-700/40" />

        {/* SUJET FAVORI */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-violet-400">
            💡 {profile.favoriteTopic.title}
          </h2>
          <Card className="p-8 bg-gradient-to-br from-gray-900/60 to-gray-800/60 border border-violet-500/20 rounded-2xl hover:border-violet-400/40 hover:shadow-violet-500/10 transition-all duration-300">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line mb-6">
              {profile.favoriteTopic.content}
            </p>

            <blockquote className="border-l-4 border-violet-500 pl-4 italic text-violet-300 text-sm">
              “Comprendre comment l’IA s’intègre dans nos usages m’aide à garder un regard critique : l’objectif n’est pas de remplacer l’humain, mais de le renforcer.”
            </blockquote>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default TechWatchBlog;
