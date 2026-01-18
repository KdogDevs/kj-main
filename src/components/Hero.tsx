import { Button } from "@/components/ui/button";
import { ArrowDown, User } from "lucide-react";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center border-b-2 border-border px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Profile Picture */}
        <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 border-4 border-border bg-muted flex items-center justify-center shrink-0">
          {/* Replace with your image: <img src="/your-photo.jpg" alt="Kagan Jensen" className="w-full h-full object-cover" /> */}
          <User className="w-16 h-16 md:w-24 md:h-24 text-muted-foreground" />
        </div>

        {/* Text Content */}
        <div className="text-center lg:text-left">
          <p className="font-mono text-sm md:text-base mb-4 tracking-wide">
            DEVELOPER / DESIGNER / BUILDER
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight mb-6">
            KAGAN
            <br />
            JENSEN
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 font-mono mx-auto lg:mx-0">
            I build websites that work hard and look sharp. Let's create something together.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="shadow-md hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all font-mono text-sm"
              onClick={scrollToProjects}
            >
              VIEW MY WORK
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6" />
      </div>
    </section>
  );
};

export default Hero;
