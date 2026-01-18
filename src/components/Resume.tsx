const experience = [
  {
    role: "Freelance Web Developer",
    company: "Self-Employed",
    period: "2022 — Present",
    description: "Building custom websites and web applications for clients across various industries.",
  },
  {
    role: "Frontend Developer",
    company: "Tech Startup",
    period: "2020 — 2022",
    description: "Led frontend development for a B2B SaaS product, improving performance and user experience.",
  },
  {
    role: "Junior Developer",
    company: "Digital Agency",
    period: "2018 — 2020",
    description: "Developed responsive websites and contributed to large-scale web projects.",
  },
];

const skills = [
  "React / Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
  "Git",
  "REST APIs",
  "UI/UX Design",
];

const Resume = () => {
  return (
    <section id="resume" className="py-24 px-6 md:px-12 lg:px-24 border-b-2 border-border bg-secondary">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">RESUME</h2>
        <p className="text-muted-foreground font-mono mb-16">
          Experience & skills
        </p>

        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold mb-8 border-b-2 border-border pb-4">
              EXPERIENCE
            </h3>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-border pl-6">
                  <span className="font-mono text-sm text-muted-foreground">
                    {exp.period}
                  </span>
                  <h4 className="text-xl font-bold mt-1">{exp.role}</h4>
                  <p className="text-muted-foreground font-mono text-sm">
                    {exp.company}
                  </p>
                  <p className="mt-2 text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8 border-b-2 border-border pb-4">
              SKILLS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="border-2 border-border p-4 font-mono text-sm hover:bg-accent transition-colors"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
