"use client";
import React from "react";
import Card from "../ui/Card";
import { Input } from "../ui/Input";
import DefaultSelect from "../ui/Select";
import Button from "../ui/Button";

const classOptions = [
  { id: "", name: "All Classes" },
  { id: "class-10", name: "Class 10" },
  { id: "class-9", name: "Class 9" },
];

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

        <div className="w-28 ">
          <label className="sr-only">All Classes</label>
          <DefaultSelect
            options={classOptions}
            value={""}
            onChange={() => {}}
            placeholder="All Classes"
            className="bg-[#F5F9FF] w-full"
          />
        </div>

        <div className="w-28">
          <label className="sr-only">Status</label>
          <DefaultSelect
            options={[
              { id: "", name: "All Status" },
              { id: "assigned", name: "Assigned" },
              { id: "not-assigned", name: "Not Assigned" },
            ]}
            value={""}
            onChange={() => {}}
            placeholder="All status"
            className="bg-[#F5F9FF] w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost">Reset</Button>
        </div>
      </div>
    </Card>
  );
}
