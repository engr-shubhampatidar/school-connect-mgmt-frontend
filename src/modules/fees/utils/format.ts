export function formatInr(amount: number | string | null | undefined): string {
  const n = typeof amount === "number" ? amount : Number(amount ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(safe);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\n");
}

export const FEE_FREQUENCY_LABELS: Record<string, string> = {
  ONE_TIME: "One time",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  HALF_YEARLY: "Half-yearly",
  YEARLY: "Yearly",
};

export const FINE_TYPE_LABELS: Record<string, string> = {
  NONE: "None",
  DAILY_FIXED: "Daily fixed",
  ONE_TIME_FIXED: "One-time fixed",
  PERCENTAGE: "Percentage",
};

export const FEE_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PARTIAL: "Partial",
  PAID: "Paid",
  OVERDUE: "Overdue",
  WAIVED: "Waived",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Cash",
  CHEQUE: "Cheque",
  UPI: "UPI",
  BANK_TRANSFER: "Bank transfer",
  CARD: "Card",
  ONLINE: "Online",
};
