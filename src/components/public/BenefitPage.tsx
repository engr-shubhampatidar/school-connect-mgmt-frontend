import React from "react";
import FeatureInfoCard from "./Components/FeatureInfoCard";
import {
  Clock,
  ArrowUpWideNarrow,
  BanknoteArrowUp,
  ArrowRight,
  MessageSquareHeart,
  ChartPie,
  ChartLine,
} from "lucide-react";
import Image from "next/image";

export default function BenefitPage() {
  return (
    <section className="flex flex-col items-center justify-center w-full mb-[20px]">
      <div className="flex flex-col items-center text-[#021034] justify-center mb-[71px]">
         <p className="text-[12px] font-[500] text-[#021034] py-[3px] px-[8px] border border-[#D7E3FC] rounded-[10px] mb-4">Benefits</p>
        <h1 className="text-[32px] font-[600]">
          Benefits That Simplify Institute Operations
        </h1>
        <p className="text-[15px] font-[500]">
          Everything you need to operate efficiently, communicate better, and
          scale with ease.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 w-full gap-4 px-5 mb-[50px] ">
        <div className="flex items-center justify-center ml-[200px]">
          <div className="absolute">
            <Image
              src="/images/benefitCardTwo.png"
              alt="Benefit Image"
              width={600}
              height={400}
            />
          </div>
          <div className="z-50 w-full max-w-sm rounded-2xl p-6 ml-[-200px]">
            {/* Badge */}
            <span className="inline-block rounded-full bg-emerald-200 px-4 py-1 text-sm font-medium text-emerald-900">
              For Schools
            </span>

            {/* Title */}
            <h2 className="mt-4 text-2xl font-semibold leading-snug text-blue-700">
              Simplify School Operations with One Smart Platform
            </h2>

            {/* CTA Button */}
            <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#021034] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#021034]/90 hover:text-white">
              Start Now
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-start ">
          <div className="absolute">
            <Image
              src="/images/benefitCardOne.png"
              alt="Benefit Image"
              width={600}
              height={400}
            />
          </div>
          <div className="z-50 w-full max-w-sm rounded-2xl p-6 ">
            {/* Badge */}
            <span className="inline-block rounded-full bg-emerald-200 px-4 py-1 text-sm font-medium text-emerald-900">
              For Collage
            </span>

            {/* Title */}
            <h2 className="mt-4 text-2xl font-semibold leading-snug text-blue-700">
              Manage complex academics with clarity and control.
            </h2>

            {/* CTA Button */}
            <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#021034] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#021034]/90 hover:text-white">
              Start Now
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-center gap-[21px] mb-[92px]">
        <FeatureInfoCard
          title="Save Time with Automation"
          description="Automate admissions, attendance, fees, and reports — freeing your team from repetitive tasks."
          icon={<Clock size={18} />}
          iconBgColor="bg-[#D3FFF1]"
        />
        <FeatureInfoCard
          title="Improve Operational Efficiency"
          description="Manage academics, administration, and communication from a single, unified platform."
          icon={<ArrowUpWideNarrow size={18} />}
          iconBgColor="bg-[#D3FFF1]"
        />
        <FeatureInfoCard
          title="Increase Fee Collection Accuracy"
          description="Track payments in real time, reduce delays, and maintain complete financial transparency."
          icon={<BanknoteArrowUp size={18} />}
          iconBgColor="bg-[#D7E3FC]"
        />
        <FeatureInfoCard
          title="Parent & Student Engagement"
          description="Deliver timely updates, alerts, and academic information through one communication channel."
          icon={<MessageSquareHeart size={18} />}
          iconBgColor="bg-[#D7E3FC]"
        />
        <FeatureInfoCard
          title="Gain Actionable Insights"
          description="Access real-time dashboards and reports to make informed decisions faster."
          icon={<ChartPie size={18} />}
          iconBgColor="bg-[#F9EAD0]"
        />
        <FeatureInfoCard
          title="Scale with Confidence"
          description="Easily adapt the system as your institute grows—without adding operational complexity."
          icon={<ChartLine size={18} />}
          iconBgColor="bg-[#F9EAD0]"
        />
      </div>
    </section>
  );
}
