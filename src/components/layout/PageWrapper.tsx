"use client";

import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn("h-full w-full", className)}
    >
      {children}
    </motion.div>
  );
}
