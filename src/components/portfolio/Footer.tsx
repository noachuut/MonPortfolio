const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border bg-card">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="text-xl font-bold hero-gradient bg-clip-text text-transparent">
              Portfolio
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              Développeur Full Stack
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>© {currentYear} Portfolio. Tous droits réservés.</p>
            <p className="mt-1">
              Fait avec ❤️ et <span className="text-primary">React</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;