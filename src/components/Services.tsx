import { motion } from "framer-motion";
import { Cloud, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import MagneticButton from "./MagneticButton";
import { useAnimationConfig } from "@/hooks/useAnimationConfig";

const Services = () => {
  const { isMobile, shouldReduceMotion } = useAnimationConfig();

  return (
    <section id="services" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal animation="slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">KAGEN CLOUD</h2>
        </ScrollReveal>
        <ScrollReveal animation="fade" delay={0.1}>
          <p className="text-muted-foreground font-mono mb-8">
            Private cloud infrastructure for family
          </p>
        </ScrollReveal>

        <motion.div 
          className="rounded-2xl border border-border/50 p-8 md:p-12 bg-card/60 backdrop-blur-sm shadow-md overflow-hidden relative"
          initial={{ opacity: 0, y: shouldReduceMotion ? 30 : 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: shouldReduceMotion ? 0.4 : 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          whileHover={isMobile ? {} : {
            boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.15)",
          }}
        >
          {/* Animated background pattern - desktop only */}
          {!isMobile && (
            <motion.div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
              animate={{
                backgroundPosition: ["0px 0px", "32px 32px"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
          
          <div className="flex items-start gap-6 mb-8 relative z-10">
            <motion.div 
              className="w-16 h-16 rounded-xl bg-secondary/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
              whileHover={isMobile ? {} : { 
                rotate: 360,
                scale: 1.1,
              }}
              transition={{ duration: 0.6 }}
            >
              <Cloud className="w-8 h-8" strokeWidth={1.5} />
            </motion.div>
            <div>
              <motion.h3 
                className="text-2xl font-bold mb-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: shouldReduceMotion ? 0.1 : 0.3 }}
              >
                Self-Hosted Services
              </motion.h3>
              <motion.p 
                className="text-muted-foreground max-w-xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: shouldReduceMotion ? 0.15 : 0.4 }}
              >
                A private cloud running on dedicated hardware, providing secure file storage, 
                media streaming, home automation, and more for the Jensen family. All data stays 
                in-house with full control over privacy and access.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: shouldReduceMotion ? 0.2 : 0.5 }}
            className="relative z-10"
          >
            <Link to="/cloud-services">
              {isMobile ? (
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-xl group active:scale-95 transition-transform">
                  View Services & Documentation
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <MagneticButton className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-xl group">
                  View Services & Documentation
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
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
