"use client";
import { Search } from "lucide-react";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export default function Topbar({
  onSearch,
}: {
  onSearch?: (query: string) => void;
}) {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);

  const topName = pathname.split("/")[2]?.toUpperCase() || "DASHBOARD";

  const handleSearchToggle = () => {
    if (pathname.endsWith("/dashboard")) {
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  };

  useEffect(() => {
    handleSearchToggle();
  }, [pathname]);

  return (
    <div className="sticky top-0 z-10">
      <header className="flex bg-white items-center justify-between  border-b border-slate-200 p-5 min-h-[85px] ">
        <h2 className="text-lg font-bold min-w-[10%] truncate">{topName}</h2>
        <div className="w-full items-start- justify-center pl-8">
          {/* <button onClick={handleSearchToggle}> click</button> */}
          {showSearch && (
            <div className="grid w-full max-w-1/2 gap-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or email"
                  onChange={(e) => onSearch?.(e.target.value)}
                  className="rounded-lg border w-full  py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-300"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <IconButton title="Mail">{MailIcon()}</IconButton>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-medium">
              S
            </div>
            <div className="text-sm">
              <div className="font-medium">shadcn</div>
              <div className="text-xs text-slate-500">m@example.com</div>
            </div>
          </div>
          <div className="p-2 text-slate-500">{DotsVerticalIcon()}</div>
        </div>
      </header>
    </div>
  );
}

function IconButton({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      className="p-2 rounded-md shadow-md shadow-slate-300 hover:bg-slate-100 text-black"
      aria-label={title}
    >
      {children}
    </button>
  );
}

/* Simple inline SVG icons */
function SquareIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 17H9a3 3 0 006 0z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8l9 6 9-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 19H3V5h18v14z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DotsVerticalIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 6v.01M12 12v.01M12 18v.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
