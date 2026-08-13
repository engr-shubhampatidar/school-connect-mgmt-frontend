export * from "./types";
export * from "./api/parentPortal";
export * from "./hooks/useParentPortal";
export {
  PARENT_PORTAL_PAGE_SIZE,
  parentPortalQueryKeys,
} from "./constants/query-keys";

export { default as ChildSwitcher } from "./components/ChildSwitcher";
export { default as ChildSubnav } from "./components/ChildSubnav";
export { default as ParentDashboardView } from "./components/ParentDashboardView";
export { default as ChildrenListView } from "./components/ChildrenListView";
export { default as ChildDashboardView } from "./components/ChildDashboardView";
export { default as ChildProfileView } from "./components/ChildProfileView";
export { default as ChildAttendanceView } from "./components/ChildAttendanceView";
export { default as ChildTimetableView } from "./components/ChildTimetableView";
export { default as ChildHomeworkListView } from "./components/ChildHomeworkListView";
export { default as ChildHomeworkDetailView } from "./components/ChildHomeworkDetailView";
export { default as ChildFeesView } from "./components/ChildFeesView";
export { default as ChildExamsView } from "./components/ChildExamsView";
export { default as ChildAnnouncementsView } from "./components/ChildAnnouncementsView";
export { default as ChildDocumentsView } from "./components/ChildDocumentsView";
