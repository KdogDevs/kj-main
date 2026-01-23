import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getAssetUrl, ASSETS } from "@/lib/storage";
import ScrollReveal from "./ScrollReveal";
import TiltCard3D, { Floating3DElement } from "./TiltCard3D";
import { useAnimationConfig } from "@/hooks/useAnimationConfig";

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
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
  },
  {
    title: "Schedule SPX",
    description: "Scheduling website displaying daily bell schedules for Saint Pius X Catholic High School students and staff",
    tags: ["React", "TypeScript", "Utility"],
    year: "2024",
    url: "https://schedulespx.com",
    image: schedulespxImg,
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
  },
];

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const { shouldReduceMotion, isMobile } = useAnimationConfig();

  const cardContent = (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-border/50 overflow-hidden bg-card/60 backdrop-blur-sm cursor-pointer shadow-md h-full relative"
    >
      {/* Gradient overlay on hover - desktop only */}
      {!isMobile && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none`}
        />
      )}
      
      {/* Project Preview Screenshot */}
      <div className="relative overflow-hidden aspect-video">
        {isMobile ? (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <Floating3DElement depth={20}>
            <motion.img
              src={project.image}
              alt={`${project.title} preview`}
              className="w-full h-full object-cover object-top"
              loading="lazy"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
          </Floating3DElement>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
      </div>
      
      <div className="p-6 md:p-8 relative z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2 flex-wrap">
              <span className="font-mono text-sm text-muted-foreground">
                {project.year}
              </span>
              <div className="flex gap-2 flex-wrap">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs rounded-full bg-secondary/80 backdrop-blur-sm border border-border/30 px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              {project.title}
            </h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          {!isMobile && (
            <Floating3DElement depth={50}>
              <div className="w-12 h-12 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-border/30">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </Floating3DElement>
          )}
        </div>
      </div>
    </a>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 30 : 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ 
        duration: shouldReduceMotion ? 0.4 : 0.8, 
        delay: index * (shouldReduceMotion ? 0.1 : 0.2),
        ease: [0.25, 0.1, 0.25, 1] 
      }}
    >
      {isMobile ? (
        cardContent
      ) : (
        <TiltCard3D intensity={8} className="h-full">
          {cardContent}
        </TiltCard3D>
      )}
    </motion.div>
  );
};

const Projects = () => {
  const { isMobile } = useAnimationConfig();

  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-24 relative">
      {/* Background decoration - desktop only */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl -translate-y-1/2"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}
      
      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal animation="slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            SELECTED WORK
          </h2>
        </ScrollReveal>
        <ScrollReveal animation="fade" delay={0.1}>
          <p className="text-muted-foreground font-mono mb-16">
            Projects I've built and shipped
          </p>
        </ScrollReveal>
        
        <div className="grid gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
