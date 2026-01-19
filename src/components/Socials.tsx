import { Github, Instagram, Mail, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const socials = [
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/KdogDevs",
    username: "@KdogDevs",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com/kagen.jensen",
    username: "@kagen.jensen",
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:kagen@kagen.dev",
    username: "kagen@kagen.dev",
  },
  {
    name: "Phone",
    icon: Phone,
    href: "tel:+16782003197",
    username: "+1 (678) 200-3197",
  },
];

const Socials = () => {
  return (
    <section id="socials" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">CONNECT</h2>
        <p className="text-muted-foreground font-mono mb-8">
          Get in touch or follow along
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group rounded-2xl border border-border/50 p-6 bg-card/60 backdrop-blur-sm shadow-md hover:bg-secondary/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <social.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold">{social.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono truncate">
                    {social.username}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <Button asChild className="rounded-xl group">
          <Link to="/contact">
            View Contact Card
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Socials;
