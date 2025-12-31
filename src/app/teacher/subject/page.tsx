import AssignedSubjectsCard from "./Components/AssignedSubjectsCard";

export default function TeacherDashboard() {
  const assignedSubjects = [
    {
      className: "Class 10",
      section: "Section A",
      subject: "Mathematics",
      studentCount: 32,
    },
    {
      className: "Class 10",
      section: "Section B",
      subject: "Mathematics",
      studentCount: 28,
    },
    {
      className: "Class 9",
      section: "Section C",
      subject: "Science",
      studentCount: 35,
    },
    {
      className: "Class 11",
      section: "Section B",
      subject: "Physics",
      studentCount: 30,
    },
    {
      className: "Class 11",
      section: "Section A",
      subject: "Physics",
      studentCount: 30,
    },
  ];
  return (
    <div className="p-6">
      <AssignedSubjectsCard
        subjects={assignedSubjects}
        // onSearch={(v) => console.log(v)}
        // onClassFilter={() => console.log("Class Filter")}
        // onSubjectFilter={() => console.log("Subject Filter")}
      />
    </div>
  );
}
