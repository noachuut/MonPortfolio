import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      value: "contact@portfolio.dev",
      link: "mailto:contact@portfolio.dev"
    },
    {
      icon: "📱",
      title: "Téléphone",
      value: "+33 6 12 34 56 78",
      link: "tel:+33612345678"
    },
    {
      icon: "📍",
      title: "Localisation",
      value: "Paris, France",
      link: "#"
    },
    {
      icon: "💼",
      title: "LinkedIn",
      value: "linkedin.com/in/portfolio",
      link: "https://linkedin.com"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Me <span className="hero-gradient bg-clip-text text-transparent">Contacter</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discutons de votre prochain projet ensemble
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8 slide-in-left">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-primary">
                Restons en contact
              </h3>
              <p className="text-muted-foreground mb-8">
                Je suis toujours ouvert aux nouvelles opportunités et collaborations. 
                N'hésitez pas à me contacter pour discuter de vos projets.
              </p>
            </div>

            <div className="grid gap-4">
              {contactInfo.map((info, index) => (
                <Card key={info.title} className="card-gradient border-border p-4 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <a 
                    href={info.link} 
                    className="flex items-center gap-4 group"
                    target={info.link.startsWith('http') ? '_blank' : undefined}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <div className="text-2xl">{info.icon}</div>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {info.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">{info.value}</p>
                    </div>
                  </a>
                </Card>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Me suivre</h4>
              <div className="flex gap-4">
                {[
                  { icon: "🐙", label: "GitHub", link: "https://github.com" },
                  { icon: "🐦", label: "Twitter", link: "https://twitter.com" },
                  { icon: "📷", label: "Instagram", link: "https://instagram.com" }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-muted hover:bg-primary/10 rounded-full flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="card-gradient border-border p-8 scale-in">
            <h3 className="text-2xl font-semibold mb-6 text-primary">
              Envoyez-moi un message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                  Nom complet
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-background border-border focus:border-primary"
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-background border-border focus:border-primary"
                  placeholder="votre@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-background border-border focus:border-primary min-h-[120px]"
                  placeholder="Décrivez votre projet..."
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full hero-gradient text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 py-6 text-lg font-semibold"
              >
                Envoyer le message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;