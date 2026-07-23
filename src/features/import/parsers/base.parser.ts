import { ParseResult, RawRow, ImportFileFormat } from "@/types/import";

export abstract class BaseParser {
  abstract format: ImportFileFormat;
  abstract parse(file: File): Promise<ParseResult>;

  protected sanitizeHeader(header: string): string {
    return header.trim().replace(/^["']|["']$/g, "");
  }

  protected cleanRow(row: Record<string, any>): RawRow {
    const cleaned: RawRow = {};
    for (const [k, v] of Object.entries(row)) {
      if (k) {
        cleaned[this.sanitizeHeader(k)] = v !== undefined && v !== null ? String(v).trim() : "";
      }
    }
    return cleaned;
  }
}
