"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, LogIn } from "lucide-react";

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      signIn("google", { callbackUrl: "/dashboard" });
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#demo" className="transition-colors hover:text-foreground">
            Interactive Demo
          </a>
          <a href="#budgets" className="transition-colors hover:text-foreground">
            Budgets
          </a>
          <a href="#analytics" className="transition-colors hover:text-foreground">
            Analytics
          </a>
          <a href="#goals" className="transition-colors hover:text-foreground">
            Goals
          </a>
          <a href="#security" className="transition-colors hover:text-foreground">
            Security
          </a>
          <a href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm" className="gap-2 shadow-md shadow-primary/20">
                  <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoogleLogin}
                  className="gap-1.5 font-medium"
                >
                  <LogIn className="h-4 w-4" /> Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={handleGoogleLogin}
                  className="gap-2 shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-card/95 backdrop-blur-md p-4 space-y-3 animate-in fade-in-0 slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-foreground transition-colors"
            >
              Interactive Demo
            </a>
            <a
              href="#budgets"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-foreground transition-colors"
            >
              Budgets
            </a>
            <a
              href="#analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-foreground transition-colors"
            >
              Analytics
            </a>
            <a
              href="#goals"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-foreground transition-colors"
            >
              Goals
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-foreground transition-colors"
            >
              Security
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-foreground transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleGoogleLogin();
                }}
                className="w-full gap-2 bg-primary"
              >
                Continue with Google
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
