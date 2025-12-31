"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const images = ["/images/Hero1.png", "/images/Hero2.png", "/images/Hero3.png"];

// clone first slide at end
const slides = [...images, images[0]];

export default function HeroPage() {
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle seamless loop
  useEffect(() => {
    if (current === slides.length - 1) {
      setTimeout(() => {
        setTransition(false); // disable animation
        setCurrent(0); // jump back
      }, 700); // must match transition duration
    } else {
      setTransition(true);
    }
  }, [current]);

  return (
    <section className="w-full flex justify-center py-5 mb-[92px] flex-col">
      <div className="relative w-full min-w-full min-h-full overflow-hidden rounded-xl">
        <div
          className={`flex rounded-xl ${
            transition ? "transition-transform duration-700 ease-in-out" : ""
          }`}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((src, index) => (
            <div key={index} className="min-w-full min-h-full">
              <Image
                src={src}
                alt={`Hero ${index + 1}`}
                width={1255}
                height={516}
                className="object-cover w-full h-full "
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
      <section
        className="mx-auto flex max-w-[1290px] items-center gap-[54px] rounded-2xl mt-[70px] hidden md:flex px-10 py-8 "
        style={{ height: 285 }}
      >
        {/* LEFT CONTENT */}
        <div className="flex-1">
          <span className="inline-block rounded-full border border-[#021034] px-[8px] py-[3px] text-[12px] text-[#021034]">
            About Our Platform
          </span>

          <h2 className="mt-5 text-3xl font-semibold leading-snug text-[#051643]">
            We believe in creating intelligent systems that enable efficient
            institute management.
          </h2>

          <p className="mt-3 max-w-xl text-sm text-[#021034]">
            Whether you run a school, college, or coaching institute, our
            platform helps you manage academics, administration, fees, and
            communication efficiently — without complexity.
          </p>

          <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#021034] px-5 py-2.5 text-sm text-white transition hover:bg-blue-800">
            Get Started
            <ArrowRight size={16} />
          </button>
        </div>

        {/* RIGHT CARD */}
        <div className="relative h-full w-[420px] overflow-hidden rounded-xl">
          <Image
            src="/images/Hero1.png" // replace with your image
            alt="Smart Institute Management"
            fill
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 p-4">
            <div className="flex items-center gap-3 text-white">
              <div className="h-10 w-10 rounded-full bg-blue-100" />
              <span className="text-sm font-medium">
                Smart Institute Management Solutions
              </span>
            </div>

            <p className="absolute bottom-4 left-4 right-4 text-sm text-gray-200">
              Our platform simplifies academics, administration, finance, and
              communication in one secure system.
            </p>
          </div>
        </div>
      </section>
      <div className="flex items-center justify-center mt-20">
        <div className="w-full border-t border-[#021034] "></div>
        <div className="px-1 text-[#05164380] text-[20px] font-[600] min-w-[107px] text-center">
          <span>Trusted By</span>
        </div>
        <div className="w-full border-t border-[#021034]"></div>
      </div>
    </section>
  );
}
