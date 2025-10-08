import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  certifications as defaultCertifications,
  mergeCertifications,
  type Certification
} from "@/data/portfolio";
import {
  loadCustomCertifications,
  loadHiddenCertificationIds,
  subscribeToCertificationUpdates
} from "@/lib/portfolioStorage";

const CertificationsSection = () => {
  const [customCertifications, setCustomCertifications] =
    useState<Certification[]>([]);
  const [hiddenCertificationIds, setHiddenCertificationIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    setCustomCertifications(loadCustomCertifications());
    setHiddenCertificationIds(loadHiddenCertificationIds());

    const unsubscribe = subscribeToCertificationUpdates(() => {
      setCustomCertifications(loadCustomCertifications());
      setHiddenCertificationIds(loadHiddenCertificationIds());
    });

    return unsubscribe;
  }, []);

  const certifications = useMemo(
    () =>
      mergeCertifications(
        defaultCertifications,
        customCertifications,
        hiddenCertificationIds
      ),
    [customCertifications, hiddenCertificationIds]
  );

  return (
    <section id="certifications" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mes <span className="hero-gradient bg-clip-text text-transparent">Certifications</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Formations validées et compétences attestées
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.length === 0 && (
            <Card className="p-6 text-center text-muted-foreground border-dashed">
              Ajoutez vos certifications depuis l'interface d'administration pour les afficher ici.
            </Card>
          )}
          {certifications.map((certification, index) => (
            <Card
              key={certification.id}
              className="card-gradient border-border p-6 space-y-4 animate-[fade-in_0.6s_ease-out_forwards] opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {certification.image && (
                <div className="h-40 overflow-hidden rounded-lg border border-border/60">
                  <img
                    src={certification.image}
                    alt={certification.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {certification.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {certification.description}
                </p>
              </div>
              {certification.skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-foreground">
                    Compétences couvertes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {certification.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {certification.link && (
                <a
                  href={certification.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold border border-primary/20 rounded-md hero-gradient text-white"
                >
                  Consulter la certification
                </a>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
