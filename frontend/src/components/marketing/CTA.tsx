"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Rocket, Zap, CheckCircle2 } from "lucide-react";

interface CTAProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function CTA({
  variant = "primary",
  size = "md",
  href,
  onClick,
  children,
  icon,
  fullWidth = false,
  className = "",
}: CTAProps) {
  const baseClasses = "inline-flex items-center justify-center font-black uppercase tracking-tight transition-all border-4";
  
  const variantClasses = {
    primary: "bg-black text-white border-black hover:bg-cyan-400 hover:text-black hover:border-cyan-400",
    secondary: "bg-cyan-400 text-black border-cyan-400 hover:bg-black hover:text-white hover:border-black",
    outline: "bg-white text-black border-black hover:bg-black hover:text-white",
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };
  
  const widthClasses = fullWidth ? "w-full" : "";
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`;
  
  const content = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
      <ArrowRight className="w-4 h-4 ml-2" />
    </>
  );
  
  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href={href} className={classes}>
          {content}
        </Link>
      </motion.div>
    );
  }
  
  return (
    <motion.button
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {content}
    </motion.button>
  );
}

interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
  secondaryCTA?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
  trustIndicators?: string[];
  variant?: "light" | "dark";
}

export function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  trustIndicators = [],
  variant = "light",
}: CTASectionProps) {
  const bgColor = variant === "light" ? "bg-white text-black" : "bg-black text-white";
  const borderColor = variant === "light" ? "border-black" : "border-cyan-400";
  
  return (
    <section className={`py-24 px-4 sm:px-6 md:px-8 lg:px-16 ${bgColor}`}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            {title}
          </h2>
          <p className="font-mono text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <CTA
              variant="primary"
              size="lg"
              href={primaryCTA.href}
              icon={primaryCTA.icon || <Rocket className="w-5 h-5" />}
            >
              {primaryCTA.text}
            </CTA>
            {secondaryCTA && (
              <CTA
                variant="outline"
                size="lg"
                href={secondaryCTA.href}
                icon={secondaryCTA.icon}
              >
                {secondaryCTA.text}
              </CTA>
            )}
          </div>
          
          {trustIndicators.length > 0 && (
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="font-mono text-sm text-gray-600">{indicator}</span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

interface HeroCTAProps {
  headline: string;
  subheadline: string;
  cta: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
  trustIndicators?: string[];
}

export function HeroCTA({
  headline,
  subheadline,
  cta,
  trustIndicators = [],
}: HeroCTAProps) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5 }}
    >
      <motion.div
        className="relative group mb-8"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg opacity-30"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <CTA
          variant="primary"
          size="lg"
          href={cta.href}
          icon={cta.icon || <Rocket className="w-6 h-6" />}
          className="relative text-2xl md:text-3xl lg:text-4xl px-12 md:px-16 lg:px-20 py-6 md:py-8 lg:py-10"
        >
          {cta.text}
        </CTA>
      </motion.div>
      
      <motion.p
        className="font-mono text-lg md:text-xl text-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        {subheadline}
      </motion.p>
      
      {trustIndicators.length > 0 && (
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5 }}
        >
          {trustIndicators.map((indicator, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="font-mono text-sm">{indicator}</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}


