import { Button } from "@/components/ui/button";
import { heroContent } from "@/data/portfolio";

const scrollToSection = (targetId: string) => {
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const HeroSection = () => {
  return (
    <section id="accueil" className="min-h-screen flex items-center justify-center section-gradient relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 hero-gradient rounded-full blur-3xl glow-primary"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl glow-accent"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10 pb-24 sm:pb-28">
        <div className="fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="block text-foreground">{heroContent.intro}</span>
            <span className="hero-gradient bg-clip-text text-transparent">
              {heroContent.name}
            </span>
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
            {heroContent.highlight}
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {heroContent.tagline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto hero-gradient text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 px-8 py-6 text-lg font-semibold"
            >
              <a href={heroContent.cvDownload.href} download>
                {heroContent.cvDownload.label}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto hero-gradient text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 px-8 py-6 text-lg font-semibold"
            >
              <a href={heroContent.cvDownload.href} download>
                {heroContent.cvDownload.label}
              </a>
            </Button>
            <Button
              onClick={() => scrollToSection(heroContent.primaryCta.targetId)}
              size="lg"
              className="w-full sm:w-auto hero-gradient text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 px-8 py-6 text-lg font-semibold"
            >
              {heroContent.primaryCta.label}
            </Button>
            <Button
              onClick={() => scrollToSection(heroContent.secondaryCta.targetId)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 px-8 py-6 text-lg"
            >
              {heroContent.secondaryCta.label}
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20 pointer-events-none">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;