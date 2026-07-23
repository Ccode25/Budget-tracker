"use client";

import { useReducer, useCallback } from "react";
import {
  ImportStep,
  ImportWizardState,
  ColumnMapping,
  StandardField,
  DuplicateStatus,
} from "@/types/import";
import { Transaction } from "@/types/transaction";
import { getParser } from "../parsers";
import { validateFile, validateParseResult } from "../validators/file.validator";
import { autoMapColumns } from "../mappers/column.mapper";
import { autoCategorizeDescription } from "../services/categorizer";
import { detectDuplicates } from "../services/duplicate-detector";

type Action =
  | { type: "SET_FILE"; file: File }
  | { type: "SET_PARSED"; parseResult: any; mappings: ColumnMapping[]; mappedRows: any[]; categorizedRows: any[]; duplicateFlags: any[] }
  | { type: "UPDATE_MAPPING"; sourceHeader: string; targetField: StandardField | null }
  | { type: "UPDATE_ROW_CATEGORY"; rowIndex: number; categoryId: string; categoryName: string }
  | { type: "UPDATE_DUPLICATE_CHOICE"; rowIndex: number; choice: DuplicateStatus }
  | { type: "SET_STEP"; step: ImportStep }
  | { type: "SET_ERROR"; message: string }
  | { type: "COMPLETE_IMPORT"; result: any }
  | { type: "RESET" };

const initialState: ImportWizardState = {
  step: "upload",
  file: null,
  parseResult: null,
  mappings: [],
  validationResult: null,
  mappedRows: [],
  categorizedRows: [],
  duplicateFlags: [],
  importResult: null,
  isProcessing: false,
  errorMessage: null,
};

function reducer(state: ImportWizardState, action: Action): ImportWizardState {
  switch (action.type) {
    case "SET_FILE":
      return { ...initialState, file: action.file, isProcessing: true };
    case "SET_PARSED":
      return {
        ...state,
        parseResult: action.parseResult,
        mappings: action.mappings,
        mappedRows: action.mappedRows,
        categorizedRows: action.categorizedRows,
        duplicateFlags: action.duplicateFlags,
        isProcessing: false,
        step: "validate",
      };
    case "UPDATE_MAPPING":
      return {
        ...state,
        mappings: state.mappings.map((m) =>
          m.sourceHeader === action.sourceHeader
            ? { ...m, targetField: action.targetField }
            : m
        ),
      };
    case "UPDATE_ROW_CATEGORY":
      return {
        ...state,
        categorizedRows: state.categorizedRows.map((r) =>
          r.rowIndex === action.rowIndex
            ? { ...r, categoryId: action.categoryId, categoryName: action.categoryName, isAutoAssigned: false }
            : r
        ),
      };
    case "UPDATE_DUPLICATE_CHOICE":
      return {
        ...state,
        duplicateFlags: state.duplicateFlags.map((d) =>
          d.rowIndex === action.rowIndex ? { ...d, userChoice: action.choice } : d
        ),
      };
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_ERROR":
      return { ...state, errorMessage: action.message, isProcessing: false };
    case "COMPLETE_IMPORT":
      return { ...state, importResult: action.result, step: "complete" };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useImportWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSelectFile = async (file: File) => {
    dispatch({ type: "SET_FILE", file });

    const fileVal = validateFile(file);
    if (!fileVal.isValid) {
      dispatch({ type: "SET_ERROR", message: fileVal.errors[0].message });
      return;
    }

    try {
      const parser = getParser(file);
      const parseRes = await parser.parse(file);
      const parseVal = validateParseResult(parseRes);

      if (!parseVal.isValid) {
        dispatch({ type: "SET_ERROR", message: parseVal.errors[0].message });
        return;
      }

      const mappings = autoMapColumns(parseRes.headers);

      // Process mapped rows
      const mappedRows = parseRes.rows.map((row, idx) => {
        let date = "";
        let desc = "";
        let amt = 0;

        for (const m of mappings) {
          if (!m.targetField) continue;
          const val = row[m.sourceHeader] || "";
          if (m.targetField === "date") date = val;
          if (m.targetField === "description") desc = val;
          if (m.targetField === "amount") amt = parseFloat(val.replace(/[^0-9.-]/g, "")) || 0;
          if (m.targetField === "debit" && val) amt = -Math.abs(parseFloat(val.replace(/[^0-9.-]/g, "")) || 0);
          if (m.targetField === "credit" && val) amt = Math.abs(parseFloat(val.replace(/[^0-9.-]/g, "")) || 0);
        }

        return {
          rowIndex: idx,
          date: date || new Date().toISOString().slice(0, 10),
          description: desc || "Unlabeled Transaction",
          amount: amt,
          rawRow: row,
          validationErrors: [],
        };
      });

      const categorizedRows = mappedRows.map((row) => {
        const cat = autoCategorizeDescription(row.description);
        return {
          ...row,
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          isAutoAssigned: cat.isAutoAssigned,
        };
      });

      const duplicateFlags = detectDuplicates(mappedRows, []);

      dispatch({
        type: "SET_PARSED",
        parseResult: parseRes,
        mappings,
        mappedRows,
        categorizedRows,
        duplicateFlags,
      });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", message: err.message || "Failed to process file." });
    }
  };

  const updateMapping = (sourceHeader: string, targetField: StandardField | null) => {
    dispatch({ type: "UPDATE_MAPPING", sourceHeader, targetField });
  };

  const updateRowCategory = (rowIndex: number, categoryId: string, categoryName: string) => {
    dispatch({ type: "UPDATE_ROW_CATEGORY", rowIndex, categoryId, categoryName });
  };

  const updateDuplicateChoice = (rowIndex: number, choice: DuplicateStatus) => {
    dispatch({ type: "UPDATE_DUPLICATE_CHOICE", rowIndex, choice });
  };

  const setStep = (step: ImportStep) => {
    dispatch({ type: "SET_STEP", step });
  };

  const finishImport = () => {
    const toImport: any[] = [];
    let skipped = 0;
    let duplicatesSkipped = 0;

    state.categorizedRows.forEach((row) => {
      const dup = state.duplicateFlags.find((d) => d.rowIndex === row.rowIndex);
      if (dup && dup.userChoice === "skip") {
        skipped++;
        if (dup.isDuplicate) duplicatesSkipped++;
      } else {
        toImport.push({
          id: `imported-${Date.now()}-${row.rowIndex}-${Math.random().toString(36).slice(2, 7)}`,
          date: row.date,
          description: row.description,
          amount: Math.abs(row.amount),
          type: row.amount >= 0 ? "income" : "expense",
          categoryId: row.categoryId,
          status: "completed",
          importedFrom: state.file?.name,
          isImported: true,
        });
      }
    });

    // Persist imported transactions to browser localStorage
    if (typeof window !== "undefined" && toImport.length > 0) {
      try {
        const stored = window.localStorage.getItem("budget_tracker_transactions");
        const existing: Transaction[] = stored ? JSON.parse(stored) : [];
        const updated = [...toImport, ...existing];
        window.localStorage.setItem("budget_tracker_transactions", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("local-storage-update", { detail: { key: "budget_tracker_transactions", newValue: updated } }));
      } catch (err) {
        console.error("Failed to save imported transactions to localStorage:", err);
      }
    }

    dispatch({
      type: "COMPLETE_IMPORT",
      result: {
        imported: toImport.length,
        skipped,
        duplicatesSkipped,
        errors: 0,
        transactions: toImport,
      },
    });
  };

  const reset = () => dispatch({ type: "RESET" });

  return {
    state,
    handleSelectFile,
    updateMapping,
    updateRowCategory,
    updateDuplicateChoice,
    setStep,
    finishImport,
    reset,
  };
}
