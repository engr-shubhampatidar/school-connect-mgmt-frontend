import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingCta() {
  return (
    <section className="px-6 py-24 md:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#021034] px-8 py-16 md:px-16 md:py-20">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#3B82F6]/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#60A5FA]/15 blur-3xl"
          aria-hidden
        />

        <div className="relative max-w-2xl">
          <h2
            className="text-3xl font-semibold leading-tight text-white md:text-5xl"
          >
            Bring your next school onto Akshar.
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-[#D7E3FC] md:text-lg">
            Register an institute, set up your admin, and open portals for
            teachers and students in the same afternoon.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register-school"
              className="inline-flex items-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#021034] transition hover:bg-[#D7E3FC]"
            >
              Register a school
              <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
