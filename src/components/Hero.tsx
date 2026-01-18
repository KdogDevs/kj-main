import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center border-b-2 border-border px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl">
        <p className="font-mono text-sm md:text-base mb-4 tracking-wide">
          DEVELOPER / DESIGNER / BUILDER
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight mb-6">
          KAGAN
          <br />
          JENSEN
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 font-mono">
          I build websites that work hard and look sharp. Let's create something together.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button 
            size="lg" 
            className="shadow-md hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all font-mono text-sm"
            onClick={scrollToProjects}
          >
            VIEW MY WORK
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="shadow-md hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all font-mono text-sm"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            GET IN TOUCH
          </Button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6" />
      </div>
    </section>
  );
};

export default Hero;
