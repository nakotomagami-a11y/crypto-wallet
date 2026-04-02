export function formatBalance(balance: string, maxDecimals = 4): string {
  const num = parseFloat(balance);
  if (isNaN(num)) return "0";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  });
}
