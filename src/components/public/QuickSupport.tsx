import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function QuickSupport() {
  return (
    <section className="flex flex-col justify-center items-center mb-[100px] px-24">
      <div className="min-w-full flex items-center justify-center flex-col">
        <h1 className="text-[#021034] text-[32px] font-[600] font-semibold">
          Quick Answer & Support 
        </h1>
        <p className="text-[#021034] text-[15px] font-[500] mt-2 text-center">
          Everything You Need to Know Before Getting Started
        </p>
      </div>
      <div className="w-full flex  mt-8 gap-8">
        <div className="w-full max-w-sm overflow-hidden rounded-2xl">
          {/* Image Section */}
          <div className="relative h-[364px] w-full">
            <Image
              src="/images/Support.png" // replace with your image
              alt="Support"
              fill
              className=""
            />
          </div>

          {/* Content Section */}
          <div className="pb-5 mt-2">
            <h3 className="text-lg font-semibold text-black">
              Do you have any questions?
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Feel free to send us your questions or request a free
              consultation.
            </p>

            <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-900 border border-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
              Message Now
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div className="w-full max-w-full space-y-4 rounded-2xl px-6">
      
      {/* Item 1 - Open */}
      <div className="rounded-xl bg-white p-6 border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-blue-700">
            Is the platform suitable for both schools and colleges?
          </h3>
          <span className="text-xl font-bold text-blue-700">−</span>
        </div>

        <p className="mt-4 text-gray-600 text-sm leading-relaxed">
          Yes. Our system is designed to support schools, colleges, coaching
          institutes, and training centers with flexible modules that adapt
          to different academic structures.
        </p>
      </div>

      {/* Item 2 */}
      <div className="rounded-xl bg-white p-6 flex items-center justify-between border">
        <h3 className="text-lg font-medium text-blue-700">
          Is the software cloud-based?
        </h3>
        <span className="text-xl font-bold text-blue-700">+</span>
      </div>

      {/* Item 3 */}
      <div className="rounded-xl bg-white p-6 flex items-center justify-between border"  >
        <h3 className="text-lg font-medium text-blue-700">
          Can we customize features based on our institute’s needs?
        </h3>
        <span className="text-xl font-bold text-blue-700">+</span>
      </div>

      {/* Item 4 */}
      <div className="rounded-xl bg-white p-6 flex items-center justify-between border">
        <h3 className="text-lg font-medium text-blue-700">
          Do you provide onboarding and training?
        </h3>
        <span className="text-xl font-bold text-blue-700">+</span>
      </div>

      {/* Item 5 */}
      <div className="rounded-xl bg-white p-6 flex items-center justify-between border">
        <h3 className="text-lg font-medium text-blue-700">
          How do I pay and get started?
        </h3>
        <span className="text-xl font-bold text-blue-700">+</span>
      </div>

    </div>
      </div>
    </section>
  );
}
