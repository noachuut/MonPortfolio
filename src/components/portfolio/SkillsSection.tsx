import { Card } from "@/components/ui/card";

const SkillsSection = () => {
  const skillCategories = [
    {
      title: "Frontend",
        skills: [
        { name: "React", icon: "⚛️" },
        { name: "TypeScript", icon: "📘" },
        { name: "CSS/SASS", icon: "🎨" },
        { name: "Tailwind CSS", icon: "💨" },
      ]
    },
    {
      title: "Backend",
        skills: [
        { name: "Node.js", icon: "🟢" },
        { name: "Python", icon: "🐍" },
        { name: "Express", icon: "🚀" },
        { name: "PostgreSQL", icon: "🐘" },
      ]
    },
    {
      title: "Outils",
        skills: [
        { name: "Git", icon: "🔧" },
        { name: "Docker", icon: "🐳" },
        { name: "AWS", icon: "☁️" },
        { name: "Figma", icon: "🎯" },
      ]
    }
  ];

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
          {skillCategories.map((category, categoryIndex) => (
            <Card key={category.title} className={`card-gradient border-border p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-500 scale-in`} style={{ animationDelay: `${categoryIndex * 0.2}s` }}>
              <h3 className="text-2xl font-semibold mb-6 text-center text-primary">
                {category.title}
              </h3>
              
                <div className="grid grid-cols-2 gap-4">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                    <span className="text-2xl">{skill.icon}</span>
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