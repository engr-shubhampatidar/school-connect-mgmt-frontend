export {
  registerSchool,
  type RegisterSchoolPayload,
} from "./api/registerSchool";
export {
  fetchSchoolSettings,
  updateSchoolLocation,
  type SchoolLocation,
  type SchoolSettings,
  type UpdateSchoolLocationPayload,
} from "./api/schoolSettings";
export {
  RegisterSchoolForm,
  default as RegisterSchoolFormDefault,
} from "./components/RegisterSchoolForm";
export {
  SchoolLocationForm,
  default as SchoolLocationFormDefault,
} from "./components/SchoolLocationForm";
export { default as RegisterNavbar } from "./components/RegisterNavbar";
