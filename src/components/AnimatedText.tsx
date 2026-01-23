import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  splitBy?: "words" | "chars" | "lines";
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: {
      delayChildren: delay,
      staggerChildren: 0.03,
    },
  }),
};

const charVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

const wordVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
    },
  },
};

export const AnimatedText = ({ 
  children, 
  className = "", 
  delay = 0,
  splitBy = "chars" 
}: AnimatedTextProps) => {
  if (typeof children !== "string") {
    return <span className={className}>{children}</span>;
  }

  const text = children;

  if (splitBy === "words") {
    const words = text.split(" ");
    return (
      <motion.span
        className={`inline-block ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        custom={delay}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            className="inline-block mr-[0.25em]"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  const chars = text.split("");
  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      style={{ perspective: 500 }}
    >
      {chars.map((char, index) => (
        <motion.span
          key={index}
          variants={charVariants}
          className="inline-block"
          style={{ 
            display: char === " " ? "inline" : "inline-block",
            whiteSpace: char === " " ? "pre" : "normal"
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const AnimatedHeading = ({ 
  children, 
  className = "", 
  delay = 0 
}: AnimatedTextProps) => {
  if (typeof children !== "string") {
    return <span className={className}>{children}</span>;
  }

  const lines = children.split("\n");
  
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.2,
          },
        },
      }}
    >
      {lines.map((line, lineIndex) => (
        <motion.span
          key={lineIndex}
          className="block overflow-hidden"
          variants={{
            hidden: {},
            visible: {},
          }}
        >
          <motion.span
            className="block"
            variants={{
              hidden: { 
                y: "100%",
                opacity: 0,
                skewY: 7,
              },
              visible: {
                y: 0,
                opacity: 1,
                skewY: 0,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 100,
                },
              },
            }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </motion.span>
  );
};

export default AnimatedText;
