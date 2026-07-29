export default function LandingSchools() {
  return (
    <section id="schools" className="px-6 py-24 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#021034]/55">
            Multi-school by design
          </p>
          <h2
            className="max-w-xl text-3xl font-semibold leading-tight text-[#021034] md:text-5xl"
          >
            Each school gets its own world. You keep one platform.
          </h2>
        </div>
        <p className="max-w-md text-base font-medium leading-relaxed text-[#021034]/70 md:text-lg">
          Akshar is built for groups, chains, and independent institutes alike.
          Register a school, invite its admin, and every teacher and student
          operates inside that school&apos;s secure boundary — without another
          product to learn.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-px overflow-hidden rounded-2xl border border-[#D7E3FC] bg-[#D7E3FC] md:grid-cols-3">
        {[
          {
            title: "Isolated by school",
            body: "Teachers, students, classes, and attendance stay scoped to the right campus.",
          },
          {
            title: "Shared product DNA",
            body: "The same workflows everywhere — so training and support stay consistent.",
          },
          {
            title: "Ready to expand",
            body: "Add another school when you grow. No rebuild. No parallel systems.",
          },
        ].map((item) => (
          <div key={item.title} className="bg-[#F3F6FC] p-8 md:p-10">
            <h3
              className="text-lg font-semibold text-[#021034]"
            >
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#021034]/65">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
