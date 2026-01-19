const experience = [
  {
    role: "Java Engineer Intern",
    company: "MyVelo TV",
    location: "Atlanta, Georgia",
    period: "Summer 2025",
    description: "Implemented strategic features expanding platform functionality. Developed foundational code for channel rails and UI for client demos and third-party API integrations. Documented codebase architecture with comprehensive system workflow diagrams.",
  },
];

const education = [
  {
    school: "The University of Alabama",
    location: "Tuscaloosa, AL",
    degree: "Bachelor of Science in Electrical Engineering",
    period: "Expected May 2029",
    details: "Cadet in Air Force ROTC Detachment 10",
  },
  {
    school: "Saint Pius X Catholic High School",
    location: "Atlanta, Georgia",
    degree: "High School Diploma",
    period: "May 2025",
    details: "GPA: 3.40/4.00 • Head of Broadcast Club • Formation Coordinator for The Fersatti Brotherhood",
  },
];

const technicalExperience = [
  "Android TV application development with custom UI design and implementation",
  "React website development focused on aesthetic appeal and performance optimization",
  "Created Schedule SPX, a scheduling platform for daily bell schedules",
];

const Resume = () => {
  return (
    <section id="resume" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto rounded-3xl bg-secondary/50 backdrop-blur-sm border border-border/30 p-8 md:p-12 shadow-lg">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">RESUME</h2>
        <p className="text-muted-foreground font-mono mb-16">
          Kagan Jensen • kagen@kagen.dev • +1(678)-200-3197
        </p>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Left Column - Experience & Technical */}
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold mb-8 pb-4">
                WORK EXPERIENCE
              </h3>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6">
                    <span className="font-mono text-sm text-muted-foreground">
                      {exp.period}
                    </span>
                    <h4 className="text-xl font-bold mt-1">{exp.role}</h4>
                    <p className="text-muted-foreground font-mono text-sm">
                      {exp.company} • {exp.location}
                    </p>
                    <p className="mt-3 text-muted-foreground">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-8 pb-4">
                TECHNICAL EXPERIENCE
              </h3>
              <div className="space-y-3">
                {technicalExperience.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-4 text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Education */}
          <div>
            <h3 className="text-2xl font-bold mb-8 pb-4">
              EDUCATION
            </h3>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6">
                  <span className="font-mono text-sm text-muted-foreground">
                    {edu.period}
                  </span>
                  <h4 className="text-xl font-bold mt-1">{edu.school}</h4>
                  <p className="text-muted-foreground font-mono text-sm">
                    {edu.location}
                  </p>
                  <p className="mt-2 font-medium">{edu.degree}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{edu.details}</p>
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
