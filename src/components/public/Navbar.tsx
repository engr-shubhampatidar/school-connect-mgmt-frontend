import Link from "next/link";
import { Phone } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

interface NavbarProps {
  navItems?: NavItem[];
  phoneNumber?: string;
}

export default function Navbar({
  navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  phoneNumber = "+91 79749 18244",
}: NavbarProps) {
  return (
    <>
      <div className="w-full bg-[#081a3d] py-3 px-20">
        <div className="relative mx-auto max-w-8xl rounded-lg bg-white py-3 text-center text-sm font-medium text-[#081a3d]">
          {/* Left Decoration */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:block">
            <div className="space-y-1">
              <span className="block h-[2px] w-8 rotate-12 bg-[#081a3d]/30" />
              <span className="block h-[2px] w-8 rotate-12 bg-[#081a3d]/30" />
              <span className="block h-[2px] w-8 rotate-12 bg-[#081a3d]/30" />
            </div>
          </div>

          {/* Text */}
          <span>{"Join Our Personalized Nutrition Demo For Free"}</span>

          {/* Right Decoration */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block">
            <div className="space-y-1">
              <span className="block h-[2px] w-8 -rotate-12 bg-[#081a3d]/30" />
              <span className="block h-[2px] w-8 -rotate-12 bg-[#081a3d]/30" />
              <span className="block h-[2px] w-8 -rotate-12 bg-[#081a3d]/30" />
            </div>
          </div>
        </div>
      </div>
      <header className="w-full border-b bg-white px-20">
        <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="text-xl font-extrabold leading-tight">
            <span className="block">MAXUSE</span>
            <span className="block text-sm font-semibold tracking-wide">
              INSTITUTE.
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-[56px] text-[16px] font-[600] text-[#021034]">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {/* Call Button */}
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center gap-2 rounded-md border border-blue-200 px-[12px] py-[10px] text-sm font-semibold text-[#002B6B] hover:bg-blue-50 transition"
            >
              <Phone size={16} />
              {phoneNumber}
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
