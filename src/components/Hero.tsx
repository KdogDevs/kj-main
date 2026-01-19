import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-24">
      <div className="max-w-6xl w-full mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
        {/* Text Content */}
        <div className="text-center lg:text-left flex-1">
          <p className="font-mono text-sm md:text-base mb-4 tracking-wide text-muted-foreground">
            DEVELOPER / DESIGNER / BUILDER
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight mb-6">
            KAGAN
            <br />
            JENSEN
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 font-mono mx-auto lg:mx-0">
            Engineering solutions. Building experiences. Creating what's next.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="font-mono text-sm"
              onClick={scrollToProjects}
            >
              VIEW MY WORK
            </Button>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-3xl overflow-hidden border border-border/40 shadow-xl shrink-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <img src={profilePhoto} alt="Kagan Jensen" className="w-full h-full object-cover scale-[2] object-[center_20%]" />
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default Hero;