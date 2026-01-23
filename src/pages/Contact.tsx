import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { Github, Instagram, Mail, Phone, Globe, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import MagneticButton from "@/components/MagneticButton";
import { getAssetUrl, ASSETS } from "@/lib/storage";

const profilePhoto = getAssetUrl(ASSETS.profilePhoto);

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
  { name: "Email", icon: Mail, href: `mailto:${contactInfo.email}`, value: contactInfo.email },
  { name: "Phone", icon: Phone, href: `tel:${contactInfo.phone}`, value: contactInfo.phoneFormatted },
  { name: "Website", icon: Globe, href: contactInfo.website, value: "kagen.dev" },
  { name: "GitHub", icon: Github, href: contactInfo.github, value: "@KdogDevs" },
  { name: "Instagram", icon: Instagram, href: contactInfo.instagram, value: "@kagen.jensen" },
];

const Contact3DCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-20, 20]);
  
  // Multiple layers with different depths
  const layer1Z = useTransform([xSpring, ySpring], ([x, y]: number[]) => Math.abs(x) + Math.abs(y) * 30);
  const layer2Z = useTransform([xSpring, ySpring], ([x, y]: number[]) => Math.abs(x) + Math.abs(y) * 50);
  const layer3Z = useTransform([xSpring, ySpring], ([x, y]: number[]) => Math.abs(x) + Math.abs(y) * 70);
  
  // Glare effect
  const glareX = useTransform(xSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(ySpring, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);
    
    x.set(normalizedX * 0.5);
    y.set(normalizedY * 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const generateVCard = async () => {
    let photoBase64 = "";
    try {
      const response = await fetch(profilePhoto);
      const blob = await response.blob();
      const reader = new FileReader();
      photoBase64 = await new Promise((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Failed to load photo for vCard:", error);
    }

    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${contactInfo.firstName} ${contactInfo.lastName}
N:${contactInfo.lastName};${contactInfo.firstName};;;
TITLE:${contactInfo.title}
TEL;TYPE=CELL:${contactInfo.phone}
EMAIL:${contactInfo.email}
URL:${contactInfo.website}
X-SOCIALPROFILE;TYPE=github:${contactInfo.github}
X-SOCIALPROFILE;TYPE=instagram:${contactInfo.instagram}${photoBase64 ? `
PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}` : ""}
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
    <motion.div
      ref={cardRef}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1500 }}
      initial={{ opacity: 0, y: 60, rotateX: -30 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glare overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl z-20"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, hsl(var(--primary) / 0.2) 0%, transparent 50%)`,
          }}
        />
        
        {/* Header with photo - Layer 1 */}
        <motion.div 
          className="bg-secondary/50 p-8 text-center relative"
          style={{ transform: `translateZ(20px)`, transformStyle: "preserve-3d" }}
        >
          {/* Floating orbs in background */}
          <motion.div
            className="absolute top-4 left-4 w-20 h-20 rounded-full bg-primary/10 blur-2xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-primary/10 blur-2xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Profile photo with 3D effect */}
          <motion.div 
            className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-background shadow-2xl relative"
            style={{ transform: "translateZ(60px)" }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.img
              src={profilePhoto}
              alt={`${contactInfo.firstName} ${contactInfo.lastName}`}
              className="w-full h-full object-cover scale-[1.4] object-[center_25%]"
              whileHover={{ scale: 1.5 }}
              transition={{ duration: 0.4 }}
            />
            {/* Photo shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-2xl font-bold"
            style={{ transform: "translateZ(40px)" }}
          >
            {contactInfo.firstName} {contactInfo.lastName}
          </motion.h1>
          <motion.p 
            className="text-muted-foreground font-mono"
            style={{ transform: "translateZ(30px)" }}
          >
            {contactInfo.title}
          </motion.p>
        </motion.div>

        {/* Contact details - Layer 2 */}
        <motion.div 
          className="p-6 space-y-3"
          style={{ transform: "translateZ(10px)" }}
        >
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 group relative overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "hsl(var(--secondary) / 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Hover shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
              
              <motion.div 
                className="w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center flex-shrink-0 relative z-10"
                whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <social.icon className="w-5 h-5" strokeWidth={1.5} />
              </motion.div>
              <div className="min-w-0 relative z-10">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {social.name}
                </p>
                <p className="font-mono text-sm truncate">{social.value}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Download button - Layer 3 */}
        <motion.div 
          className="p-6 pt-0"
          style={{ transform: "translateZ(30px)" }}
        >
          <MagneticButton
            onClick={generateVCard}
            className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-xl font-mono"
          >
            <Download className="w-4 h-4" />
            Add to Contacts
          </MagneticButton>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CursorGlow />
      <Navigation />
      
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute top-1/4 -left-20 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono text-sm group"
            >
              <motion.span
                className="inline-block"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.span>
              Back to Home
            </Link>
          </motion.div>

          {/* 3D Contact Card */}
          <Contact3DCard />

          <motion.p 
            className="text-center text-muted-foreground text-sm mt-6 font-mono"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            Works with iCloud, Google Contacts, and more
          </motion.p>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Contact;
