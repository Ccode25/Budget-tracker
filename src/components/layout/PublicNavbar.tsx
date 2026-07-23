"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#stats" className="transition-colors hover:text-foreground">
            Analytics
          </Link>
          <Link href="#security" className="transition-colors hover:text-foreground">
            Security
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="shadow-md shadow-primary/20">Get Started</Button>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card p-4 space-y-3 animate-in fade-in-0 slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-muted-foreground">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#stats"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-foreground transition-colors"
            >
              Analytics
            </Link>
            <Link
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-foreground transition-colors"
            >
              Security
            </Link>
          </nav>

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">Sign In</Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
