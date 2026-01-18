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
    <section id="services" className="py-24 px-6 md:px-12 lg:px-24 border-b-2 border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">SERVICES</h2>
        <p className="text-muted-foreground font-mono mb-16">
          What I can do for you
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="border-2 border-border p-8 bg-card shadow-sm hover:shadow-md hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <service.icon className="w-10 h-10 mb-6" strokeWidth={1.5} />
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
