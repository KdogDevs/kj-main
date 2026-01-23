import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getAssetUrl, ASSETS } from "@/lib/storage";
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal";

const shift2streamImg = getAssetUrl(ASSETS.projectShift2stream);
const schedulespxImg = getAssetUrl(ASSETS.projectSchedulespx);

const projects = [
  {
    title: "Shift2Stream",
    description: "Professional streaming and broadcast solutions platform for content creators and media professionals",
    tags: ["React", "Streaming", "Web Design"],
    year: "2025",
    url: "https://shift2stream.com",
    image: shift2streamImg,
  },
  {
    title: "Schedule SPX",
    description: "Scheduling website displaying daily bell schedules for Saint Pius X Catholic High School students and staff",
    tags: ["React", "TypeScript", "Utility"],
    year: "2024",
    url: "https://schedulespx.com",
    image: schedulespxImg,
  },
];

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-border/50 overflow-hidden bg-card/60 backdrop-blur-sm cursor-pointer shadow-md"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.2,
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.15)",
      }}
    >
      {/* Project Preview Screenshot */}
      <div className="relative overflow-hidden aspect-video">
        <motion.img
          src={project.image}
          alt={`${project.title} preview`}
          className="w-full h-full object-cover object-top"
          loading="lazy"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 0.6 }}
        />
        
        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
      
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-mono text-sm text-muted-foreground">
                {project.year}
              </span>
              <div className="flex gap-2 flex-wrap">
                {project.tags.map((tag, tagIndex) => (
                  <motion.span
                    key={tag}
                    className="font-mono text-xs rounded-full bg-secondary/80 backdrop-blur-sm border border-border/30 px-3 py-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + tagIndex * 0.1 + 0.3 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
            <motion.h3 
              className="text-2xl md:text-3xl font-bold mb-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 0.2 }}
            >
              {project.title}
            </motion.h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <motion.div
            className="w-8 h-8 opacity-0 group-hover:opacity-100"
            initial={{ x: -10, y: 10 }}
            whileHover={{ x: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight className="w-8 h-8" />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal animation="slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">SELECTED WORK</h2>
        </ScrollReveal>
        <ScrollReveal animation="blur" delay={0.2}>
          <p className="text-muted-foreground font-mono mb-16">
            Projects I've built and shipped
          </p>
        </ScrollReveal>
        
        <div className="grid gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
