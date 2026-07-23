"use client";

import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const handleResetSubmit = async () => {
    router.push("/login");
  };

  return <ResetPasswordForm token={token} onSubmit={handleResetSubmit} />;
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Choose a secure new password for your BudgetTracker account"
    >
      <Suspense fallback={<div className="flex justify-center p-6"><Spinner className="h-6 w-6 text-primary" /></div>}>
        <ResetPasswordFormContent />
      </Suspense>
    </AuthLayout>
  );
}
