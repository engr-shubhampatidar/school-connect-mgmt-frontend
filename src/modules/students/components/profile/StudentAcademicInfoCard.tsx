"use client";

import type { StudentDetails } from "@/modules/students/types/admin";
import {
  formatClassSection,
  formatDisplayDate,
} from "@/modules/students/utils/formatters";
import ProfileSection from "./ProfileSection";

type Props = {
  student: StudentDetails;
};

function AcademicRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <p className="font-medium text-sm text-[#021034] py-4">{label}</p>
      <p className="font-medium text-sm text-[#021034] py-4 text-right">
        {value}
      </p>
      <div className="col-span-2 border-b border-blue-200" />
    </>
  );
}

export default function StudentAcademicInfoCard({ student }: Props) {
  return (
    <ProfileSection title="Academic Info" className="p-0">
      <div className="px-4 pb-2 grid grid-cols-2">
        <AcademicRow
          label="Class & Section"
          value={formatClassSection(student.className, student.section)}
        />
        <AcademicRow
          label="Admission Date"
          value={formatDisplayDate(student.admissionDate)}
        />
      </div>
    </ProfileSection>
  );
}
