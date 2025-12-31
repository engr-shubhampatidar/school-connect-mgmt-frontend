import { Label } from "@radix-ui/react-select";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  IndianRupee,
  ClipboardCheck,
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
    label: "Fees",
    href: "/admin/fees",
    icon: IndianRupee,
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
    href: "/teacher/attendance-history",
    icon: ClipboardCheck,
  },
  {
    label: "Assignments",
    href: "/teacher/assignments",
    icon: GraduationCap,
  }
];

export const studentNav = [
  {
    label: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },  
];