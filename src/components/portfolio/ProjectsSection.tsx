import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProjectsSection = () => {
  const projects = [
    {
      title: "E-commerce Platform",
      description: "Plateforme e-commerce complète avec gestion des stocks, paiements et analytics en temps réel.",
      image: "🛒",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      skillHighlight: "React",
      github: "#",
      demo: "#",
      features: [
        "Interface utilisateur moderne",
        "Paiements sécurisés",
        "Dashboard administrateur",
        "Analytics avancées"
      ]
    },
    {
      title: "Task Management App",
      description: "Application de gestion de tâches collaborative avec synchronisation temps réel.",
      image: "📋",
      technologies: ["TypeScript", "Socket.io", "MongoDB", "Express"],
      skillHighlight: "TypeScript",
      github: "#",
      demo: "#",
      features: [
        "Collaboration en temps réel",
        "Notifications push",
        "Glisser-déposer",
        "Rapports de productivité"
      ]
    },
    {
      title: "Portfolio Generator",
      description: "Outil permettant de créer des portfolios personnalisés avec des templates modernes.",
      image: "🎨",
      technologies: ["CSS", "SASS", "JavaScript", "Webpack"],
      skillHighlight: "CSS/SASS",
      github: "#",
      demo: "#",
      features: [
        "Templates personnalisables",
        "Éditeur visuel",
        "Export statique",
        "Responsive design"
      ]
    },
    {
      title: "API REST Microservice",
      description: "Architecture microservices avec API RESTful pour une application de réservation.",
      image: "⚡",
      technologies: ["Python", "FastAPI", "Docker", "Redis"],
      skillHighlight: "Python",
      github: "#",
      demo: "#",
      features: [
        "Architecture scalable",
        "Cache intelligent",
        "Documentation automatique",
        "Tests automatisés"
      ]
    },
    {
      title: "Design System",
      description: "Système de design complet avec composants réutilisables et documentation.",
      image: "🎯",
      technologies: ["Figma", "Storybook", "React", "Tailwind"],
      skillHighlight: "Figma",
      github: "#",
      demo: "#",
      features: [
        "Composants réutilisables",
        "Documentation interactive",
        "Tokens de design",
        "Accessibilité intégrée"
      ]
    },
    {
      title: "DevOps Pipeline",
      description: "Pipeline CI/CD complet avec déploiement automatisé sur AWS.",
      image: "🚀",
      technologies: ["Docker", "AWS", "Jenkins", "Terraform"],
      skillHighlight: "Docker",
      github: "#",
      demo: "#",
      features: [
        "Déploiement automatisé",
        "Monitoring intégré",
        "Rollback automatique",
        "Infrastructure as Code"
      ]
    }
  ];

  return (
    <section id="projets" className="py-20 section-gradient">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mes <span className="hero-gradient bg-clip-text text-transparent">Projets</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez mes réalisations qui mettent en valeur mes compétences techniques
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={project.title} className={`card-gradient border-border overflow-hidden group hover:shadow-lg hover:shadow-primary/10 transition-all duration-500 scale-in`} style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Project Image/Icon */}
              <div className="h-48 bg-muted/20 flex items-center justify-center text-6xl border-b border-border group-hover:bg-muted/30 transition-colors">
                {project.image}
              </div>
              
              <div className="p-6">
                {/* Skill highlight badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 font-medium">
                    Compétence: {project.skillHighlight}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                {/* Features */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Fonctionnalités :</h4>
                  <ul className="space-y-1">
                    {project.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="text-primary">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded border border-accent/20">
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs border-primary/20 hover:bg-primary/10">
                    Code
                  </Button>
                  <Button size="sm" className="flex-1 hero-gradient text-white text-xs">
                    Démo
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;