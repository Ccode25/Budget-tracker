"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export function PublicFooter() {
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
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Product</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground">Budget Planner</Link></li>
              <li><Link href="#features" className="hover:text-foreground">Transaction Tracker</Link></li>
              <li><Link href="#features" className="hover:text-foreground">Savings Goals</Link></li>
              <li><Link href="#features" className="hover:text-foreground">CSV/XLSX Import</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Resources</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-foreground">Demo Dashboard</Link></li>
              <li><Link href="/login" className="hover:text-foreground">Account Login</Link></li>
              <li><Link href="/register" className="hover:text-foreground">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Security & Privacy</h3>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Bank-grade 256-bit encryption. Neon Serverless Postgres cloud data protection.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} BudgetTracker. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
