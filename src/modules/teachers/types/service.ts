export interface TeacherOption {
  id: string;
  name: string;
  subjects?: string[];
  subject_count?: number;
  user_id?: string;
}

export interface GenerateEmployeeIdPayload {
  fullName: string;
  date_of_birth: string;
  phone: string;
}

export interface GenerateEmployeeIdResponse {
  employee_id: string;
}

export interface TeacherProfileResponse {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  address: string;
  gender: string;
  date_of_birth: string | null;
  aadhar: string;
  subject_speciality: string[];
  employee_id: string;
}

export interface UpdateTeacherPayload {
  mobile: string;
  address: string;
  subject_speciality: string[];
}
