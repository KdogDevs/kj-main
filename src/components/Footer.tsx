import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-sm text-muted-foreground">
          © {new Date().getFullYear()} Kagan Jensen. All rights reserved.
        </p>
        <a
          href="https://github.com/KdogDevs"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          aria-label="GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;