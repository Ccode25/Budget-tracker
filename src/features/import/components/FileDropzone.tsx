"use client";

import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function FileDropzone({ onFileSelected, disabled }: FileDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={cn(
        "flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center",
        isDragActive
          ? "border-primary bg-primary/5 scale-[0.99]"
          : "border-border hover:border-primary/50 hover:bg-muted/30",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv, .xlsx, .xls"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
        <Upload className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">
        Drag & drop your bank statement here
      </h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
        Supports CSV or Excel (.xlsx) files exported from your bank account (up to 10MB).
      </p>
      <Button variant="outline" size="sm" className="mt-4 gap-2 pointer-events-none">
        <FileSpreadsheet className="h-4 w-4" /> Browse Files
      </Button>
    </div>
  );
}
