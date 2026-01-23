import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      "ontouchstart" in window || 
      navigator.maxTouchPoints > 0
    );
  }, []);

  return isTouch;
};

export const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
};

// Combined hook for animation optimization
export const useAnimationConfig = () => {
  const isMobile = useIsMobile();
  const isTouch = useIsTouchDevice();
  const prefersReduced = usePrefersReducedMotion();

  return {
    isMobile,
    isTouch,
    prefersReduced,
    // Should we use simplified animations?
    shouldReduceMotion: prefersReduced || isMobile,
    // Should we disable mouse-based effects?
    disableMouseEffects: isTouch,
  };
};
