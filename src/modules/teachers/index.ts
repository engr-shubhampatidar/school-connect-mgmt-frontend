export * from "./api/adminTeachers";
export {
  getTeachers,
  getNotClassTeachers,
  normalizeAadharDigits,
  ApiValidationError,
  fetchSubjects,
  createTeacher,
  fetchTeacherById,
  updateTeacher,
  type TeacherOption,
  type TeacherProfileResponse,
  type UpdateTeacherPayload,
  type GenerateEmployeeIdPayload,
  type GenerateEmployeeIdResponse,
} from "./api/teacherService";
export {
  createTeacherSchema,
  SubjectSchema,
  SubjectsResponseSchema,
  type CreateTeacherValues,
  type Subject,
  type SubjectsResponse,
} from "./schemas/teacher.schema";
export { default as CreateTeacherDialog } from "./components/CreateTeacherDialog";
export { default as CreateTeacherForm } from "./components/CreateTeacherForm";
export { default as EditTeacherDialog } from "./components/EditTeacherDialog";
export { default as TeachersTable } from "./components/TeachersTable";
export {
  default as TeachersFilterBar,
  type TeachersFilters,
} from "./components/TeachersFilterBar";
export { default as AssignTeacherModal } from "./components/AssignTeacherModal";
export { default as SearchableDropdown } from "./components/SearchableDropdown";
export {
  default as AssignedSubjectsCard,
  mapAssignedSubjects,
  type AssignedSubjectView,
} from "./components/AssignedSubjectsCard";
export {
  default as TeachersPageSkeleton,
  TeachersTableSkeleton,
} from "./components/skeletons/TeachersPageSkeleton";
export { default as TeacherProfileSkeleton } from "./components/skeletons/TeacherProfileSkeleton";
export { default as MyClassPageSkeleton } from "./components/skeletons/MyClassPageSkeleton";
export { default as TeacherSubjectsPageSkeleton } from "./components/skeletons/TeacherSubjectsPageSkeleton";

export * from "./api/portal";
export { default as ClassSubjectAllocationTable } from "./components/ClassSubjectAllocationTable";
