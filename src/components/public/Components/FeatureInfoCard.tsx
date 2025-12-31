import { Sparkles } from "lucide-react";

interface FeatureInfoCardProps {
  title: string;
  description: string;
  iconBgColor?: string;
  icon?: React.ReactNode;
}

export default function FeatureInfoCard({
  title,
  description,
  iconBgColor,
  icon,
}: FeatureInfoCardProps) {
  return (
    <div className="flex max-w-[416px] gap-4 rounded-[15px] border border-[#021034] text-[#021034] py-[30px] px-[20px] bg-white">
      {/* Icon */}
      <div
        className={`flex h-8 w-8 px-2 items-center justify-center rounded-md ${
          iconBgColor ?? "bg-blue-50"
        } text-black font-semibold`}
      >
        {icon ?? <Sparkles size={12} />}
      </div>

      {/* Content */}
      <div>
        <h4 className="mb-1 text-base font-semibold text-[#0a1d4d]">{title}</h4>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
