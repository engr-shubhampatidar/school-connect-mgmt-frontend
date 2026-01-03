import { Label } from "@radix-ui/react-select";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  IndianRupee,
  ClipboardCheck,
  BookOpen,
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
    label: "Subjects",
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
  {
    label: "Assignments",
    href: "/teacher/assignments",
    icon: GraduationCap,
  },
];

export const studentNav = [
  {
    label: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
];
