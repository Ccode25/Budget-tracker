import type { Metadata } from "next";
import { ImportWizard } from "@/features/import/components/ImportWizard";
import { Container } from "@/components/layout/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata: Metadata = {
  title: "Import Transactions — BudgetTracker",
  description: "Upload and process CSV or Excel bank statements.",
};

export default function ImportPage() {
  return (
    <PageWrapper>
      <Container className="py-6">
        <ImportWizard />
      </Container>
    </PageWrapper>
  );
}
