import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { AmortRow } from "./finance";

const HEADERS = [
  "Year",
  "Month",
  "RemainingBalance",
  "PrincipalPayment",
  "InterestPayment",
  "TotalPayment",
] as const;

function rowsToSheetData(rows: readonly AmortRow[]): (string | number)[][] {
  const data: (string | number)[][] = [HEADERS as unknown as (string | number)[]];
  for (const r of rows) {
    data.push([
      r.year,
      r.month,
      r.remaining,
      r.principal,
      r.interest,
      r.payment,
    ]);
  }
  return data;
}

export function exportAmortizationToXlsx(
  rows: readonly AmortRow[],
  filename: string = "amortization.xlsx"
): void {
  const data = rowsToSheetData(rows);
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Amortization");
  const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, filename);
}
