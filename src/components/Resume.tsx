import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal";
import MagneticButton from "./MagneticButton";
import { useAnimationConfig } from "@/hooks/useAnimationConfig";

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
  const { isMobile, shouldReduceMotion } = useAnimationConfig();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Kagen_Jensen_Resume.pdf';
    link.download = 'Kagen_Jensen_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="resume" className="py-24 px-6 md:px-12 lg:px-24">
      <motion.div 
        className="max-w-6xl mx-auto rounded-3xl bg-secondary/50 backdrop-blur-sm border border-border/30 p-8 md:p-12 shadow-lg"
        initial={{ opacity: 0, y: shouldReduceMotion ? 30 : 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: shouldReduceMotion ? 0.4 : 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <ScrollReveal animation="slide-right">
            <h2 className="text-4xl md:text-5xl font-bold">RESUME</h2>
          </ScrollReveal>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: shouldReduceMotion ? 0.1 : 0.3 }}
          >
            {isMobile ? (
              <Button
                onClick={handleDownload}
                className="font-mono text-sm gap-2"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD PDF
              </Button>
            ) : (
              <MagneticButton
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-xl font-mono"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD PDF
              </MagneticButton>
            )}
          </motion.div>
        </div>
        <ScrollReveal animation="fade" delay={0.1}>
          <p className="text-muted-foreground font-mono mb-16">
            Kagen Jensen • kagen@kagen.dev • +1(678)-200-3197
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Left Column - Experience & Technical */}
          <div className="space-y-12">
            <div>
              <ScrollReveal animation="slide-up">
                <h3 className="text-2xl font-bold mb-8 pb-4">
                  WORK EXPERIENCE
                </h3>
              </ScrollReveal>
              <StaggerContainer staggerDelay={0.1} className="space-y-6">
                {experience.map((exp, index) => (
                  <StaggerItem key={index}>
                    <motion.div 
                      className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6"
                      whileHover={isMobile ? {} : { 
                        scale: 1.02, 
                        boxShadow: "0 10px 30px -10px hsl(var(--primary) / 0.1)" 
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <span className="font-mono text-sm text-muted-foreground">
                        {exp.period}
                      </span>
                      <h4 className="text-xl font-bold mt-1">{exp.role}</h4>
                      <p className="text-muted-foreground font-mono text-sm">
                        {exp.company} • {exp.location}
                      </p>
                      <p className="mt-3 text-muted-foreground">{exp.description}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            <div>
              <ScrollReveal animation="slide-up">
                <h3 className="text-2xl font-bold mb-8 pb-4">
                  TECHNICAL EXPERIENCE
                </h3>
              </ScrollReveal>
              <StaggerContainer staggerDelay={0.05} className="space-y-3">
                {technicalExperience.map((item, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-4 text-muted-foreground"
                      whileHover={isMobile ? {} : { 
                        x: 10,
                        backgroundColor: "hsl(var(--accent) / 0.5)"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {item}
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>

          {/* Right Column - Education */}
          <div>
            <ScrollReveal animation="slide-up">
              <h3 className="text-2xl font-bold mb-8 pb-4">
                EDUCATION
              </h3>
            </ScrollReveal>
            <StaggerContainer staggerDelay={0.1} className="space-y-6">
              {education.map((edu, index) => (
                <StaggerItem key={index}>
                  <motion.div 
                    className="rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 p-6"
                    whileHover={isMobile ? {} : { 
                      scale: 1.02, 
                      boxShadow: "0 10px 30px -10px hsl(var(--primary) / 0.1)" 
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <span className="font-mono text-sm text-muted-foreground">
                      {edu.period}
                    </span>
                    <h4 className="text-xl font-bold mt-1">{edu.school}</h4>
                    <p className="text-muted-foreground font-mono text-sm">
                      {edu.location}
                    </p>
                    <p className="mt-2 font-medium">{edu.degree}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{edu.details}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Resume;
