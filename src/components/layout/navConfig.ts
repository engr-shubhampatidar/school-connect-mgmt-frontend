import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  IndianRupee,
  ClipboardCheck,
  BookOpen,
  FileMinus,
  ClipboardList,
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
  }
];
export const managementNav = [
  {
    label: "Fees & Finance",
    href: "/admin/fees",
    icon: IndianRupee,
  },
  {
    label: "Exams & Results",
    href: "/admin/staff",
    icon: BookOpen,
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
    label: "Take Attendance",
    href: "/teacher/attendance",
    icon: ClipboardCheck,
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
    icon: GraduationCap,
  },
];
