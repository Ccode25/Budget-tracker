import Papa from "papaparse";
import { BaseParser } from "./base.parser";
import { ParseResult, RawRow, ImportFileFormat } from "@/types/import";

export class CsvParser extends BaseParser {
  format: ImportFileFormat = "csv";

  parse(file: File): Promise<ParseResult> {
    return new Promise((resolve) => {
      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: "greedy",
        complete: (results) => {
          const errors: string[] = results.errors.map(
            (e) => `Row ${e.row}: ${e.message}`
          );

          const headers = results.meta.fields
            ? results.meta.fields.map((h) => this.sanitizeHeader(h))
            : [];

          const rows: RawRow[] = results.data.map((r) => this.cleanRow(r));

          resolve({
            headers,
            rows,
            totalRows: rows.length,
            format: "csv",
            errors,
          });
        },
        error: (err) => {
          resolve({
            headers: [],
            rows: [],
            totalRows: 0,
            format: "csv",
            errors: [err.message],
          });
        },
      });
    });
  }
}
