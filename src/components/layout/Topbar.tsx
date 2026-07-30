"use client";
import { Search } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, clearSession, getActiveRole } from "@/modules/auth";
import { roleFromPath } from "@/lib/roleFromPath";
import { useRouter } from "next/navigation";
export default function Topbar({
  onSearch,
}: {
  onSearch?: (query: string) => void;
}) {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    role?: string;
  } | null>(null);

  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    try {
      clearSession();
    } finally {
      router.push("/");
    }
  };

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

  useEffect(() => {
    try {
      const fromPath = roleFromPath(pathname) ?? getActiveRole();
      setUser(fromPath ? getUser(fromPath) : null);
    } catch {
      setUser(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (target instanceof Element && target.closest("[data-topbar-menu]")) {
        return;
      }
      setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div className="sticky top-0 z-10">
      <header
        suppressHydrationWarning
        className="flex bg-white items-center justify-between  border-b border-slate-200 p-5 min-h-[85px] "
      >
        <h2 className="text-md font-bold min-w-[10%]">{topName}</h2>
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
          <IconButton title="Mail">{BellIcon()}</IconButton>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-medium">
              {user?.name ? (
                user.name
                  .split(" ")
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              ) : (
                <>
                  <Image
                    src={`/images/Avatar.png`}
                    alt={"User Avatar"}
                    height={16}
                    width={16}
                  />
                </>
              )}
            </div>
            <div className="text-sm min-w-[120px]">
              <div className="font-[400] text-[12px]">
                {user?.name ?? "shadcn"}
              </div>
              <div className="text-xs text-slate-500">
                {/* {user?.role ? user.role.toUpperCase() + " · " : ""} */}
                {user?.email ?? "m@example.com"}
              </div>
            </div>
          </div>
          <div className="relative" data-topbar-menu>
            <button
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 text-black rounded-md hover:bg-slate-100"
            >
              {DotsVerticalIcon()}
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-40 rounded-md bg-white border shadow-md z-20"
              >
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
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
