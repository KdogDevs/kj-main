import { Cloud, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Services = () => {
  return (
    <section id="services" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">KAGEN CLOUD</h2>
        <p className="text-muted-foreground font-mono mb-8">
          Private cloud infrastructure for family
        </p>

        <div className="rounded-2xl border border-border/50 p-8 md:p-12 bg-card/60 backdrop-blur-sm shadow-md">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 rounded-xl bg-secondary/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Cloud className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Self-Hosted Services</h3>
              <p className="text-muted-foreground max-w-xl">
                A private cloud running on dedicated hardware, providing secure file storage, 
                media streaming, home automation, and more for the Jensen family. All data stays 
                in-house with full control over privacy and access.
              </p>
            </div>
          </div>

          <Button asChild className="rounded-xl group">
            <Link to="/cloud-services">
              View Services & Documentation
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;