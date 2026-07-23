import * as XLSX from "xlsx";
import { BaseParser } from "./base.parser";
import { ParseResult, RawRow, ImportFileFormat } from "@/types/import";

export class XlsxParser extends BaseParser {
  format: ImportFileFormat = "xlsx";

  async parse(file: File): Promise<ParseResult> {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        return {
          headers: [],
          rows: [],
          totalRows: 0,
          format: "xlsx",
          errors: ["The Excel file contains no worksheets."],
        };
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
        defval: "",
        raw: false,
      });

      if (rawData.length === 0) {
        return {
          headers: [],
          rows: [],
          totalRows: 0,
          format: "xlsx",
          errors: ["Worksheet is empty."],
        };
      }

      const headers = Object.keys(rawData[0]).map((h) => this.sanitizeHeader(h));
      const rows: RawRow[] = rawData.map((r) => this.cleanRow(r));

      return {
        headers,
        rows,
        totalRows: rows.length,
        format: "xlsx",
        errors: [],
      };
    } catch (err: any) {
      return {
        headers: [],
        rows: [],
        totalRows: 0,
        format: "xlsx",
        errors: [err?.message || "Failed to parse Excel file."],
      };
    }
  }
}
