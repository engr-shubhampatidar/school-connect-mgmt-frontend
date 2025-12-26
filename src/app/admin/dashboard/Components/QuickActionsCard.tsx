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
    <div className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition
              ${
                action.active
                  ? "border-blue-200 bg-blue-100 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }
            `}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-700">
              {action.icon}
            </span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
