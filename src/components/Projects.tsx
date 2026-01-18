import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "Full-stack online store with payment integration and inventory management",
    tags: ["React", "Node.js", "Stripe"],
    year: "2024",
  },
  {
    title: "SaaS Dashboard",
    description: "Analytics dashboard for tracking business metrics and user engagement",
    tags: ["TypeScript", "Next.js", "PostgreSQL"],
    year: "2024",
  },
  {
    title: "Portfolio Generator",
    description: "Tool that helps creatives build stunning portfolio sites in minutes",
    tags: ["React", "Tailwind", "AI"],
    year: "2023",
  },
  {
    title: "Mobile App Companion",
    description: "Web companion app for a fitness tracking mobile application",
    tags: ["React", "API", "Charts"],
    year: "2023",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">SELECTED WORK</h2>
        <p className="text-muted-foreground font-mono mb-16">
          Projects I've built and shipped
        </p>
        
        <div className="grid gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border/50 p-6 md:p-8 bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
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
                <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;