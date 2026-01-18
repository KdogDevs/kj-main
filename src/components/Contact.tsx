import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 lg:px-24 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">LET'S WORK TOGETHER</h2>
        <p className="font-mono mb-16 opacity-80">
          Have a project in mind? Let's talk.
        </p>

        <div className="grid md:grid-cols-2 gap-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="font-mono text-sm mb-2 block">
                NAME
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-primary-foreground text-primary border-2 border-primary-foreground"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-mono text-sm mb-2 block">
                EMAIL
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-primary-foreground text-primary border-2 border-primary-foreground"
              />
            </div>
            <div>
              <label htmlFor="message" className="font-mono text-sm mb-2 block">
                MESSAGE
              </label>
              <Textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="bg-primary-foreground text-primary border-2 border-primary-foreground resize-none"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full font-mono shadow-md hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              SEND MESSAGE
            </Button>
          </form>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">CONTACT INFO</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5" />
                  <span className="font-mono">hello@kaganjensen.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5" />
                  <span className="font-mono">Available Remotely</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-lg opacity-80">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
