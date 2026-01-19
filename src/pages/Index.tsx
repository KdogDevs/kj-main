import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Resume from "@/components/Resume";
import Socials from "@/components/Socials";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Projects />
        <Resume />
        <Socials />
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
