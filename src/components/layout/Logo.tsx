"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
}

export function Logo({ className, iconSize = 20, showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1", className)}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
        <Wallet size={iconSize} className="stroke-[2.5]" />
      </div>
      {showText && (
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">
          Budget<span className="text-primary">Tracker</span>
        </span>
      )}
    </Link>
  );
}
