"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { LoginInput } from "@/features/auth/validation/auth.validation";

interface LoginFormProps {
  onSubmit?: (data: LoginInput) => Promise<void> | void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function LoginForm({ onSubmit, isLoading = false, errorMessage }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError("Email address is required.");
      return;
    }
    if (!password) {
      setFormError("Password is required.");
      return;
    }

    if (onSubmit) {
      try {
        await onSubmit({ email, password });
      } catch (err: any) {
        setFormError(err.message || "Failed to sign in");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorMessage message={errorMessage || formError} />

      <FormField label="Email Address" htmlFor="email">
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

      <FormField label="Password" htmlFor="password">
        <div className="relative">
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div className="flex justify-end pt-1">
          <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
            Forgot password?
          </Link>
        </div>
      </FormField>

      <Button type="submit" className="w-full h-10 font-semibold shadow-md" disabled={isLoading}>
        {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
        Sign In
      </Button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-10 gap-2 text-xs font-medium"
        disabled={isLoading}
        onClick={() => {
          signIn("google", { callbackUrl: "/dashboard" });
        }}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Sign in with Google
      </Button>

      <p className="text-center text-xs text-muted-foreground pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline font-semibold">
          Create account
        </Link>
      </p>
    </form>
  );
}
