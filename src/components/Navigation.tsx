import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import MagneticButton from "./MagneticButton";

const navLinks = [
  { label: "Work", href: "/#projects" },
  { label: "Resume", href: "/#resume" },
  { label: "Connect", href: "/#socials" },
  { label: "Services", href: "/#services" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (href: string) => {
    setIsOpen(false);
    
    const isHomePage = location.pathname === "/";
    const hash = href.replace("/", "");
    
    if (isHomePage) {
      const element = document.querySelector(hash);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  const handleHomeClick = () => {
    setIsOpen(false);
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <motion.nav 
      className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.1 
      }}
    >
      <motion.div 
        className="flex items-center justify-between px-6 py-3 rounded-2xl bg-background/70 backdrop-blur-xl border border-border/50 shadow-lg"
        whileHover={{ boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.1)" }}
      >
        <MagneticButton 
          onClick={handleHomeClick} 
          className="font-bold text-xl tracking-tight bg-transparent border-none"
          strength={0.3}
        >
          KJ
        </MagneticButton>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link, index) => (
            <motion.button
              key={link.label}
              onClick={() => handleClick(link.href)}
              className="font-mono text-sm px-4 py-2 rounded-xl hover:bg-accent/50 transition-colors relative overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="absolute inset-0 bg-accent/30 rounded-xl"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <span className="relative z-10">{link.label}</span>
            </motion.button>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden mt-2 rounded-2xl bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg overflow-hidden"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {navLinks.map((link, index) => (
              <motion.button
                key={link.label}
                onClick={() => handleClick(link.href)}
                className="block w-full text-left px-6 py-4 font-mono text-sm hover:bg-accent/50 transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98, backgroundColor: "hsl(var(--accent) / 0.5)" }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
