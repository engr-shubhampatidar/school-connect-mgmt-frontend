export function cleanDigits(value: string) {
  return value.replace(/\D+/g, "");
}

/** Formats an ISO date for profile display, e.g. "14 Jun 2024". */
export function formatDisplayDate(iso?: string | null): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Title-cases an uppercase enum-like value, e.g. "MALE" → "Male". */
export function formatLabel(value?: string | null): string {
  if (!value) return "-";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/** Normalize a phone for form display: digits only, keep last 10 if longer (e.g. +91…). */
export function normalizeMobileForForm(value?: string | null): string {
  const digits = cleanDigits(value ?? "");
  if (!digits) return "";
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/** Display 10 digits as "XXXXX XXXXX" (space between 5-digit groups). */
export function formatMobileDisplay(value: string): string {
  const digits = cleanDigits(value).slice(0, 10);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/** Display 12-digit Aadhaar as "XXXX XXXX XXXX". */
export function formatAadharDisplay(value: string): string {
  const digits = cleanDigits(value).slice(0, 12);
  return digits.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, p1, p2, p3) =>
    [p1, p2, p3].filter(Boolean).join(" "),
  );
}

/** Class + optional section label for chips/tables. */
export function formatClassSection(
  className?: string | null,
  section?: string | null,
  emptyLabel = "Not Assigned",
): string {
  if (!className) return emptyLabel;
  return section ? `${className} - ${section}` : className;
}

/** Safe mobile display for read-only UI; empty → "-". */
export function displayMobile(value?: string | null): string {
  if (!value) return "-";
  return formatMobileDisplay(value) || "-";
}

/** Safe Aadhaar display for read-only UI; empty → "-". */
export function displayAadhaar(value?: string | null): string {
  if (!value) return "-";
  return formatAadharDisplay(value) || "-";
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

/** Split a full name into first + remaining last name parts. */
export function splitFullName(name: string): {
  firstName: string;
  lastName: string;
} {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/** Normalize gender for API payload (MALE / FEMALE / OTHER). */
export function formatGenderForApi(gender: string): "MALE" | "FEMALE" | "OTHER" {
  const value = gender.trim().toUpperCase();
  if (value === "MALE" || value === "FEMALE" || value === "OTHER") return value;
  return "MALE";
}

/** Normalize API gender (MALE / Male / male) to form value (MALE). */
export function normalizeGenderForForm(
  gender?: string | null,
): "MALE" | "FEMALE" | "OTHER" {
  return formatGenderForApi(gender ?? "");
}
