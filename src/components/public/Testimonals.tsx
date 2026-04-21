import React from "react";
import TestimonialCard from "./Components/TestimonialCard";

export default function Testimonals() {
  return (
    <section className="flex flex-col justify-center items-center mb-[118px]">
      <div className="min-w-full flex items-center justify-center flex-col">
        <h1 className="text-[#021034] text-[32px] font-[600] font-semibold">
          From Chaos to Clarity
        </h1>
        <p className="text-[#021034] text-[15px] font-[500] mt-2 text-center">
          Hear from principals, administrators, and teachers who transformed
          their schools with Us
        </p>
      </div>
      <div className="grid grid-cols-1 gap-10 overflow-x-auto py-10 px-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:px-20">
        <TestimonialCard
          quote="Before EduCore, I was spending hours every evening reviewing reports and managing operations manually. Now everything is streamlined and automated. I finally have time to focus on improving our school, not just running it."
          name="Priya Sharma"
          role="Principal"
          avatar="/images/images.png"
          company="Sunrise Public School"
        />
        <TestimonialCard
          quote="Managing attendance, assignments, and grading used to be overwhelming. With EduCore, everything is in one place. It has made my daily teaching workflow much smoother and more efficient."
          name="Rahul Verma"
          role="Senior Teacher"
          avatar="/images/images.png"
          company="Green Valley High School"
        />
        <TestimonialCard
          quote="Our admission process and fee tracking were completely manual before. EduCore helped us digitize everything. The accuracy and time savings have been incredible."
          name="Neha Gupta"
          role="Admin Officer"
          avatar="/images/images.png"
          company="Bright Future Academy"
        />
      </div>
    </section>
  );
}
