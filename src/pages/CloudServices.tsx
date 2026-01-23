import { motion } from "framer-motion";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import StatusSection from "@/components/StatusSection";
import SpeedTest from "@/components/SpeedTest";
import TiltCard3D, { Floating3DElement } from "@/components/TiltCard3D";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import MagneticButton from "@/components/MagneticButton";
import { Cloud, Film, Image, GitBranch, BookOpen, Key, FileText, ExternalLink, Gauge } from "lucide-react";

const services = [
  {
    icon: Cloud,
    name: "Nextcloud",
    description: "Personal cloud storage for file sync, sharing, and collaboration across all devices.",
    url: "https://nextcloud.atl-1.cc/",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Film,
    name: "Jellyfin",
    description: "Stream movies, TV shows, and music to any device, anywhere.",
    url: "https://jellyfin.atl-1.cc/",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Image,
    name: "Immich",
    description: "Self-hosted photo and video backup solution with powerful search and sharing.",
    url: "https://immich.atl-1.cc/",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: GitBranch,
    name: "Gitea",
    description: "Lightweight Git hosting for version control and code collaboration.",
    url: "https://git.atl-1.cc/",
    color: "from-orange-500/20 to-amber-500/20",
  },
  {
    icon: BookOpen,
    name: "Kiwix",
    description: "Offline access to educational content including Wikipedia and other resources.",
    url: "https://kiwix.atl-1.cc/",
    color: "from-teal-500/20 to-cyan-500/20",
  },
  {
    icon: Key,
    name: "Pocket ID",
    description: "Single sign-on portal to manage your account, password, and 2FA settings.",
    url: "https://id.atl-1.cc/",
    color: "from-rose-500/20 to-red-500/20",
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1] 
      }}
    >
      <TiltCard3D intensity={10} className="h-full">
        <motion.div
          className="relative rounded-2xl border border-border/50 p-8 bg-card/60 backdrop-blur-sm shadow-md h-full overflow-hidden group"
          whileHover={{ 
            boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.2)",
          }}
        >
          {/* Gradient background on hover */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <Floating3DElement depth={30}>
                <motion.div 
                  className="w-14 h-14 rounded-xl bg-secondary/80 backdrop-blur-sm flex items-center justify-center"
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <service.icon className="w-7 h-7" strokeWidth={1.5} />
                </motion.div>
              </Floating3DElement>
              <motion.a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl hover:bg-accent/50 transition-colors"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink className="w-5 h-5" />
              </motion.a>
            </div>
            <Floating3DElement depth={20}>
              <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
            </Floating3DElement>
            <p className="text-muted-foreground">{service.description}</p>
          </div>
        </motion.div>
      </TiltCard3D>
    </motion.div>
  );
};

const CloudServices = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CursorGlow />
      <Navigation />
      
      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <motion.div
              className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/3 -right-40 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl"
              animate={{
                x: [0, -80, 0],
                y: [0, -40, 0],
                scale: [1.2, 1, 1.2],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Header */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                KAGEN CLOUD
              </motion.h1>
            </motion.div>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Private cloud infrastructure powering services for the Jensen family.
            </motion.p>
          </div>

          {/* Status Section */}
          <ScrollReveal animation="slide-up" delay={0.2}>
            <StatusSection />
          </ScrollReveal>

          {/* Services Grid */}
          <section className="mb-24">
            <ScrollReveal animation="slide-up">
              <h2 className="text-2xl font-bold mb-8">Available Services</h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <ServiceCard key={index} service={service} index={index} />
              ))}
            </div>
          </section>

          {/* Documentation */}
          <motion.section 
            className="rounded-3xl bg-secondary/50 backdrop-blur-sm border border-border/50 shadow-lg p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated dots pattern */}
            <motion.div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }}
              animate={{ backgroundPosition: ["0px 0px", "24px 24px"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <FileText className="w-8 h-8" />
                </motion.div>
                <h2 className="text-2xl font-bold">Getting Started</h2>
              </div>

              <StaggerContainer staggerDelay={0.15} className="space-y-8">
                {[
                  { title: "1. Request Access", content: "Contact Kagen to get your account credentials. Each family member receives a unique login for all services." },
                  { title: "2. Sign In with Pocket ID", content: "All services use Pocket ID with passkey authentication for secure, passwordless sign-on. Sign in once and you'll have access to everything." },
                ].map((step, index) => (
                  <StaggerItem key={index}>
                    <TiltCard3D intensity={5}>
                      <motion.div 
                        className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6"
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 15px 40px -10px hsl(var(--primary) / 0.1)" 
                        }}
                      >
                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-muted-foreground">{step.content}</p>
                      </motion.div>
                    </TiltCard3D>
                  </StaggerItem>
                ))}
                
                <StaggerItem>
                  <TiltCard3D intensity={5}>
                    <motion.div 
                      className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6"
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 15px 40px -10px hsl(var(--primary) / 0.1)" 
                      }}
                    >
                      <h3 className="text-xl font-bold mb-3">3. Download Apps</h3>
                      <p className="text-muted-foreground mb-4">
                        Each service has mobile and desktop apps available for a better experience:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { name: "Nextcloud Clients", url: "https://nextcloud.com/install/#install-clients" },
                          { name: "Jellyfin Clients", url: "https://jellyfin.org/downloads/clients" },
                          { name: "Immich Mobile App", url: "https://immich.app/docs/features/mobile-app" },
                        ].map((app, i) => (
                          <motion.a 
                            key={i}
                            href={app.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                            whileHover={{ x: 5 }}
                          >
                            <ExternalLink className="w-4 h-4" /> {app.name}
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>
                  </TiltCard3D>
                </StaggerItem>
              </StaggerContainer>

              <motion.div 
                className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Need help?</strong> Reach out to Kagen for technical support or if you're having trouble accessing any services.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Tools Section */}
          <section className="mt-24">
            <ScrollReveal animation="slide-up">
              <h2 className="text-2xl font-bold mb-8">Tools</h2>
            </ScrollReveal>
            
            <motion.div 
              className="rounded-3xl bg-secondary/50 backdrop-blur-sm border border-border/50 shadow-lg p-8 md:p-12"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              whileHover={{ boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.1)" }}
            >
              <div className="flex items-center gap-3 mb-8">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-background/50 backdrop-blur-sm flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Gauge className="w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">Speed Test</h3>
                  <p className="text-sm text-muted-foreground">Test your connection speed to Kagen Cloud servers</p>
                </div>
              </div>
              
              <SpeedTest />
              
              <motion.p 
                className="mt-6 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                This speed test measures your connection to our Virginia-based servers. Results may vary based on your location and network conditions.
              </motion.p>
            </motion.div>
          </section>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default CloudServices;
