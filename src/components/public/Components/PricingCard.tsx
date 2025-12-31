import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function PricingCard({
  title,
  description,
  price,
  period = "month",
  features,
  ctaText = "Start 10 Days Free Trial",
  onCtaClick,
}: PricingCardProps) {
  return (
    <div className="max-w-[350px] rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <h3 className="text-2xl font-semibold text-blue-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>

      {/* Price */}
      <div className="mt-6 flex items-end gap-2">
        <span className="text-4xl font-bold text-blue-900">{price}</span>
        <span className="mb-1 text-sm text-gray-500">{period}</span>
      </div>

      <hr className="my-6 border-blue-100" />

      {/* Features */}
      <ul className="space-y-4">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Check size={14} strokeWidth={3} />
            </span>
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onCtaClick}
        className="mt-8 w-full rounded-xl bg-blue-900 py-3 text-sm font-medium text-white transition hover:bg-blue-800"
      >
        {ctaText}
      </button>
    </div>
  );
}
