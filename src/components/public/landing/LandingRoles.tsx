import Link from "next/link";
import { ArrowRight } from "lucide-react";

const roles = [
  {
    role: "Administrators",
    promise: "Control the campus",
    items: [
      "Teacher & student lifecycle",
      "Classes, subjects, timetable",
      "Announcements & dashboards",
    ],
  },
  {
    role: "Teachers",
    promise: "Own the classroom day",
    items: [
      "My class & subjects",
      "Mark attendance",
      "Student attendance history",
    ],
  },
  {
    role: "Students",
    promise: "Stay informed",
    items: ["Profile & documents", "Attendance view", "Account security"],
  },
];

export default function LandingRoles() {
  return (
    <section id="roles" className="bg-[#EAF0FB] px-6 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#021034]/55">
            Roles
          </p>
          <h2
            className="text-3xl font-semibold leading-tight text-[#021034] md:text-5xl"
          >
            Three portals. One shared truth.
          </h2>
          <p className="mt-4 text-base font-medium text-[#021034]/70 md:text-lg">
            Every person in the school walks into an experience shaped for their
            job — on data that stays consistent across the institution.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.role}
              className="flex flex-col rounded-2xl border border-[#D7E3FC] bg-white p-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#021034]/50">
                {role.role}
              </p>
              <h3
                className="mt-3 text-xl font-semibold text-[#021034]"
              >
                {role.promise}
              </h3>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-[#021034]/75">
                {role.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-8 inline-flex items-center text-sm font-semibold text-[#021034] transition hover:opacity-70"
              >
                Sign in
                <ArrowRight size={15} className="ml-1.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
