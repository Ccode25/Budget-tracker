"use client";

import { useImportWizard } from "../hooks/useImportWizard";
import { WizardStepIndicator } from "./WizardStepIndicator";
import { FileDropzone } from "./FileDropzone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, FileText, Check, AlertTriangle } from "lucide-react";
import { MOCK_CATEGORIES } from "@/features/categories/mock/categories";
import { StandardField } from "@/types/import";

interface ImportWizardProps {
  onClose?: () => void;
}

export function ImportWizard({ onClose }: ImportWizardProps) {
  const {
    state,
    handleSelectFile,
    updateMapping,
    updateRowCategory,
    updateDuplicateChoice,
    setStep,
    finishImport,
    reset,
  } = useImportWizard();

  const STANDARD_FIELDS: Array<{ field: StandardField; label: string }> = [
    { field: "date", label: "Date" },
    { field: "description", label: "Description" },
    { field: "amount", label: "Amount (+/-)" },
    { field: "debit", label: "Debit (Expenses)" },
    { field: "credit", label: "Credit (Income)" },
    { field: "balance", label: "Balance" },
    { field: "ignore", label: "-- Ignore Column --" },
  ];

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border border-border overflow-hidden">
      <WizardStepIndicator currentStep={state.step} />

      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        {state.errorMessage && (
          <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-3 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold">Validation Error</p>
              <p className="text-xs opacity-90">{state.errorMessage}</p>
            </div>
            <Button variant="outline" size="sm" onClick={reset}>
              Try Again
            </Button>
          </div>
        )}

        {/* Step 1: Upload */}
        {state.step === "upload" && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold tracking-tight">Upload Bank Statement</h2>
              <p className="text-sm text-muted-foreground">
                Import your recent transactions from a CSV or Excel file.
              </p>
            </div>
            <FileDropzone onFileSelected={handleSelectFile} disabled={state.isProcessing} />
          </div>
        )}

        {/* Step 2: Validate */}
        {state.step === "validate" && (
          <div className="space-y-6 text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
            <div>
              <h2 className="text-xl font-bold">File Parsed Successfully</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Detected <span className="font-bold text-foreground">{state.parseResult?.totalRows}</span> rows and{" "}
                <span className="font-bold text-foreground">{state.parseResult?.headers.length}</span> columns.
              </p>
            </div>
            <Button className="gap-2" onClick={() => setStep("map")}>
              Continue to Mapping <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 3: Map Columns */}
        {state.step === "map" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold">Map Columns</h2>
              <p className="text-xs text-muted-foreground">Match raw statement headers to standard transaction fields.</p>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Header</TableHead>
                    <TableHead>Maps To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.mappings.map((m) => (
                    <TableRow key={m.sourceHeader}>
                      <TableCell className="font-medium">{m.sourceHeader}</TableCell>
                      <TableCell>
                        <select
                          value={m.targetField || "ignore"}
                          onChange={(e) =>
                            updateMapping(
                              m.sourceHeader,
                              e.target.value === "ignore" ? null : (e.target.value as StandardField)
                            )
                          }
                          className="w-full max-w-xs rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {STANDARD_FIELDS.map((f) => (
                            <option key={f.field} value={f.field}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("upload")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setStep("preview")}>
                Preview Data <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {state.step === "preview" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold">Data Preview</h2>
              <p className="text-xs text-muted-foreground">Review normalized data extracted from your file.</p>
            </div>

            <div className="rounded-xl border border-border overflow-hidden max-h-72 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.mappedRows.slice(0, 10).map((row) => (
                    <TableRow key={row.rowIndex}>
                      <TableCell className="text-xs">{row.date}</TableCell>
                      <TableCell className="text-xs font-medium">{row.description}</TableCell>
                      <TableCell className="text-xs text-right font-semibold">
                        ₱{Math.abs(row.amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("map")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setStep("categorize")}>
                Auto Categorize <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Categorize */}
        {state.step === "categorize" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold">Auto-Categorization</h2>
              <p className="text-xs text-muted-foreground">Override assigned categories if needed.</p>
            </div>

            <div className="rounded-xl border border-border overflow-hidden max-h-72 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.categorizedRows.slice(0, 10).map((row) => (
                    <TableRow key={row.rowIndex}>
                      <TableCell className="text-xs font-medium">{row.description}</TableCell>
                      <TableCell>
                        <select
                          value={row.categoryId}
                          onChange={(e) => {
                            const cat = MOCK_CATEGORIES.find((c) => c.id === e.target.value);
                            if (cat) updateRowCategory(row.rowIndex, cat.id, cat.name);
                          }}
                          className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {MOCK_CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("preview")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setStep("review")}>
                Check Duplicates <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 6: Review Duplicates */}
        {state.step === "review" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold">Duplicate Detection</h2>
              <p className="text-xs text-muted-foreground">Rows matching existing transactions are flagged below.</p>
            </div>

            <div className="space-y-3">
              {state.duplicateFlags.filter((d) => d.isDuplicate).length === 0 ? (
                <div className="p-6 rounded-xl border border-border bg-muted/20 text-center text-xs text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  No potential duplicate transactions detected.
                </div>
              ) : (
                state.duplicateFlags
                  .filter((d) => d.isDuplicate)
                  .map((d) => {
                    const row = state.categorizedRows.find((r) => r.rowIndex === d.rowIndex);
                    return (
                      <div
                        key={d.rowIndex}
                        className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                          <div className="text-xs">
                            <span className="font-semibold">{row?.description}</span> — ₱{row?.amount} ({row?.date})
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={d.userChoice === "skip" ? "default" : "outline"}
                            className="h-7 text-xs"
                            onClick={() => updateDuplicateChoice(d.rowIndex, "skip")}
                          >
                            Skip
                          </Button>
                          <Button
                            size="sm"
                            variant={d.userChoice === "import" ? "default" : "outline"}
                            className="h-7 text-xs"
                            onClick={() => updateDuplicateChoice(d.rowIndex, "import")}
                          >
                            Import Anyway
                          </Button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("categorize")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button className="gap-2" onClick={finishImport}>
                Complete Import <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 7: Complete */}
        {state.step === "complete" && (
          <div className="space-y-6 text-center py-8">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold">Import Completed!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Successfully imported{" "}
                <span className="font-bold text-foreground">{state.importResult?.imported}</span> transactions.
              </p>
            </div>

            <div className="inline-grid grid-cols-2 gap-4 text-left p-4 rounded-xl border border-border bg-card">
              <div>
                <p className="text-xs text-muted-foreground">Imported</p>
                <p className="text-lg font-bold text-emerald-500">{state.importResult?.imported}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Skipped</p>
                <p className="text-lg font-bold text-muted-foreground">{state.importResult?.skipped}</p>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Button variant="outline" onClick={reset}>
                Import Another File
              </Button>
              {onClose && <Button onClick={onClose}>Done</Button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
