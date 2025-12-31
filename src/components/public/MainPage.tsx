import React from "react";
import { ArrowRight } from "lucide-react";
export default function MainPage() {
  return (
    <>
      <section className="bg-[#021034] flex flex-col items-center justify-center w-full rounded-[15px] mb-[124px] px-5">
        <div className="mt-[81px] px-10 text-center mb-[50px] flex flex-col items-center justify-center">
          <p className="text-[12px] font-[500] text-[#ffffff] py-[3px] px-[8px] border border-[#D7E3FC] rounded-[10px] w-[60px] mb-4">
            Feature
          </p>
          <h1 className="text-white text-[32px] font-semibold mb-4">
            Everything Your Institution Needs{" "}
          </h1>
          <p className="text-white text-[15px] font-[500] max-w-[560px]">
            One powerful platform to manage students, staff, fees,
            communication, and analytics—built for modern education.{" "}
          </p>
        </div>
        <div className="flex justify-around items-center hidden md:flex backdrop-blur-sm bg-white/10 border border-[#55689B]/20 text-white gap-[10px] p-[8px] rounded-[15px] mb-10">
          <p className="py-[5px] px-[15px] text-[16px] font-[500] rounded-[10px] hover:bg-[#D7E3FC] hover:text-[#051643] font-semibold cursor-pointer">
            {" "}
            Student dashboard
          </p>
          <p className="py-[5px] px-[15px] text-[16px] font-[500] rounded-[10px] hover:bg-[#D7E3FC] hover:text-[#051643] font-semibold cursor-pointer">
            {" "}
            Admin dashboard
          </p>
          <p className="py-[5px] px-[15px] text-[16px] font-[500] rounded-[10px] hover:bg-[#D7E3FC] hover:text-[#051643] font-semibold cursor-pointer">
            {" "}
            Teacher dashboard
          </p>
          <p className="py-[5px] px-[15px] text-[16px] font-[500] rounded-[10px] hover:bg-[#D7E3FC] hover:text-[#051643] font-semibold cursor-pointer">
            {" "}
            Parent dashboard
          </p>
        </div>
        <div className="">
          <div className=" max-w-[1260px] rounded-2xl bg-white py-6 md:py-10 pl-6 md:pl-10 shadow-sm pr-0 mb-[92px]">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 items-center ">
              {/* Left Content */}
              <div className="relative">
                {/* Icon */}
                <div className="mb-4 text-2xl">🎓</div>

                {/* Title */}
                <h2 className="mb-4 text-[32px] font-[600] text-[#051643]">
                  Centralized Student Management
                </h2>

                {/* Description */}
                <p className="mb-6 text-[16px] text-[#021034] font-[500] leading-relaxed">
                  The Student Dashboard provides learners with a clear and
                  organized view of their academic journey. Students can track
                  attendance, view assignments, monitor performance, and access
                  important announcements from a single place. This dashboard
                  helps students stay informed, responsible, and engaged with
                  their daily academic activities.
                </p>

                {/* Button */}
                <button
                  // onClick={onReadMore}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0a1d4d] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#08163a]  cursor-pointer"
                >
                  Read More
                  <ArrowRight size={16} />
                </button>

                {/* Background Star Effect */}
                {/* <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rotate-12 bg-yellow-100 opacity-40 blur-3xl" /> */}
              </div>

              {/* Right Placeholder Image */}
              <div className="h-[260px] w-full rounded-l-2xl bg-gray-200 md:h-[320px]" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center px-20">
          <div className="grid grid-cols-4 text-white items-center justify-between w-full mb-[92px] md:gap-[236px] gap-4">
            <div>
              <h1 className="text-[32px] font-[600]">500+</h1>
              <p className="text-[16px] font-[600]">Institutes</p>
            </div>
            <div>
              <h1 className="text-[32px] font-[600]">100K+ </h1>
              <p className="text-[16px] font-[600]">Students Managed</p>
            </div>
            <div>
              <h1 className="text-[32px] font-[600]">24/7</h1>
              <p className="text-[16px] font-[600]">Support</p>
            </div>
            <div>
              <h1 className="text-[32px] font-[600]">99.9%</h1>
              <p className="text-[16px] font-[600]">Uptime</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
