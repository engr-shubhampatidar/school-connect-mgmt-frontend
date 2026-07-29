"use client";
import React from "react";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ClassesFilterBar() {
  return (
    <Card>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
        <div className="flex-1 w-1/2">
          <div className=" lg:w-90 flex-1">
            <label className="sr-only">Search classes</label>
            <Input className="bg-[#F5F9FF]" placeholder="Search by name" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost">Reset</Button>
        </div>
      </div>
    </Card>
  );
}
