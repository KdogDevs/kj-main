import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

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
      // Already on home page, just scroll
      const element = document.querySelector(hash);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to home page with hash
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
    <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl">
      <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-background/70 backdrop-blur-xl border border-border/50 shadow-lg">
        <button onClick={handleHomeClick} className="font-bold text-xl tracking-tight">
          KJ
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleClick(link.href)}
              className="font-mono text-sm px-4 py-2 rounded-xl hover:bg-accent/50 transition-all duration-300"
            >
              {link.label}
            </button>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-2 rounded-2xl bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg overflow-hidden">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleClick(link.href)}
              className="block w-full text-left px-6 py-4 font-mono text-sm hover:bg-accent/50 transition-all duration-300"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;