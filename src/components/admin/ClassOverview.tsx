import { Plus } from "lucide-react";
import React from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import ClassOverviewHeader, {
  ClassDashboardDetails,
} from "./ClassOverviewHeader";
import AddSubjectToClassDialog from "./AddSubjectToClassDialog";
import AddTimetableDialog from "./AddTimetableDialog";

// Types
interface ClassMeta {
  name: string;
  academicYear: string;
  teacher: { name: string; avatar?: string };
  totalStudents: number;
  room: string;
  status: "Active" | "Inactive";
}

import SubjectAllocationTable, {
  ClassSubjectAllocation,
} from "./SubjectAllocationTable";
import TimetableList, { ClassTimetableEntry } from "./TimetableList";

// Mock data
const CLASS_META: ClassMeta = {
  name: "Class 10 – Section A",
  academicYear: "2025–2026",
  teacher: { name: "Mr. Anderson", avatar: undefined },
  totalStudents: 34,
  room: "Building A, Room-305",
  status: "Active",
};

// Subject list is supplied by parent via props (see container/page)

// Timetable is loaded from API and rendered via TimetableList

interface Props {
  subjects: ClassSubjectAllocation[];
  isLoading: boolean;
  error?: string | null;
  timetableItems?: ClassTimetableEntry[];
  isLoadingTimetable?: boolean;
  timetableError?: string | null;
  selectedDay?: number;
  details?: ClassDashboardDetails | null;
  isLoadingDetails?: boolean;
  detailsError?: string | null;
  classId?: string;
  onReloadSubjects?: () => void;
  onReloadTimetable?: () => void;
}

export default function ClassOverview({
  subjects,
  isLoading,
  error,
  timetableItems,
  isLoadingTimetable,
  timetableError,
  selectedDay,
  details,
  isLoadingDetails,
  detailsError,
  classId,
  onReloadSubjects,
  onReloadTimetable,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isTimetableDialogOpen, setIsTimetableDialogOpen] =
    React.useState(false);
  return (
    <div className="space-y-6">
      <ClassOverviewHeader
        data={details ?? null}
        isLoading={!!isLoadingDetails}
        error={detailsError ?? null}
      />

      {/* Class & Subject Allocation */}
      <div className="bg-white rounded-lg border border-[#D7E3FC]">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-[24px] font-semibold ">
            Class & Subject Allocation
          </h3>
          <Button
            onClick={() => {
              console.log("clicked");
              setIsDialogOpen((prev) => !prev);
            }}
            variant="dark"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Plus size={14} /> Add Subject to Class
          </Button>
          <AddSubjectToClassDialog
            open={isDialogOpen}
            classId={classId ?? details?.id}
            onClose={() => setIsDialogOpen(false)}
            onSuccess={() => {
              setIsDialogOpen(false);
              onReloadSubjects?.();
            }}
          />
        </div>
        <div className="">
          <SubjectAllocationTable
            items={subjects}
            isLoading={isLoading}
            error={error ?? null}
            room={CLASS_META.room}
          />
        </div>
      </div>

      {/* Subject Time Timetable */}
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Subject Time Timetable</h3>
          <Button
            variant="dark"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsTimetableDialogOpen(true)}
          >
            <Plus size={14} /> Add Timetable Entry
          </Button>
          <AddTimetableDialog
            open={isTimetableDialogOpen}
            classId={classId ?? details?.id}
            onClose={() => setIsTimetableDialogOpen(false)}
            onSuccess={() => {
              setIsTimetableDialogOpen(false);
              onReloadTimetable?.();
            }}
          />
        </div>

        <div className="mt-4">
          <TimetableList
            items={timetableItems ?? []}
            isLoading={isLoadingTimetable ?? false}
            selectedDay={selectedDay}
          />
          {timetableError ? (
            <div className="mt-2 text-sm text-red-600">{timetableError}</div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
