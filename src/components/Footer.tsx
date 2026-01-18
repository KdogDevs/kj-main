import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-6 md:px-12 lg:px-24 border-t-2 border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-sm text-muted-foreground">
          © {new Date().getFullYear()} Kagan Jensen. All rights reserved.
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 border-2 border-border hover:bg-accent transition-colors"
          aria-label="GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
