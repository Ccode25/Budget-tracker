"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSubmit = async () => {
    // Navigates to dashboard upon successful registration
    router.push("/dashboard");
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start tracking expenses, setting budgets, and achieving savings goals"
    >
      <RegisterForm onSubmit={handleRegisterSubmit} />
    </AuthLayout>
  );
}
