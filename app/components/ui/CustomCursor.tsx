"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // No spring for the main cursor to eliminate lag
  const springX = cursorX;
  const springY = cursorY;
  
  // Keep spring for the trail blob
  const trailX = useSpring(cursorX, { stiffness: 250, damping: 20 });
  const trailY = useSpring(cursorY, { stiffness: 250, damping: 20 });

  const [isPointer, setIsPointer] = React.useState(false);

  React.useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const checkPointer = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setIsPointer(
        el.tagName === "A" ||
        el.tagName === "BUTTON" ||
        el.closest("a") !== null ||
        el.closest("button") !== null
      );
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", checkPointer);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", checkPointer);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        style={{ left: springX, top: springY }}
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-150"
      >
        <motion.div
          animate={{ scale: isPointer ? 1.6 : 1 }}
          className="w-3 h-3 rounded-full bg-accent dark:bg-accent mix-blend-difference"
        />
      </motion.div>

      {/* Trailing blob */}
      <motion.div
        style={{ left: trailX, top: trailY }}
        className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ scale: isPointer ? 2.5 : 1, opacity: isPointer ? 0.4 : 0.2 }}
          transition={{ duration: 0.3 }}
          className="w-10 h-10 rounded-full bg-primary/20"
          style={{ filter: "blur(12px)" }}
        />
      </motion.div>
    </>
  );
}
