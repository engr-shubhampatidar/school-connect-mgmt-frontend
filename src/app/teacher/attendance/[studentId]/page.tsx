import StudentAttendanceHistoryClient from "./StudentAttendanceHistoryClient";

type Props = {
  params: { studentId: string };
};

export default function Page({ params }: Props) {
  return <StudentAttendanceHistoryClient studentId={params.studentId} />;
}
