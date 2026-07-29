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
  status?: string;
  page?: number;
  pageSize?: number;
};

export interface StudentDetails {
  id: string;
  name: string;
  email: string;
  studentId: string;
  phoneNo: string;
  gender: string | null;
  category: string | null;
  admissionDate: string | null;
  aadhaar: string | null;
  address: string | null;
  rollNo: string | null;
  fatherName: string | null;
  fatherMobile: string | null;
  fatherEmail: string | null;
  motherName: string | null;
  emergencyContact: string | null;
  dob: string | null;
}
