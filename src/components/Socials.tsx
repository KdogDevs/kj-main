import { motion } from "framer-motion";
import { Github, Instagram, Mail, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal";
import MagneticButton from "./MagneticButton";
import { useAnimationConfig } from "@/hooks/useAnimationConfig";

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
  const { isMobile, shouldReduceMotion } = useAnimationConfig();

  return (
    <section id="socials" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal animation="slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">CONNECT</h2>
        </ScrollReveal>
        <ScrollReveal animation="fade" delay={0.1}>
          <p className="text-muted-foreground font-mono mb-8">
            Get in touch or follow along
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" staggerDelay={0.05}>
          {socials.map((social) => (
            <StaggerItem key={social.name}>
              <motion.a
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group block rounded-2xl border border-border/50 p-6 bg-card/60 backdrop-blur-sm shadow-md h-full active:scale-[0.98] transition-transform"
                whileHover={isMobile ? {} : { 
                  y: -8,
                  boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.2)",
                }}
                whileTap={isMobile ? { scale: 0.98 } : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-secondary/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
                    whileHover={isMobile ? {} : { 
                      rotate: [0, -10, 10, 0],
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <social.icon className="w-6 h-6" strokeWidth={1.5} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold">{social.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono truncate">
                      {social.username}
                    </p>
                  </div>
                </div>
              </motion.a>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: shouldReduceMotion ? 0.2 : 0.5 }}
        >
          <Link to="/contact">
            {isMobile ? (
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-xl group active:scale-95 transition-transform">
                View Contact Card
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <MagneticButton className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-xl group">
                View Contact Card
                <motion.span
                  className="inline-block"
                  whileHover={{ x: 5 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </MagneticButton>
            )}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Socials;
