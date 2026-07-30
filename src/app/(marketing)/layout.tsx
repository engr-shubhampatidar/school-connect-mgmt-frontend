export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F3F6FC] font-sans text-[#021034] antialiased">
      {children}
    </div>
  );
}
