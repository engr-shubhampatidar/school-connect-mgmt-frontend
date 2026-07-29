export function cleanDigits(value: string) {
  return value.replace(/\D+/g, "");
}

export function toLower(value: string) {
  return value.trim().toLowerCase();
}

/** Formats a Date as "YYYY-MM-DD" in local time (avoids toISOString UTC shift). */
export function formatLocalYMD(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** Parses "YYYY-MM-DD" as a local date (avoids Date("YYYY-MM-DD") UTC parsing). */
export function parseLocalDate(value?: string) {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}
