"use client";

import Image from "next/image";
import { useState } from "react";

const surfaces = [
  {
    id: "admin",
    label: "Admin",
    title: "Run the institute from one desk",
    body: "Manage teachers and students, structure classes and subjects, publish announcements, and watch attendance trends without spreadsheet sprawl.",
    image: "/images/Admin_dashboard.png",
    alt: "Akshar admin dashboard",
  },
  {
    id: "teacher",
    label: "Teacher",
    title: "Teach without losing the day to admin",
    body: "Open your class, mark attendance, review history, and see assigned subjects — the classroom tools teachers actually open every morning.",
    image: "/images/Teacher_dashboard.jpg",
    alt: "Akshar teacher dashboard",
  },
  {
    id: "student",
    label: "Student",
    title: "Clarity for every learner",
    body: "Students see their profile, documents, and attendance in a calm portal that matches the rest of Akshar.",
    image: "/images/Student_dashboard.jpg",
    alt: "Akshar student dashboard",
  },
];

export default function LandingProduct() {
  const [active, setActive] = useState(surfaces[0].id);
  const current = surfaces.find((s) => s.id === active) ?? surfaces[0];

  return (
    <section id="product" className="bg-[#021034] px-6 py-24 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#D7E3FC]/70">
            Product
          </p>
          <h2
            className="text-3xl font-semibold leading-tight md:text-5xl"
          >
            A full school stack — not a pile of apps.
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-[#D7E3FC]/85 md:text-lg">
            Attendance, academics structure, people, and communication live in
            one coherent experience for every school you onboard.
          </p>
        </div>

        <div
          className="mt-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Product surfaces"
        >
          {surfaces.map((surface) => {
            const selected = surface.id === active;
            return (
              <button
                key={surface.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(surface.id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  selected
                    ? "bg-white text-[#021034]"
                    : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                {surface.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div key={current.id} className="motion-safe:animate-[aksharFade_0.45s_ease-out]">
            <h3
              className="text-2xl font-semibold md:text-3xl"
            >
              {current.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-[#D7E3FC]/85">
              {current.body}
            </p>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-[#051643] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
            <Image
              key={current.image}
              src={current.image}
              alt={current.alt}
              fill
              className="object-cover object-top motion-safe:animate-[aksharFade_0.5s_ease-out]"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
