import { BaseParser } from "./base.parser";
import { CsvParser } from "./csv.parser";
import { XlsxParser } from "./xlsx.parser";

export function getParser(file: File): BaseParser {
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith(".csv")) {
    return new CsvParser();
  }
  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    return new XlsxParser();
  }
  throw new Error(`Unsupported file extension for "${file.name}". Supported: .csv, .xlsx`);
}
