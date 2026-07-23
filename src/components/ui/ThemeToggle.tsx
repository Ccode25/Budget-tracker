"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const themes = ["light", "dark", "system"] as const;
type Theme = (typeof themes)[number];

const icons: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

interface ThemeToggleProps {
  className?: string;
  iconSize?: number;
}

export function ThemeToggle({ className, iconSize = 16 }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (theme as Theme) ?? "system";

  const cycleTheme = () => {
    const idx = themes.indexOf(currentTheme);
    const next = themes[(idx + 1) % themes.length];
    setTheme(next);
  };

  const label =
    `Switch to ${themes[(themes.indexOf(currentTheme) + 1) % themes.length]} theme`;

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          "bg-muted/50",
          className,
        )}
        aria-hidden
      />
    );
  }

  const Icon = icons[currentTheme];

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-lg",
        "text-muted-foreground transition-colors duration-150",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resolvedTheme}
          initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
          <Icon size={iconSize} />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
