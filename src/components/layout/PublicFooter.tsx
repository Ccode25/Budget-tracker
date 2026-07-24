"use client";

import { signIn } from "next-auth/react";
import { Logo } from "@/components/layout/Logo";

export function PublicFooter() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Personal finance and budget tracking designed with Revolut & Copilot Money aesthetics for total financial control.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Features</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li><a href="#budgets" className="hover:text-foreground transition-colors">Date-Range Budgets</a></li>
              <li><a href="#transactions" className="hover:text-foreground transition-colors">Transaction Ledger</a></li>
              <li><a href="#analytics" className="hover:text-foreground transition-colors">Revolut Analytics</a></li>
              <li><a href="#goals" className="hover:text-foreground transition-colors">Savings Goals</a></li>
              <li><a href="#categories" className="hover:text-foreground transition-colors">Custom Categories</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Quick Access</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li><a href="#demo" className="hover:text-foreground transition-colors">Live Demo Dashboard</a></li>
              <li>
                <button type="button" onClick={handleGoogleLogin} className="hover:text-foreground transition-colors text-left">
                  Sign In with Google
                </button>
              </li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ & Support</a></li>
              <li><a href="#security" className="hover:text-foreground transition-colors">Security Overview</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Security & Privacy</h3>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Bank-grade 256-bit SSL encryption. Neon Serverless Postgres cloud data protection with Google OAuth 2.0 authentication.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} BudgetTracker. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#security" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#security" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
