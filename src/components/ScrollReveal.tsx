import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";
import { useAnimationConfig } from "@/hooks/useAnimationConfig";

type AnimationType = "fade" | "slide-up" | "slide-left" | "slide-right" | "scale" | "blur" | "flip";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}

const animations: Record<AnimationType, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(20px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  flip: {
    hidden: { opacity: 0, rotateX: -80, transformPerspective: 1000 },
    visible: { opacity: 1, rotateX: 0 },
  },
};

// Simplified animations for mobile
const mobileAnimations: Record<AnimationType, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  flip: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
};

const ScrollReveal = ({
  children,
  className = "",
  animation = "slide-up",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.2,
}: ScrollRevealProps) => {
  const { shouldReduceMotion } = useAnimationConfig();
  
  const selectedAnimations = shouldReduceMotion ? mobileAnimations : animations;
  const actualDuration = shouldReduceMotion ? Math.min(duration, 0.4) : duration;
  const actualDelay = shouldReduceMotion ? Math.min(delay, 0.2) : delay;

  return (
    <motion.div
      className={className}
      variants={selectedAnimations[animation]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{
        duration: actualDuration,
        delay: actualDelay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}) => {
  const { shouldReduceMotion } = useAnimationConfig();
  const actualStagger = shouldReduceMotion ? Math.min(staggerDelay, 0.05) : staggerDelay;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: actualStagger,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  className = "",
  animation = "slide-up",
}: {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
}) => {
  const { shouldReduceMotion } = useAnimationConfig();
  const selectedAnimations = shouldReduceMotion ? mobileAnimations : animations;

  return (
    <motion.div
      className={className}
      variants={selectedAnimations[animation]}
      transition={{
        duration: shouldReduceMotion ? 0.3 : 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
