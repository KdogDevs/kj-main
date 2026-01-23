import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { getAssetUrl, ASSETS } from "@/lib/storage";
import { AnimatedHeading } from "./AnimatedText";
import MagneticButton from "./MagneticButton";
import { FloatingElement } from "./ParallaxSection";

const profilePhoto = getAssetUrl(ASSETS.profilePhoto);

const Hero = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-20 pb-24 md:pt-24 md:pb-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div 
        className="max-w-6xl w-full mx-auto flex flex-col-reverse lg:flex-row items-center gap-8 md:gap-12 lg:gap-16"
        style={{ opacity, scale, y }}
      >
        {/* Text Content */}
        <div className="text-center lg:text-left flex-1">
          <motion.p 
            className="font-mono text-xs md:text-sm lg:text-base mb-3 md:mb-4 tracking-wide text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            DEVELOPER / DESIGNER / BUILDER
          </motion.p>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight tracking-tight mb-4 md:mb-6">
            <AnimatedHeading delay={0.4}>
              {"KAGEN\nJENSEN"}
            </AnimatedHeading>
          </h1>
          
          <motion.p 
            className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mb-8 md:mb-10 font-mono mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Engineering solutions. Building experiences. Creating what's next.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <MagneticButton 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-xl font-mono"
              onClick={scrollToProjects}
            >
              VIEW MY WORK
            </MagneticButton>
          </motion.div>
        </div>

        {/* Profile Picture with parallax */}
        <motion.div 
          className="w-40 h-40 md:w-56 md:h-56 lg:w-80 lg:h-80 rounded-3xl overflow-hidden border border-border/40 shadow-xl shrink-0"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            delay: 0.6 
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.25)",
          }}
        >
          <motion.img 
            src={profilePhoto} 
            alt="Kagen Jensen" 
            className="w-full h-full object-cover scale-[1.8] md:scale-[1.4] object-[center_20%] md:object-[center_25%]"
            whileHover={{ scale: 1.9 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <FloatingElement 
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        duration={2}
        distance={8}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </FloatingElement>
    </section>
  );
};

export default Hero;
