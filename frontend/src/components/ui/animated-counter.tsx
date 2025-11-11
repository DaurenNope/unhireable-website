"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number | string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, suffix: propSuffix = "", duration = 2, className = "" }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const valueString = typeof value === 'number' ? value.toString() : value;
    const numericValue = parseFloat(valueString.replace(/[^0-9.]/g, ""));
    const extractedSuffix = propSuffix || valueString.replace(/[0-9.]/g, "");
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration / 1000, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = numericValue * easeOutQuart;
      
      setDisplayValue(currentValue.toFixed(1) + extractedSuffix);
      
      if (now < endTime) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(valueString + extractedSuffix);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, propSuffix, duration]);

  return <span ref={ref} className={className}>{displayValue}</span>;
}
