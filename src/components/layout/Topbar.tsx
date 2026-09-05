"use client";
import { Search } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, clearSession, getActiveRole } from "@/modules/auth";
import { roleFromPath } from "@/lib/roleFromPath";
import { useRouter } from "next/navigation";
import { EllipsisVertical, BellIcon } from "lucide-react";
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
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 shadow rounded p-2">
            <BellIcon className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-medium">
              <>
                <Image
                  src={`https://i.pinimg.com/736x/5e/d1/da/5ed1da21e5470532dfe623d0bc39d4e8.jpg`}
                  alt={"User Avtar"}
                    width={72}
                    height={72}
                    quality={90}
                    className="h-full w-full rounded-full object-cover"
                />
              </>
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
              <EllipsisVertical className="h-5 w-5" />
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
