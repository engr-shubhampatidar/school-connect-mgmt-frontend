import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import ContactForm from "./ContactForm";

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "support@akshar.app",
    href: "mailto:support@akshar.app",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 79749 18244",
    href: "tel:+917974918244",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "India · Serving schools nationwide",
    href: null,
  },
];

export default function ContactPageContent() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#021034]/55">
            Contact
          </p>
          <h1
            className="text-3xl font-semibold leading-tight text-[#021034] md:text-5xl"
          >
            Talk to the Akshar team.
          </h1>
          <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-[#021034]/70 md:text-lg">
            Whether you&apos;re onboarding a new school, migrating campuses, or
            need product support — send a note and we&apos;ll get back to you.
          </p>

          <ul className="mt-10 space-y-5">
            {channels.map((item) => {
              const Icon = item.icon;
              const body = (
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D7E3FC] text-[#021034]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#021034]/45">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-[#021034]">
                      {item.value}
                    </p>
                  </div>
                </div>
              );

              return (
                <li key={item.label}>
                  {item.href ? (
                    <a href={item.href} className="block transition hover:opacity-80">
                      {body}
                    </a>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>

          <Link
            href="/register-school"
            className="mt-10 inline-flex items-center text-sm font-semibold text-[#021034] transition hover:opacity-70"
          >
            Prefer to start yourself? Register a school
            <ArrowRight size={15} className="ml-1.5" />
          </Link>
        </aside>

        <section className="rounded-2xl border border-[#D7E3FC] bg-white p-6 shadow-[0_24px_60px_-40px_rgba(2,16,52,0.35)] md:p-8">
          <h2
            className="text-xl font-semibold text-[#021034] md:text-2xl"
          >
            Send a message
          </h2>
          <p className="mt-2 text-sm text-[#021034]/60">
            Share a little context — school name, role, and what you need help
            with.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
