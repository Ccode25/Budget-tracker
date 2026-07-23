"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { ResetPasswordInput } from "@/features/auth/validation/auth.validation";

interface ResetPasswordFormProps {
  token?: string;
  onSubmit?: (data: ResetPasswordInput) => Promise<void> | void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function ResetPasswordForm({ token = "", onSubmit, isLoading = false, errorMessage }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    if (onSubmit) {
      try {
        await onSubmit({ token, newPassword });
      } catch (err: any) {
        setFormError(err.message || "Password reset failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorMessage message={errorMessage || formError} />

      <FormField label="New Password" htmlFor="newPassword" hint="At least 8 characters, 1 uppercase & 1 number">
        <Input
          id="newPassword"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </FormField>

      <FormField label="Confirm New Password" htmlFor="confirmPassword">
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </FormField>

      <Button type="submit" className="w-full h-10 font-semibold shadow-md" disabled={isLoading}>
        {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
        Reset Password
      </Button>

      <p className="text-center text-xs text-muted-foreground pt-2">
        Return to{" "}
        <Link href="/login" className="text-primary hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </form>
  );
}
