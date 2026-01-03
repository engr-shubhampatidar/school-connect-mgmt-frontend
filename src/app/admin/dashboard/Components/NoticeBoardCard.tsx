import { Info, AlertCircle } from "lucide-react";

type NoticeVariant = "success" | "info" | "error";

type NoticeItem = {
  title: string;
  message: string;
  variant: NoticeVariant;
};

type NoticeBoardCardProps = {
  title?: string;
  subtitle?: string;
  notices: NoticeItem[];
};

const variantStyles = {
  success: {
    container: "border-green-200 bg-green-50",
    icon: "text-green-600",
    title: "text-[#051643]",
    message: "text-[#051643]",
  },
  info: {
    container: "border-emerald-200 bg-emerald-50",
    icon: "text-emerald-600",
    title: "text-[#051643]",
    message: "text-[#051643]",
  },
  error: {
    container: "border-red-200 bg-red-50",
    icon: "text-red-600",
    title: "text-[#051643]",
    message: "text-[#051643]",
  },
};

export default function NoticeBoardCard({
  title = "Notice Board",
  subtitle = "Manage common administrative tasks.",
  notices,
}: NoticeBoardCardProps) {
  return (
    <div className="w-full max-w-sm rounded-xl border border-[#D7E3FC] bg-white p-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      {/* Notices */}
      <div className="space-y-4">
        {notices.map((notice, index) => {
          const styles = variantStyles[notice.variant];

          return (
            <div
              key={index}
              className={`flex gap-3 rounded-lg border p-4 ${styles.container}`}
            >
              <div className={`mt-0.5 ${styles.icon}`}>
                {notice.variant === "error" ? (
                  <AlertCircle size={18} />
                ) : (
                  <Info size={18} />
                )}
              </div>

              <div>
                <h4 className={`text-sm font-[600] ${styles.title}`}>
                  {notice.title}
                </h4>
                <p className={`text-sm font-[400] ${styles.message}`}>{notice.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
