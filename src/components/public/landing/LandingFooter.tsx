import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#D7E3FC] px-6 py-12 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p
            className="text-xl font-bold text-[#021034]"
          >
            Akshar
          </p>
          <p className="mt-2 max-w-xs text-sm text-[#021034]/60">
            Multi-school institute management — powered by Sankalp Tech.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm font-medium text-[#021034]/70">
          <Link href="/#product" className="hover:text-[#021034]">
            Product
          </Link>
          <Link href="/register-school" className="hover:text-[#021034]">
            Register school
          </Link>
          <Link href="/login" className="hover:text-[#021034]">
            Sign in
          </Link>
          <Link href="/contact" className="hover:text-[#021034]">
            Contact
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-[#021034]/45">
        © {new Date().getFullYear()} Akshar. All rights reserved.
      </p>
    </footer>
  );
}
