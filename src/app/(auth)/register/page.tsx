"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";
import type { RegisterInput } from "@/features/auth/validation/auth.validation";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegisterSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await authService.register(data);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("budget_tracker_user", JSON.stringify(res.user));
        window.localStorage.setItem("budget_tracker_token", res.accessToken);
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
