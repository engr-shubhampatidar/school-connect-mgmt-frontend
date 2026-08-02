"use client";

import InfoField from "@/components/profile/InfoField";
import type { StudentDetails } from "@/modules/students/types/admin";
import { displayMobile } from "@/modules/students/utils/formatters";
import ProfileSection from "./ProfileSection";

type Props = {
  student: StudentDetails;
};

export default function StudentGuardianInfoCard({ student }: Props) {
  return (
    <ProfileSection title="Parent / Guardian Information" className="p-0">
      <div className="px-4 pb-4 grid grid-cols-2 gap-4">
        <InfoField label="Father Name" value={student.fatherName ?? "-"} />
        <InfoField
          label="Father Contact"
          value={displayMobile(student.fatherMobile)}
        />
        <InfoField label="Mother Name" value={student.motherName ?? "-"} />
        <InfoField
          label="Mother Contact"
          value={displayMobile(student.motherMobile)}
        />
        <InfoField label="Guardian Name" value={student.guardianName ?? "-"} />
        <InfoField
          label="Guardian Contact"
          value={displayMobile(student.guardianMobile)}
        />
      </div>
    </ProfileSection>
  );
}
