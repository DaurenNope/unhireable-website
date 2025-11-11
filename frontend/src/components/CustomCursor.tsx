"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isInteractive, setIsInteractive] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const checkInteractive = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) {
        setIsInteractive(false);
        return;
      }

      // Check if hovering over interactive elements
      const isLink = target.tagName === "A" || target.closest("a");
      const isButton = target.tagName === "BUTTON" || target.closest("button");
      const isClickable = target.onclick !== null || target.getAttribute("role") === "button";
      const hasPointer = window.getComputedStyle(target).cursor === "pointer";
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";

      setIsInteractive(!!(isLink || isButton || isClickable || hasPointer || isInput));
    };

    const handleMouseMove = (e: MouseEvent) => {
      moveCursor(e);
      checkInteractive(e);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed w-8 h-8 rounded-full pointer-events-none z-[60] hidden md:block mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        backgroundColor: isInteractive ? "#a855f7" : "#06b6d4",
        scale: isInteractive ? 1.5 : 1,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    />
  );
}
