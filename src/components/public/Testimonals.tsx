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
      <div className="overflow-hidden flex gap-10 overflow-x-auto py-10 px-24">
        <TestimonialCard
          quote="Before EduCore, I was staying back until 7 PM reconciling records. Now everything updates automatically. I can actually leave at a reasonable hour."
          name="Priya Sharma"
          role="Principal"
          avatar="/priya.jpg"
          company="Creative Market"
        />
        <TestimonialCard
          quote="Before EduCore, I was staying back until 7 PM reconciling records. Now everything updates automatically. I can actually leave at a reasonable hour."
          name="Priya Sharma"
          role="Principal"
          avatar="/priya.jpg"
          company="Creative Market"
        />
        <TestimonialCard
          quote="Before EduCore, I was staying back until 7 PM reconciling records. Now everything updates automatically. I can actually leave at a reasonable hour."
          name="Priya Sharma"
          role="Principal"
          avatar="/priya.jpg"
          company="Creative Market"
        />
      </div>
    </section>
  );
}
