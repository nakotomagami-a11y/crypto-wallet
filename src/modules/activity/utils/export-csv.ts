import type { Transaction } from "@/types/transaction";

export function exportTransactionsCsv(transactions: Transaction[]): void {
  const headers = ["Hash", "Network", "Direction", "Status", "From", "To", "Value", "Date", "Explorer URL"];

  const rows = transactions.map((tx) => [
    tx.hash,
    tx.network,
    tx.direction,
    tx.status,
    tx.from,
    tx.to,
    tx.value || "",
    tx.timestamp ? new Date(tx.timestamp).toISOString() : "",
    tx.explorerUrl,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
