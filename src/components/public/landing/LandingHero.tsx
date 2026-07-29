"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden">
      <Image
        src="/images/Admin_dashboard.png"
        alt="Akshar admin dashboard"
        fill
        priority
        className="object-cover object-top"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#021034] via-[#021034]/88 to-[#021034]/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#021034]/80 via-transparent to-[#021034]/30" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:justify-center md:px-8 md:pb-24 md:pt-20">
        <p
          className="mb-4 text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl motion-safe:animate-[aksharRise_0.9s_ease-out_both]"
        >
          Akshar
        </p>

        <h1
          className="max-w-2xl text-2xl font-semibold leading-tight text-white md:text-4xl motion-safe:animate-[aksharRise_0.9s_ease-out_0.1s_both]"
        >
          The school operating system for every campus.
        </h1>

        <p className="mt-4 max-w-lg text-base font-medium leading-relaxed text-[#D7E3FC] md:text-lg motion-safe:animate-[aksharRise_0.9s_ease-out_0.18s_both]">
          Onboard schools, run admin operations, empower teachers, and keep
          students informed — one product, many institutions.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-[aksharRise_0.9s_ease-out_0.26s_both]">
          <Link
            href="/register-school"
            className="inline-flex items-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#021034] transition hover:bg-[#D7E3FC]"
          >
            Onboard a school
            <ArrowRight size={16} className="ml-2" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-lg border border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Explore the product
          </Link>
        </div>
      </div>
    </section>
  );
}
