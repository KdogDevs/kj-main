import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

const CursorGlow = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Large glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${cursorXSpring}px ${cursorYSpring}px, hsl(var(--primary) / 0.03), transparent 40%)`,
        }}
      />
      {/* Small cursor follower */}
      <motion.div
        className="pointer-events-none fixed w-4 h-4 rounded-full bg-primary/30 backdrop-blur-sm z-50 hidden md:block mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
};

export default CursorGlow;
