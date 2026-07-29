"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import SuccessModal from "@/components/ui/SuccessModal";
import {
  useTeacherAttendance,
  AttendanceActionBar,
  AttendanceSkeleton,
  ClassDateHeader,
  StudentAttendanceTable,
} from "@/modules/attendance";

export default function TeacherAttendancePage() {
  const {
    loading,
    klass,
    students,
    date,
    setDate,
    maxDate,
    attendanceExists,
    submitting,
    setStatus,
    save,
  } = useTeacherAttendance();
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSave = async () => {
    const saved = await save();
    if (saved) setSuccessOpen(true);
  };

  if (loading) return <AttendanceSkeleton />;

  if (!klass || !klass.id) {
    return (
      <div className="p-4">
        <Card>
          <h3 className="text-lg font-medium">No class assigned</h3>
          <p className="text-sm text-slate-600">
            Attendance is only available for class teachers.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 p-4 pb-20">
        <ClassDateHeader
          name={klass.name}
          section={klass.section}
          date={date}
          maxDate={maxDate}
          onDateChange={setDate}
        />
        <div className="overflow-y-auto max-h-[400px]"></div>

        <StudentAttendanceTable
          students={students}
          onStatusChange={setStatus}
          disabled={attendanceExists}
        />
      </div>

      <AttendanceActionBar
        submitting={submitting}
        attendanceExists={attendanceExists}
        onSave={handleSave}
      />
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
}
