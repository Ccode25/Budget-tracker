"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useRouter } from "next/navigation";
import type { RegisterInput } from "@/features/auth/validation/auth.validation";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegisterSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.message || body.error || "Registration failed");
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("budget_tracker_user", JSON.stringify(body.user));
        window.localStorage.setItem("budget_tracker_token", body.accessToken);
        window.localStorage.removeItem("budget_tracker_transactions"); // clear mock transactions for new real user
      }
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start tracking expenses, setting budgets, and achieving savings goals"
    >
      <RegisterForm
        onSubmit={handleRegisterSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </AuthLayout>
  );
}
