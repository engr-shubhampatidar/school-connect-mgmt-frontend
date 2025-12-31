import React from "react";

const companies = ["Google", "Airbnb", "Shopify", "Amazon", "Stripe"];

export default function TrustedBy() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="opacity-60 flex items-center justify-center gap-8 flex-wrap">
          {companies.map((c) => (
            <div
              key={c}
              className="h-8 text-sm text-slate-500 grayscale opacity-60"
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
