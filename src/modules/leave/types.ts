export type LeaveType = "CASUAL" | "SICK" | "EMERGENCY" | "MEDICAL" | "OTHER";
export type TeacherLeaveType = "CASUAL" | "SICK";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
export type LeaveApplicantType = "STUDENT" | "TEACHER";

export type LeaveSummary = {
  id: string;
  schoolId: string;
  applicantType: LeaveApplicantType;
  applicantName: string;
  className?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  createdAt: string;
  updatedAt: string;
};

export type LeaveDetail = LeaveSummary & {
  studentId?: string;
  teacherId?: string;
  classId?: string;
  reason: string;
  reviewedByUserId?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  rejectionReason?: string;
};

export type LeaveListResponse = {
  items: LeaveSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  casualLeave?: number;
  sickLeave?: number;
  totalUsedLeaves?: number;
};

export type LeaveListQuery = {
  status?: LeaveStatus;
  leaveType?: LeaveType;
  fromDate?: string;
  toDate?: string;
  teacherId?: string;
  page?: number;
  limit?: number;
};

export type CreateLeavePayload = {
  leaveType: TeacherLeaveType;
  startDate: string;
  endDate: string;
  reason: string;
};

export type LeaveBalanceItem = {
  leaveType: LeaveType;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
};

export type TeacherLeaveBalance = {
  teacherId: string;
  teacherProfileId?: string;
  teacherName: string;
  employeeId?: string | null;
  balances: LeaveBalanceItem[];
};

export type TeacherLeaveBalanceList = {
  items: TeacherLeaveBalance[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AllocateLeavePayload = {
  casualLeave: number;
  sickLeave: number;
};
