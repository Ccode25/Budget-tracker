"use client";

import { ShieldCheck, Lock, Database, UserCheck, KeyRound } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SecuritySection() {
  return (
    <section id="security" className="py-20 bg-muted/20 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 rounded-full font-medium">
            <ShieldCheck className="h-3.5 w-3.5" /> Bank-Grade Infrastructure
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Built from the Ground Up for Data Privacy & Protection
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            We employ industry-leading encryption and OAuth 2.0 authentication so your financial logs remain private.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border/60 bg-card/80 p-5 space-y-3 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <KeyRound className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Google OAuth 2.0</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No weak passwords. Authenticate securely using your Google identity with multi-factor support.
            </p>
          </Card>

          <Card className="border-border/60 bg-card/80 p-5 space-y-3 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">256-Bit SSL Encryption</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All data transmitted between your browser and our servers is encrypted with TLS 1.3 standards.
            </p>
          </Card>

          <Card className="border-border/60 bg-card/80 p-5 space-y-3 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Serverless Neon Postgres</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Isolated user table rows with strict foreign key constraints and automated point-in-time recovery.
            </p>
          </Card>

          <Card className="border-border/60 bg-card/80 p-5 space-y-3 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Zero Data Selling</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your financial records belong exclusively to you. We never sell or share user data with third-party advertisers.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
