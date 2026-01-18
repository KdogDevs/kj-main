import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Work", href: "#projects" },
  { label: "Resume", href: "#resume" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b-2 border-border">
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-24 py-4">
        <a href="#" className="font-bold text-xl tracking-tight">
          KJ
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleClick(link.href)}
              className="font-mono text-sm hover:underline underline-offset-4"
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
        <div className="md:hidden border-t-2 border-border bg-background">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleClick(link.href)}
              className="block w-full text-left px-6 py-4 font-mono text-sm border-b border-border hover:bg-accent"
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
