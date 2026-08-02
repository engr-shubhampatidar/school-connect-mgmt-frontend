import type { Student } from "@/modules/students/types/admin";

type ListRow = {
  id: string;
  name: string;
  studentId?: string | number | null;
  className?: string | null;
  section?: string | null;
  currentClass?: { name: string; section?: string | null } | null;
  email?: string | null;
  photoUrl?: string | null;
  createdAt: string;
};

/** Normalize list API rows into the flat Student shape used by the UI. */
export function mapStudentListItem(row: ListRow): Student {
  return {
    id: row.id,
    name: row.name,
    studentId: row.studentId ?? null,
    className: row.className ?? row.currentClass?.name ?? null,
    section: row.section ?? row.currentClass?.section ?? null,
    email: row.email ?? null,
    photoUrl: row.photoUrl ?? null,
    createdAt: row.createdAt,
  };
}
