import {
  LayoutDashboard,
  Users,
  UsersRound,
  GraduationCap,
  School,
  IndianRupee,
  ClipboardCheck,
  BookOpen,
  FileMinus,
  ClipboardList,
  CalendarDays,
  Megaphone,
  FileText,
  KeyRound,
  UserCircle,
} from "lucide-react";

export const adminNav = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Teachers",
    href: "/admin/teachers",
    icon: Users,
  },
  {
    label: "Students",
    href: "/admin/students",
    icon: GraduationCap,
  },
  {
    label: "Parents",
    href: "/admin/parents",
    icon: UsersRound,
  },
  {
    label: "Classes",
    href: "/admin/classes",
    icon: School,
  },
  {
    label: "Subjects",
    href: "/admin/subjects",
    icon: FileMinus,
  },
  {
    label: "Announcements",
    href: "/admin/announcement",
    icon: ClipboardList,
  },
  {
    label: "School Settings",
    href: "/admin/settings",
    icon: School,
  },
];

export const managementNav = [
  {
    label: "Fees & Finance",
    href: "/admin/fees",
    icon: IndianRupee,
  },
  {
    label: "Exams & Results",
    href: "/admin/exams",
    icon: BookOpen,
  },
  {
    label: "Homework",
    href: "/admin/homework",
    icon: ClipboardCheck,
  },
  {
    label: "Reports & Analytics",
    href: "/admin/reports",
    icon: ClipboardList,
  },
];

export const teacherNav = [
  {
    label: "Dashboard",
    href: "/teacher/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Classes",
    href: "/teacher/myclass",
    icon: School,
  },
  {
    label: "My Subjects",
    href: "/teacher/subject",
    icon: GraduationCap,
  },
  {
    label: "Homework",
    href: "/teacher/homework",
    icon: ClipboardList,
  },
  {
    label: "Take Attendance",
    href: "/teacher/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "My Attendance",
    href: "/teacher/my-attendance",
    icon: UserCircle,
  },
  {
    label: "Attendance history",
    href: "/teacher/class/attendance-history",
    icon: ClipboardCheck,
  },
];

export const studentNav = [
  {
    label: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Profile",
    href: "/student/profile",
    icon: UserCircle,
  },
  {
    label: "Attendance",
    href: "/student/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Timetable",
    href: "/student/timetable",
    icon: CalendarDays,
  },
  {
    label: "Announcements",
    href: "/student/announcements",
    icon: Megaphone,
  },
  {
    label: "Documents",
    href: "/student/documents",
    icon: FileText,
  },
  {
    label: "My Homework",
    href: "/student/homework",
    icon: ClipboardList,
  },
  {
    label: "My Exams",
    href: "/student/exams",
    icon: BookOpen,
  },
  {
    label: "My Fees",
    href: "/student/fees",
    icon: IndianRupee,
  },
  {
    label: "Change Password",
    href: "/student/change-password",
    icon: KeyRound,
  },
];

export const parentNav = [
  {
    label: "Dashboard",
    href: "/parent/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Children",
    href: "/parent/children",
    icon: GraduationCap,
  },
];
