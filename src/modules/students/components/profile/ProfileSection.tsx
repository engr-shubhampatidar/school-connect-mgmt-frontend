type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
};

export default function ProfileSection({
  title,
  children,
  className = "",
  action,
}: Props) {
  return (
    <div
      className={`w-full max-w-full bg-white rounded-xl border border-blue-200 ${className}`}
    >
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-[#021034] font-semibold text-base lg:text-xl">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}
