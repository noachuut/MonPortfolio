import { Card } from "@/components/ui/card";

const ExperienceSection = () => {
  const experiences = [
    {
      title: "Développeur Full Stack Senior",
      company: "TechCorp Solutions",
      period: "2022 - Présent",
      description: "Développement d'applications web complexes avec React et Node.js. Lead technique sur plusieurs projets stratégiques.",
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      achievements: [
        "Amélioration des performances de 40%",
        "Lead d'une équipe de 5 développeurs",
        "Migration vers l'architecture microservices"
      ]
    },
    {
      title: "Développeur Frontend",
      company: "Digital Agency",
      period: "2020 - 2022",
      description: "Création d'interfaces utilisateur modernes et responsives pour des clients variés.",
      technologies: ["React", "CSS", "JavaScript", "Figma"],
      achievements: [
        "Développement de 15+ sites web",
        "Réduction du temps de chargement de 60%",
        "Implémentation de designs pixel-perfect"
      ]
    },
    {
      title: "Développeur Junior",
      company: "StartupTech",
      period: "2019 - 2020",
      description: "Participation au développement d'une plateforme SaaS innovante.",
      technologies: ["JavaScript", "Python", "MySQL", "AWS"],
      achievements: [
        "Contribution à l'architecture initiale",
        "Développement de features clés",
        "Apprentissage rapide des technologies"
      ]
    }
  ];

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
          {experiences.map((exp, index) => (
            <div key={index} className="relative">
              {/* Timeline line */}
              {index !== experiences.length - 1 && (
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