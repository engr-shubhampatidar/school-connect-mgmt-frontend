/** Strip spaces/dashes so UI-formatted Aadhaar validates as 12 digits. */
export function normalizeAadharDigits(value: string): string {
  return value.replace(/\D/g, "");
}
