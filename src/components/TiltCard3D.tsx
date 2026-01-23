import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useAnimationConfig } from "@/hooks/useAnimationConfig";

interface TiltCard3DProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glareEnabled?: boolean;
  perspective?: number;
}

const TiltCard3D = ({
  children,
  className = "",
  intensity = 15,
  glareEnabled = true,
  perspective = 1000,
}: TiltCard3DProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { disableMouseEffects, shouldReduceMotion } = useAnimationConfig();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Lighter spring for mobile
  const springConfig = shouldReduceMotion 
    ? { damping: 30, stiffness: 400 } 
    : { damping: 20, stiffness: 300 };
  
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  const actualIntensity = shouldReduceMotion ? intensity * 0.5 : intensity;
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [actualIntensity, -actualIntensity]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-actualIntensity, actualIntensity]);
  
  const glareX = useTransform(xSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(ySpring, [-0.5, 0.5], [0, 100]);
  const glareOpacity = useTransform(
    [xSpring, ySpring],
    ([latestX, latestY]: number[]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return Math.min(distance * 0.5, 0.15);
    }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Skip on touch devices
    if (disableMouseEffects || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
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

  // On touch devices, render without 3D transforms
  if (disableMouseEffects) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        
        {glareEnabled && !shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-[inherit]"
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, hsl(var(--primary) / 0.3) 0%, transparent 50%)`,
              opacity: glareOpacity,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export const Floating3DElement = ({
  children,
  className = "",
  depth = 50,
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
}) => {
  const { disableMouseEffects } = useAnimationConfig();
  
  // No 3D transform on touch devices
  if (disableMouseEffects) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      style={{
        transformStyle: "preserve-3d",
        transform: `translateZ(${depth}px)`,
      }}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard3D;
