import { useMemo, useState } from "react";
import { heroContent, siteMeta } from "@/data/portfolio";

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? (parts.length > 2 ? parts[parts.length - 1]?.[0] : "");
  return (first + last).toUpperCase();
};

const AboutSection = () => {
  const [imageOk, setImageOk] = useState(true);
  const displayName = heroContent?.name || siteMeta.brand;
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  // You can replace this with your own photo in public/images/profile.jpg
  const photo = "/images/profile.png";
  const aboutText = (heroContent as any)?.about || heroContent?.tagline ||
    "Passionné par le développement et les nouvelles technologies, je suis actuellement alternant au sein de la DSI de l’OPT, où je mets en pratique mes compétences sur des projets concrets. Après un baccalauréat général (Maths et NSI) et une année en Licence d’Informatique, j’ai choisi de me réorienter vers le BTS SIO, une formation plus pratique et orientée métier. Ce parcours m’a permis de découvrir la richesse du domaine informatique, alliant développement, réseau, sécurité et gestion de projet. Curieux, rigoureux et toujours désireux d’apprendre, j’aime concevoir des solutions adaptées aux besoins réels et relever de nouveaux défis techniques.";

  return (
    <section id="qui-suis-je" className="py-20 section-gradient">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-10">Qui <span className="hero-gradient bg-clip-text text-transparent">suis-je ?</span></h2>

        <div className="flex flex-col items-center gap-6">
          <div className="inline-block mx-auto">
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-full p-[6px] bg-gradient-to-tr from-violet-500 via-indigo-400 to-fuchsia-500 shadow-[0_10px_30px_hsl(240_76%_65%_/_0.35)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-background/80 ring-1 ring-border/60 flex items-center justify-center">
                <img
                  src={photo}
                  alt={displayName}
                  className={`w-full h-full object-cover ${imageOk ? "block" : "hidden"}`}
                  style={{ objectPosition: "center 40%" }}
                  loading="lazy"
                  onError={() => setImageOk(false)}
                />
                {!imageOk && (
                  <span className="text-4xl md:text-5xl font-bold text-primary/80 select-none">{initials}</span>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-2xl text-muted-foreground leading-relaxed text-lg md:text-xl">
            {aboutText}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;




