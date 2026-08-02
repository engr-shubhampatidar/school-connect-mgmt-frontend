"use client";

import InfoField from "@/components/profile/InfoField";
import type { StudentDetails } from "@/modules/students/types/admin";
import {
  displayAadhaar,
  displayMobile,
  formatDisplayDate,
  formatLabel,
} from "@/modules/students/utils/formatters";
import ProfileSection from "./ProfileSection";

type Props = {
  student: StudentDetails;
};

export default function StudentPersonalInfoCard({ student }: Props) {
  return (
    <ProfileSection title="Personal Information" className="p-0">
      <div className="px-4 pb-4 grid grid-cols-2 gap-4">
        <InfoField label="Full Name" value={student.name} />
        <InfoField
          label="Date of Birth"
          value={formatDisplayDate(student.dob)}
        />
        <InfoField label="Gender" value={formatLabel(student.gender)} />
        <InfoField label="Blood Group" value={student.bloodGroup ?? "-"} />
        <InfoField
          label="Aadhaar Number"
          value={displayAadhaar(student.aadhaarNumber)}
        />
        <InfoField label="Phone No." value={displayMobile(student.phoneNo)} />
        <InfoField label="Email Address" value={student.email ?? "-"} />
        <div className="col-span-2">
          <InfoField label="Address" value={student.address ?? "-"} />
        </div>
        <div className="col-span-2">
          <InfoField
            label="Medical Notes"
            value={student.medicalNotes ?? "-"}
          />
        </div>
      </div>
    </ProfileSection>
  );
}
