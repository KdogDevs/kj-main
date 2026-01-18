import { Code, Paintbrush, Rocket, Wrench } from "lucide-react";

const services = [
  {
    icon: Paintbrush,
    title: "Website Design",
    description: "Custom designs that capture your brand's essence and engage your audience.",
  },
  {
    icon: Code,
    title: "Web Development",
    description: "Clean, performant code that brings your vision to life with modern technologies.",
  },
  {
    icon: Rocket,
    title: "Launch & Deploy",
    description: "Full deployment setup with hosting, domain configuration, and performance optimization.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description: "Ongoing support and updates to keep your site running smoothly.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">SERVICES</h2>
        <p className="text-muted-foreground font-mono mb-16">
          What I can do for you
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/50 p-8 bg-card/60 backdrop-blur-sm shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/80 backdrop-blur-sm flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;