import { useEffect } from "react";
import { Github, Instagram, Mail, Phone, Globe, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import profilePhoto from "@/assets/profile-photo.jpg";

const contactInfo = {
  firstName: "Kagen",
  lastName: "Jensen",
  title: "Software Developer",
  email: "kagen@kagen.dev",
  phone: "+16782003197",
  phoneFormatted: "+1 (678) 200-3197",
  website: "https://kagen.dev",
  github: "https://github.com/KdogDevs",
  instagram: "https://instagram.com/kagen.jensen",
};

const socials = [
  {
    name: "Email",
    icon: Mail,
    href: `mailto:${contactInfo.email}`,
    value: contactInfo.email,
  },
  {
    name: "Phone",
    icon: Phone,
    href: `tel:${contactInfo.phone}`,
    value: contactInfo.phoneFormatted,
  },
  {
    name: "Website",
    icon: Globe,
    href: contactInfo.website,
    value: "kagen.dev",
  },
  {
    name: "GitHub",
    icon: Github,
    href: contactInfo.github,
    value: "@KdogDevs",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: contactInfo.instagram,
    value: "@kagen.jensen",
  },
];

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const generateVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${contactInfo.firstName} ${contactInfo.lastName}
N:${contactInfo.lastName};${contactInfo.firstName};;;
TITLE:${contactInfo.title}
TEL;TYPE=CELL:${contactInfo.phone}
EMAIL:${contactInfo.email}
URL:${contactInfo.website}
X-SOCIALPROFILE;TYPE=github:${contactInfo.github}
X-SOCIALPROFILE;TYPE=instagram:${contactInfo.instagram}
END:VCARD`;

    const blob = new Blob([vCard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${contactInfo.firstName}_${contactInfo.lastName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-lg mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Contact Card */}
          <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-lg overflow-hidden">
            {/* Header with photo */}
            <div className="bg-secondary/50 p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-background shadow-lg">
                <img
                  src={profilePhoto}
                  alt={`${contactInfo.firstName} ${contactInfo.lastName}`}
                  className="w-full h-full object-cover scale-[1.4] object-[center_25%]"
                />
              </div>
              <h1 className="text-2xl font-bold">
                {contactInfo.firstName} {contactInfo.lastName}
              </h1>
              <p className="text-muted-foreground font-mono">{contactInfo.title}</p>
            </div>

            {/* Contact details */}
            <div className="p-6 space-y-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <social.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {social.name}
                    </p>
                    <p className="font-mono text-sm truncate">{social.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Download button */}
            <div className="p-6 pt-0">
              <Button
                onClick={generateVCard}
                className="w-full rounded-xl font-mono gap-2"
                size="lg"
              >
                <Download className="w-4 h-4" />
                Add to Contacts
              </Button>
            </div>
          </div>

          <p className="text-center text-muted-foreground text-sm mt-6 font-mono">
            Works with iCloud, Google Contacts, and more
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
