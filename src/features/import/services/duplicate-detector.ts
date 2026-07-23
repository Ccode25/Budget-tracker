import { Transaction } from "@/types/transaction";
import { MappedRow, DuplicateFlag } from "@/types/import";

export function detectDuplicates(
  mappedRows: MappedRow[],
  existingTransactions: Transaction[]
): DuplicateFlag[] {
  return mappedRows.map((row) => {
    // Find matching transaction by date + exact amount
    const match = existingTransactions.find((tx) => {
      const isDateMatch = tx.date === row.date;
      const isAmountMatch = Math.abs(tx.amount - Math.abs(row.amount)) < 0.01;
      return isDateMatch && isAmountMatch;
    });

    if (match) {
      return {
        rowIndex: row.rowIndex,
        isDuplicate: true,
        matchedTransactionId: match.id,
        matchScore: 0.95,
        userChoice: "skip",
      };
    }

    return {
      rowIndex: row.rowIndex,
      isDuplicate: false,
      matchScore: 0,
      userChoice: "import",
    };
  });
}
