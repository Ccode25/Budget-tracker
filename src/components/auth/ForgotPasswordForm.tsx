"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CheckCircle2 } from "lucide-react";

interface ForgotPasswordFormProps {
  onSubmit?: (email: string) => Promise<void> | void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function ForgotPasswordForm({ onSubmit, isLoading = false, errorMessage }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError("Email address is required.");
      return;
    }

    if (onSubmit) {
      try {
        await onSubmit(email);
        setIsSent(true);
      } catch (err: any) {
        setFormError(err.message || "Request failed");
      }
    } else {
      setIsSent(true);
    }
  };

  if (isSent) {
    return (
      <div className="space-y-4 text-center py-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-base font-bold text-foreground">Reset Link Dispatched</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          If an account exists for <span className="font-semibold text-foreground">{email}</span>, password reset instructions have been sent.
        </p>
        <Link href="/login" className="w-full block">
          <Button variant="outline" className="w-full h-10 mt-2 text-xs font-semibold">
            Return to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorMessage message={errorMessage || formError} />

      <FormField label="Email Address" htmlFor="email" hint="Enter the email tied to your BudgetTracker account">
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </FormField>

      <Button type="submit" className="w-full h-10 font-semibold shadow-md" disabled={isLoading}>
        {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
        Send Reset Link
      </Button>

      <p className="text-center text-xs text-muted-foreground pt-2">
        Remember your password?{" "}
        <Link href="/login" className="text-primary hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </form>
  );
}
