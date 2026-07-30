const capabilities = [
  {
    name: "People & admissions",
    detail:
      "Create and update teachers and students, capture guardians, documents, and enrollment details without leaving Akshar.",
  },
  {
    name: "Classes & subjects",
    detail:
      "Structure grades, sections, subject catalogs, class teachers, and timetable entries the way Indian institutes actually run.",
  },
  {
    name: "Attendance that sticks",
    detail:
      "Teachers mark the day; history stays searchable for class and student. Admins see the pulse without chasing registers.",
  },
  {
    name: "Announcements",
    detail:
      "Publish notices to the right audience so communication stops living in scattered WhatsApp threads.",
  },
  {
    name: "Secure role access",
    detail:
      "Admin, teacher, and student each enter through one login — with session-aware routing into the right portal.",
  },
];

export default function LandingCapabilities() {
  return (
    <section className="px-6 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#021034]/55">
            Capabilities
          </p>
          <h2
            className="text-3xl font-semibold leading-tight text-[#021034] md:text-5xl"
          >
            Everything a modern school needs to operate.
          </h2>
        </div>

        <ul className="mt-14 divide-y divide-[#D7E3FC] border-y border-[#D7E3FC]">
          {capabilities.map((item) => (
            <li
              key={item.name}
              className="grid gap-3 py-8 md:grid-cols-[280px_1fr] md:gap-12"
            >
              <h3
                className="text-lg font-semibold text-[#021034]"
              >
                {item.name}
              </h3>
              <p className="text-base leading-relaxed text-[#021034]/70">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
