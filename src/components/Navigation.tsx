import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Work", href: "#projects" },
  { label: "Resume", href: "#resume" },
  { label: "Services", href: "#services" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl">
      <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-background/70 backdrop-blur-xl border border-border/50 shadow-lg">
        <a href="#" className="font-bold text-xl tracking-tight">
          KJ
        </a>

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
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
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