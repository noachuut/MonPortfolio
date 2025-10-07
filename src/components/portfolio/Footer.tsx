import { siteMeta } from "@/data/portfolio";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border bg-card">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="text-xl font-bold hero-gradient bg-clip-text text-transparent">
              {siteMeta.brand || "Portfolio"}
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{siteMeta.role}</span>
          </div>

          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>© {currentYear} {siteMeta.brand || "Portfolio"}. Tous droits réservés.</p>
            <p className="mt-1">
              Basé à {siteMeta.location}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;