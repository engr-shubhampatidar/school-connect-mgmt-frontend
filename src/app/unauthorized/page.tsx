"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
export default function page() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-8 bg-black cursor-no-drop">
      <h1 className="text-xl md:text-2xl lg:text-5xl xl:text-8xl text-red-600 flex flex-col items-center">
        BAKCHODI MAT KAR L*UDE!{" "}
      </h1>
      <Button className="cursor-pointer" variant="dark" onClick={() => router.back()}>JAHA SE AAYA VAHI CHALA JA....</Button>
    </div>
  );
}
