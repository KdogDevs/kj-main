import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Resume from "@/components/Resume";
import Socials from "@/components/Socials";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

const Index = () => {
  return (
    <motion.div 
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CursorGlow />
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Projects />
        <Resume />
        <Socials />
        <Services />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
