"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { RegisterInput } from "@/features/auth/validation/auth.validation";

interface RegisterFormProps {
  onSubmit?: (data: RegisterInput) => Promise<void> | void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function RegisterForm({ onSubmit, isLoading = false, errorMessage }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name) {
      setFormError("Full name is required.");
      return;
    }
    if (!email) {
      setFormError("Email address is required.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    if (onSubmit) {
      try {
        await onSubmit({ name, email, password });
      } catch (err: any) {
        setFormError(err.message || "Registration failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorMessage message={errorMessage || formError} />

      <FormField label="Full Name" htmlFor="name">
        <Input
          id="name"
          type="text"
          placeholder="Alex Johnson"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
      </FormField>

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

      <FormField label="Password" htmlFor="password" hint="At least 8 characters, 1 uppercase & 1 number">
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </FormField>

      <Button type="submit" className="w-full h-10 font-semibold shadow-md" disabled={isLoading}>
        {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
        Create Account
      </Button>

      <p className="text-center text-xs text-muted-foreground pt-2">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </form>
  );
}
