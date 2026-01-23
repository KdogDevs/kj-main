import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  
  return smoothProgress;
};

export const ScrollProgressBar = () => {
  const progress = useScrollProgress();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
      style={{ scaleX: progress }}
    />
  );
};

export const useReducedMotion = () => {
  const prefersReducedMotion = 
    typeof window !== "undefined" 
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
      : false;
  
  return prefersReducedMotion;
};

export default SmoothScroll;
