import type { FeeStructureTransportSlab } from "@/modules/fees/types";

export function resolveTransportAmount(
  distanceKm: number,
  baseAmount: number,
  slabs: Pick<FeeStructureTransportSlab, "thresholdKm" | "amount">[],
): number {
  let amount = baseAmount;
  const sorted = [...slabs].sort((a, b) => a.thresholdKm - b.thresholdKm);
  for (const slab of sorted) {
    if (distanceKm > slab.thresholdKm) {
      amount = slab.amount;
    }
  }
  return amount;
}
