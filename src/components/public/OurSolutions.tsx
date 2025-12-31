import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function OurSolutions() {
  return (
    <section className="flex flex-col justify-center items-center mb-[50px]">
      <div className="min-w-full flex items-center justify-center flex-col">
        <p className="text-[12px] font-[500] text-[#021034] py-[3px] px-[8px] border border-[#D7E3FC] rounded-[10px]">Solutions</p>
        <h1 className="text-[#021034] text-[32px] font-[600] font-semibold">
          Smart Solutions for Modern Educational Institutions
        </h1>
        <p className="text-[#021034] text-[15px] font-[500] mt-2 text-center">
          Purpose-built tools to manage academics, operations, and growth
          efficiently.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 rounded-lg mt-8 p-4 ">
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-lg">
          {/* Image */}
          <div className="relative h-[440px] w-full">
            <Image
              src="/images/SolutionCardOne.jpg" // replace with your image
              alt="Student studying"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Students</h3>

              <button className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-500 text-blue-500 transition hover:bg-blue-500 hover:text-white">
                <ChevronRight size={18} />
              </button>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Access attendance, academics, assignments, and updates through a
              simple student dashboard.
            </p>
          </div>
        </div>
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-lg">
          {/* Image */}
          <div className="relative h-[440px] w-full">
            <Image
              src="/images/SolutionCardOne.jpg" // replace with your image
              alt="Student studying"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Students</h3>

              <button className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-500 text-blue-500 transition hover:bg-blue-500 hover:text-white">
                <ChevronRight size={18} />
              </button>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Access attendance, academics, assignments, and updates through a
              simple student dashboard.
            </p>
          </div>
        </div>
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-lg">
          {/* Image */}
          <div className="relative h-[440px] w-full">
            <Image
              src="/images/SolutionCardOne.jpg" // replace with your image
              alt="Student studying"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Students</h3>

              <button className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-500 text-blue-500 transition hover:bg-blue-500 hover:text-white">
                <ChevronRight size={18} />
              </button>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Access attendance, academics, assignments, and updates through a
              simple student dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
