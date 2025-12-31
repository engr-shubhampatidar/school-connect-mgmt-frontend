import Image from "next/image";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  company?: string;
}

export default function TestimonialCard({
  quote,
  name,
  role,
  avatar = "/avatar.png",
  company,
}: TestimonialCardProps) {
  return (
    <div className="w-full max-w-3xl rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
      {/* Quote Icon */}
      <div className="text-5xl leading-none text-gray-400">“</div>

      {/* Quote Text */}
      <p className="mt-2 text-lg leading-relaxed text-blue-900">
        {quote}
      </p>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={avatar}
            alt={name}
            width={44}
            height={44}
            className="rounded-full object-cover"
          />

          <div>
            <p className="text-sm font-semibold text-blue-900">
              {name}
            </p>
            <p className="text-xs text-gray-500">
              {role}
            </p>
          </div>
        </div>

        {company && (
          <span className="text-lg font-semibold text-blue-500">
            {company}
          </span>
        )}
      </div>
    </div>
  );
}
