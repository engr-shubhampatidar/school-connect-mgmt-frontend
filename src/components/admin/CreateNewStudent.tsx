"use client";

import { useEffect } from "react";
import { FormField, FormLabel, FormControl } from "@/components/ui/Form";
import { Badge, Button, Card, Input } from "../ui";
import { Car, ChevronDown } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string; // optional custom width
}

export default function CreateNewStudent({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-lg",
}: ModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-[777px] p-4 max-h-full overflow-hidden no-scrollbar overflow-y-auto">
          <div className="rounded-lg">
            <div className=" min-h-full">
              <div className="flex items-start sticky top-0 bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
                <div>
                  <h3 className="text-[24px] font-[700] text-white">
                    Create New Student
                  </h3>
                  <p className="text-[14px] font-[400] text-white">
                    Fill in the details to register a new student in the system.
                  </p>
                </div>
                <div>
                  <button
                    aria-label="close"
                    onClick={onClose}
                    className="text-white hover:text-white/80"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-[16px] bg-white overflow-hidden rounded-b-lg max-h-full">
                <Card>
                  <h1 className="text-[16px] text-[#0F172A] font-semibold font-[600] mb-[24px]">
                    Class Information
                  </h1>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField>
                        <FormLabel>Student Name </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="e.g. John Doe" />
                        </FormControl>
                      </FormField>
                      <FormField>
                        <FormLabel>Class Name</FormLabel>
                        <FormControl>
                          <div className="flex justify-between w-full rounded-md border border-[#D7E3FC]  px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]">
                            <p>Select</p>
                            <div className="flex items-center">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </FormControl>
                      </FormField>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField>
                        <FormLabel>Email Address </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Raj patidar" />
                        </FormControl>
                      </FormField>
                      <FormField>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="flex w-full rounded-md border border-[#D7E3FC]  text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]  focus-within:ring-1 focus-within:ring-[#D7E3FC] focus-within:border-[#D7E3FC]">
                            <p className="border-r border-[#D7E3FC] px-2 py-2">
                              +91
                            </p>
                            <input
                              className="pl-2 w-full outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
                              type="text"
                              placeholder="9876543210"
                            />
                          </div>
                        </FormControl>
                      </FormField>
                    </div>
                    <FormField>
                      <FormLabel>Profile URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="https://linkedin.com/in/student-name"
                        />
                      </FormControl>
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField>
                        <FormLabel>Admission Date </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Raj patidar" />
                        </FormControl>
                      </FormField>
                      <FormField>
                        <FormLabel>EmployeeID</FormLabel>
                        <FormControl>
                          <div className="flex justify-between w-full rounded-md border border-[#D7E3FC] bg-[#F5F9FF] px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]">
                            <p>ST-XXXX</p>
                          </div>
                        </FormControl>
                      </FormField>
                    </div>
                  </div>
                </Card>
                <div className="mt-6 flex sticky bottom-0 justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>

                  <Button type="button" variant="dark">
                    Create Student
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
