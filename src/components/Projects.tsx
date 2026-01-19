import { ArrowUpRight } from "lucide-react";
import shift2streamImg from "@/assets/project-shift2stream.png";
import schedulespxImg from "@/assets/project-schedulespx.png";

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
            <a
              key={index}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-border/50 overflow-hidden bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              {/* Project Preview Screenshot */}
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.image}
                  alt={`${project.title} preview`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
              </div>
              
              <div className="p-6 md:p-8">
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;