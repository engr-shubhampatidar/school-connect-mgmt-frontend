export type Student = {
  id: string;
  name: string;
  studentId?: string | number | null;
  className?: string | null;
  section?: string | null;
  email?: string | null;
  photoUrl?: string | null;
  createdAt: string;
};

export type StudentsResponse = {
  students: Student[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type StudentsQuery = {
  search?: string;
  classId?: string;
  page?: number;
  pageSize?: number;
};

export type StudentMonthlyAttendance = {
  year: number;
  month: number;
  present: number;
  absent: number;
  leave: number;
  percentage: number;
};

/** GET /admin/students/{id} response */
export interface StudentDetails {
  id: string;
  name: string;
  email: string | null;
  studentId: string | null;
  phoneNo: string | null;
  gender: string | null;
  admissionDate: string | null;
  className: string | null;
  section: string | null;
  aadhaarNumber: string | null;
  address: string | null;
  fatherName: string | null;
  fatherMobile: string | null;
  motherName: string | null;
  motherMobile: string | null;
  guardianName: string | null;
  guardianMobile: string | null;
  bloodGroup: string | null;
  medicalNotes: string | null;
  dob: string | null;
  attendance: StudentMonthlyAttendance | null;
  /** Present on some update-loader payloads */
  classId?: string | null;
  category?: string | null;
}
