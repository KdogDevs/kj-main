import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-20 pb-24 md:pt-24 md:pb-16 relative">
      <div className="max-w-6xl w-full mx-auto flex flex-col-reverse lg:flex-row items-center gap-8 md:gap-12 lg:gap-16">
        {/* Text Content */}
        <div className="text-center lg:text-left flex-1">
          <p className="font-mono text-xs md:text-sm lg:text-base mb-3 md:mb-4 tracking-wide text-muted-foreground">
            DEVELOPER / DESIGNER / BUILDER
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight tracking-tight mb-4 md:mb-6">
            KAGEN
            <br />
            JENSEN
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mb-8 md:mb-10 font-mono mx-auto lg:mx-0">
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
        <div className="w-40 h-40 md:w-56 md:h-56 lg:w-80 lg:h-80 rounded-3xl overflow-hidden border border-border/40 shadow-xl shrink-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <img src={profilePhoto} alt="Kagen Jensen" className="w-full h-full object-cover scale-[1.4] object-[center_25%]" />
        </div>
      </div>
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default Hero;