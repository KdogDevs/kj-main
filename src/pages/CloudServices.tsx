import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Cloud, Server, Shield, Key, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Cloud,
    name: "Nextcloud",
    description: "Personal cloud storage for file sync, sharing, and collaboration across all devices.",
    url: "#",
  },
  {
    icon: Server,
    name: "Plex Media Server",
    description: "Stream movies, TV shows, and music to any device, anywhere.",
    url: "#",
  },
  {
    icon: Shield,
    name: "Home Assistant",
    description: "Smart home automation and monitoring for all connected devices.",
    url: "#",
  },
  {
    icon: Key,
    name: "Vaultwarden",
    description: "Self-hosted password manager for secure credential storage.",
    url: "#",
  },
];

const CloudServices = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">KAGEN CLOUD</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Private cloud infrastructure powering services for the Jensen family.
            </p>
          </div>

          {/* Services Grid */}
          <section className="mb-24">
            <h2 className="text-2xl font-bold mb-8">Available Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border/50 p-8 bg-card/60 backdrop-blur-sm shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-secondary/80 backdrop-blur-sm flex items-center justify-center">
                      <service.icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl hover:bg-accent/50"
                      asChild
                    >
                      <a href={service.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </Button>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Documentation */}
          <section className="rounded-3xl bg-secondary/50 backdrop-blur-sm border border-border/50 shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Getting Started</h2>
            </div>

            <div className="space-y-8">
              <div className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6 hover:bg-background/70 transition-all duration-300">
                <h3 className="text-xl font-bold mb-3">1. Request Access</h3>
                <p className="text-muted-foreground">
                  Contact Kagen to get your account credentials. Each family member receives a unique login for all services.
                </p>
              </div>

              <div className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6 hover:bg-background/70 transition-all duration-300">
                <h3 className="text-xl font-bold mb-3">2. Sign In</h3>
                <p className="text-muted-foreground">
                  Use your provided credentials to sign in to any service. Most services support single sign-on (SSO), so you only need to log in once.
                </p>
              </div>

              <div className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6 hover:bg-background/70 transition-all duration-300">
                <h3 className="text-xl font-bold mb-3">3. Set Up 2FA</h3>
                <p className="text-muted-foreground">
                  For security, enable two-factor authentication using an app like Google Authenticator or Authy. This adds an extra layer of protection to your account.
                </p>
              </div>

              <div className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6 hover:bg-background/70 transition-all duration-300">
                <h3 className="text-xl font-bold mb-3">4. Download Apps</h3>
                <p className="text-muted-foreground">
                  Each service has mobile and desktop apps available. Download them from the App Store, Google Play, or directly from the service dashboard.
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Need help?</strong> Reach out to Kagen for technical support or if you're having trouble accessing any services.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CloudServices;
