"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background selection:bg-primary/20 selection:text-primary">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 h-96 w-96 bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-block">
            <Logo iconSize={24} />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>

        <Card className="border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
          <CardContent className="pt-6">{children}</CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Protected by 256-bit SSL encryption & Neon Cloud Postgres.
        </p>
      </div>
    </div>
  );
}
