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
        <p className="text-[12px] font-[500] text-[#021034] py-[3px] px-[8px] border border-[#D7E3FC] rounded-[10px] mb-4">
          Benefits
        </p>
        <h1 className="text-[16px] md:text-[32px] font-[600]">
          Benefits That Simplify Institute Operations
        </h1>
        <p className="text-[10px] md:text-[15px] font-[500]">
          Everything you need to operate efficiently, communicate better, and
          scale with ease.
        </p>
      </div>
      <div className="grid  md:grid-cols-2 w-full gap-4 px-5 mb-[50px] ">
        <div className="flex items-center md:justify-end justify-center ">
          <Image
            src="/images/benifitImage1.png"
            alt="Benefit Image"
            width={600}
            height={400}
            quality={100}
            className="max-w-full h-auto"
          />
        </div>
        <div className="flex items-center md:justify-start justify-center ">
          <Image
            src="/images/benifitImage2.png"
            alt="Benefit Image"
            width={600}
            height={400}
            quality={100}
            className="max-w-full h-auto"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2  justify-center gap-[21px] mb-[92px]">
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
