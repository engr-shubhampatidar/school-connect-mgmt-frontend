"use client";

import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top Banner */}
      <div className="w-full bg-[#051643] p-2">
        <div className="bg-[#FFFFFF] rounded-[6px] w-full py-[10px] px-20px flex items-center justify-center">
          <p className="text-[12px] font-[500] md:text-[16px]">
            🚀 Get Started Today — Digitize your institute with ease.
          </p>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="w-full  bg-white px-4 md:px-20 sticky top-0 z-50">
        <div className="mx-auto flex max-w-8xl items-center justify-between py-4">
          {/* Logo */}
          <div className="text-sm md:text-xl font-extrabold leading-tight">
            <span className="block">MAXUSE</span>
            <span className="block text-sm font-semibold tracking-wide">
              INSTITUTE.
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-[56px] text-[16px] font-[600] text-[#021034]">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-blue-600 transition"
                prefetch={false}
              >
                {item.label}
              </Link>
            ))}

            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center gap-2 rounded-md border border-blue-200 px-3 py-2 text-sm font-semibold text-[#002B6B] hover:bg-blue-50 transition"
            >
              <Phone size={16} />
              {phoneNumber}
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[#021034] "
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t bg-white px-4 pb-4">
            <nav className="flex flex-col gap-4 pt-4 text-sm font-semibold text-[#021034]">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="hover:text-blue-600"
                  prefetch={false}
                >
                  {item.label}
                </Link>
              ))}

              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-2 rounded-md border border-blue-200 px-3 py-2 text-sm font-semibold text-[#002B6B]"
              >
                <Phone size={16} />
                {phoneNumber}
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
