import React from "react";
import PricingCard from "./Components/PricingCard";

export default function Pricing() {
  return (
    <section className="flex flex-col justify-center items-center mb-[50px] w-full py-10 px-40 ">
      <div className="min-w-full flex items-center justify-center flex-col">
        <p className="text-[12px] font-[500] text-[#021034] py-[3px] px-[8px] border border-slate-300 rounded-[10px]">
          Pricing Plans
        </p>
        <h1 className="text-[#021034] text-[32px] font-[600] font-semibold">
          Simple, Transparent Pricing for Every Institute{" "}
        </h1>
        <p className="text-[#021034] text-[15px] font-[500] mt-2 text-center">
          Choose a plan that fits your institution’s size and needs. Upgrade
          anytime as you grow.
        </p>
      </div>
      <div className="flex gap-6 py-10">
        <PricingCard
          title="Starter"
          description="Best for: Tuition classes & small schools"
          price="$xxx"
          features={[
            "Admissions & enrollment management",
            "Exams, results & performance tracking",
            "Advanced fee management & reminders",
            "Teacher & staff management",
            "Communication & notifications",
          ]}
        />
        <PricingCard
          title="Professional"
          description="Best for: Schools & growing institutes"
          price="$xxx"
          features={[
            "Admissions & enrollment management",
            "Exams, results & performance tracking",
            "Advanced fee management & reminders",
            "Teacher & staff management",
            "Communication & notifications",
          ]}
        />
        <PricingCard
          title="Enterprise"
          description="Best for: Schools & growing institutes"
          price="$xxx"
          features={[
            "Admissions & enrollment management",
            "Exams, results & performance tracking",
            "Advanced fee management & reminders",
            "Teacher & staff management",
            "Communication & notifications",
          ]}
        />
      </div>
    </section>
  );
}
