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
  const photo = "/images/profile.jpg";
  const aboutText = heroContent?.tagline;

  return (
    <section id="qui-suis-je" className="py-20 section-gradient">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-10">
          Qui <span className="hero-gradient bg-clip-text text-transparent">suis‑je ?</span>
        </h2>

        <div className="flex flex-col items-center gap-6">
          <div className="relative w-40 h-40 rounded-full ring-4 ring-primary/40 shadow-xl overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/20 to-indigo-400/20 flex items-center justify-center">
            <img
              src={photo}
              alt={displayName}
              className={`w-full h-full object-cover ${imageOk ? "block" : "hidden"}`}
              loading="lazy"
              onError={() => setImageOk(false)}
            />
            {!imageOk && (
              <span className="text-4xl font-bold text-primary/80 select-none">{initials}</span>
            )}
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
