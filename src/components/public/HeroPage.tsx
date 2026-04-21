"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import TrustBy from "./TrustBy";

const images = [
  "/images/MainImage1.jpg",
  "/images/MainImage2.jpg",
  "/images/MainImage3.jpg",
];

// clone first slide at end
const slides = [...images, images[0]];

export default function HeroPage() {
  const router = useRouter();
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
    <section className="w-full flex justify-center md:py-5 mb-[92px] flex-col">
      <div className="relative w-full min-w-full min-h-full overflow-hidden md:rounded-xl">
        <div
          className={`md:flex md:rounded-xl hidden ${
            transition ? "transition-transform duration-700 ease-in-out" : ""
          }`}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((src, index) => (
            <div key={index} className="min-w-full min-h-full">
              <div className="absolute w-full min-h-full flex items-center justify-start">
                <div className="flex flex-col text-[#021034] lg:pl-[60px] md:pl-[40px]   lg:gap-5">
                  <p className="text-[12px] lg:text-[16px] font-[500]">
                    Smart Institute Management Platform
                  </p>
                  <h1 className="text-[48px] 2xl:text-[64px] font-semibold lg:max-w-[700px]  md:max-w-[500px] lg:leading-[56px] lg:mb-4">
                    Smarter Tools for Student Success
                  </h1>
                  <p className="text-[16px] lg:text-[20px] font-[500] max-w-[500px]">
                    Track attendance, performance, and academics with a modern,
                    seamless student management system.
                  </p>
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => {
                        router.push("/register-school");
                      }}
                      className="bg-[#021034] text-white px-4 py-2 rounded-[8px] lg:text-[16px] font-[600] flex items-center cursor-pointer"
                    >
                      Get Started
                      <ArrowRight size={16} className="inline-block ml-2" />
                    </button>
                    <button
                      onClick={() => {
                        router.push("/login");
                      }}
                      className="bg-transparent border border-[#021034] text-[#021034] px-4 py-2 rounded-[8px] lg:text-[16px] font-[600] flex items-center cursor-pointer"
                    >
                      Log In
                      <ArrowRight size={16} className=" ml-2 inline-block" />
                    </button>
                  </div>
                </div>
              </div>
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
        <div className="flex w-full ">
          <div className="absolute w-full min-h-full flex px-[10px] py-[20px] md:py-0 md:px-0  md:hidden">
            <div className="flex flex-col text-[#021034] lg:pl-[60px] gap-[8px]">
              <p className="text-[8px] lg:text-[16px] font-[500] px-[8px] py-[3px] border-[1px] border-[#D7E3FC] w-fit rounded-md">
                Smart Institute Management Platform
              </p>
              <h1 className="text-[32px] font-semibold max-w-[340px] lg:leading-[56px] leading-[40px] lg:mb-4">
                Smarter Tools for Student Success
              </h1>
              <p className="text-[12px] lg:text-[20px] font-[500] max-w-[500px]">
                Track attendance, performance, and academics with a modern,
                seamless student management system.
              </p>
              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => {
                    router.push("/register-school");
                  }}
                  className="bg-[#021034] text-white p-[8px] rounded-[8px] text-[11px] font-[600] flex items-center cursor-pointer"
                >
                  Get Started
                  <ArrowRight size={16} className="inline-block ml-2" />
                </button>
                <button
                  onClick={() => {
                    router.push("/login");
                  }}
                  className="bg-transparent border border-[#021034] text-[#021034] p-[8px] rounded-[8px] text-[11px] font-[600] flex items-center cursor-pointer"
                >
                  Log In
                  <ArrowRight size={16} className=" ml-2 inline-block" />
                </button>
              </div>
            </div>
          </div>
          <Image
            src="/images/HeroMobile.png"
            alt="Hero Mobile"
            width={375}
            height={600}
            className="object-cover w-full h-full md:hidden"
            priority
          />
        </div>
      </div>
      <section
        className="mx-auto flex max-w-[1290px] items-center gap-[54px] rounded-2xl mt-[70px] hidden lg:flex px-10 py-8 "
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
      <section className="">
        <div className="flex  items-center justify-center mt-10 md:mt-20">
          <div className="w-full border-t border-[#021034] "></div>
          <div className="px-1 text-[#05164380] text-[10px] md:text-[20px] font-[600] min-w-[60px] md:min-w-[107px] text-center">
            <span>Trusted By</span>
          </div>
          <div className="w-full border-t border-[#021034]"></div>
        </div>
          <TrustBy/>
      </section>
    </section>
  );
}
