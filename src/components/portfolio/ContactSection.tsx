import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, type ReactNode } from "react";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { contactDetails, siteMeta, socialLinks } from "@/data/portfolio";

const socialIconMap: Record<string, ReactNode> = {
  github: <Github className="w-6 h-6" aria-hidden="true" />,
  linkedin: <Linkedin className="w-6 h-6" aria-hidden="true" />
};

const getSocialIcon = (key: string): ReactNode | undefined =>
  socialIconMap[key.toLowerCase()];

const contactIconMap: Record<string, ReactNode> = {
  mail: <Mail className="w-6 h-6" aria-hidden="true" />,
  email: <Mail className="w-6 h-6" aria-hidden="true" />,
  "map-pin": <MapPin className="w-6 h-6" aria-hidden="true" />,
  map: <MapPin className="w-6 h-6" aria-hidden="true" />,
  localisation: <MapPin className="w-6 h-6" aria-hidden="true" />,
  location: <MapPin className="w-6 h-6" aria-hidden="true" />
};

const getContactIcon = (key: string): ReactNode | undefined =>
  contactIconMap[key.toLowerCase()];

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: "error", message: "Veuillez remplir tous les champs." });
      return;
    }
    const emailOk = /.+@.+\..+/.test(formData.email);
    if (!emailOk) {
      setStatus({ type: "error", message: "Veuillez saisir un email valide." });
      return;
    }
    if (formData.website) {
      setStatus({ type: "success", message: "Message envoyé. Merci !" });
      setFormData({ name: "", email: "", message: "", website: "" });
      return;
    }

    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
    const web3formsKey = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

    setSubmitting(true);
    try {
      let ok = false;
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            subject: "Nouveau message depuis le portfolio",
            to: "noamorandeau@gmail.com"
          })
        });
        ok = res.ok;
      } else if (web3formsKey) {
        const payload = new FormData();
        payload.append("access_key", web3formsKey);
        payload.append("from_name", formData.name);
        payload.append("from_email", formData.email);
        payload.append("subject", "Nouveau message depuis le portfolio");
        payload.append("message", formData.message);
        payload.append("page", window.location.href);

        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: payload
        });
        ok = res.ok;
      } else {
        const subject = encodeURIComponent("Nouveau message depuis le portfolio");
        const body = encodeURIComponent(`Nom: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
        window.location.href = `mailto:noamorandeau@gmail.com?subject=${subject}&body=${body}`;
        ok = true;
      }

      if (ok) {
        setStatus({ type: "success", message: "Message envoyé. Merci !" });
        setFormData({ name: "", email: "", message: "", website: "" });
      } else {
        setStatus({ type: "error", message: "Une erreur est survenue. Réessayez plus tard." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Impossible d'envoyer le message pour le moment." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
                Basé à {siteMeta.location}, je suis toujours ouvert aux nouvelles opportunités et collaborations.
                N'hésitez pas à me contacter pour discuter de vos projets.
              </p>
            </div>

            <div className="grid gap-4">
              {contactDetails.map((info) => (
                <Card
                  key={info.title}
                  className="card-gradient border-border p-4 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                >
                  <a
                    href={info.link}
                    className="flex items-center gap-4 group"
                    target={info.link.startsWith("http") ? "_blank" : undefined}
                    rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <div className="text-2xl">
                      {getContactIcon(info.icon) ??
                        getContactIcon(info.title) ?? (
                          <span className="text-xl" aria-hidden="true">
                            {info.icon}
                          </span>
                        )}
                    </div>
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
                {socialLinks.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    Ajoutez vos réseaux sociaux dans <code>src/data/portfolio.ts</code>.
                  </span>
                )}
                {socialLinks.map((social) => {
                  const icon =
                    getSocialIcon(social.icon) ??
                    getSocialIcon(social.label) ?? (
                      <span className="text-xl" aria-hidden="true">
                        {social.icon}
                      </span>
                    );

                  return (
                    <a
                      key={social.label}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-muted hover:bg-primary/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
                      aria-label={social.label}
                    >
                      {icon}
                    </a>
                  );
                })}
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
                  placeholder={siteMeta.email}
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

              {/* Honeypot field (hidden) */}
              <div className="hidden" aria-hidden>
                <label htmlFor="website">Votre site web (laisser vide)</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange as any}
                />
              </div>

              {status.type && (
                <div className={status.type === "success" ? "text-green-600" : "text-red-600"}>
                  {status.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full hero-gradient text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 py-6 text-lg font-semibold disabled:opacity-70"
              >
                {submitting ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
