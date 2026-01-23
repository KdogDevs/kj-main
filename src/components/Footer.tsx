import { motion } from "framer-motion";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer 
      className="py-8 px-6 md:px-12 lg:px-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <motion.p 
          className="font-mono text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          © {new Date().getFullYear()} Kagen Jensen. All rights reserved.
        </motion.p>
        <motion.a
          href="https://github.com/KdogDevs"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/40 shadow-sm"
          aria-label="GitHub"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{ 
            y: -3,
            boxShadow: "0 10px 30px -10px hsl(var(--primary) / 0.2)",
            rotate: [0, -5, 5, 0],
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Github className="w-5 h-5" />
        </motion.a>
      </div>
    </motion.footer>
  );
};

export default Footer;
