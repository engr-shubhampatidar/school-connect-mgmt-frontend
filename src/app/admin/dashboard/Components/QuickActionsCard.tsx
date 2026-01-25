import { UserPlus, Users, CreditCard, FileText } from "lucide-react";

type ActionItem = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

type QuickActionsCardProps = {
  title?: string;
  subtitle?: string;
  actions: ActionItem[];
};

export default function QuickActionsCard({
  title = "Quick Actions",
  subtitle = "Manage common administrative tasks.",
  actions,
}: QuickActionsCardProps) {
  return (
    <div className="w-full max-w-sm rounded-xl border border-[#D7E3FC] bg-white p-[16px]">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[24px] font-[600] text-[#021034]">{title}</h2>
        <p className="text-[14px] text-[#737373]">{subtitle}</p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-[14px] font-[500] transition
              border-[#D7E3FC] bg-white text-[#051643] hover:bg-[#D7E3FC]`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md text-[#051643]">
              {action.icon}
            </span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
