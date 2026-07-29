import type {
  ClassSubjectDto,
  CreateClassSubjectDto,
  UpdateClassSubjectDto,
} from "@/modules/classes/types/classSubjects";
import { ADMIN_API } from "@/config/api-routes";
import API from "@/services/axios";

export type {
  ClassSubjectDto,
  CreateClassSubjectDto,
  UpdateClassSubjectDto,
} from "@/modules/classes/types/classSubjects";

export async function fetchClassSubjects(
  classId: string,
): Promise<ClassSubjectDto[]> {
  const url = `${ADMIN_API.CLASSES}/${classId}/subjects`;
  const res = await API.get<ClassSubjectDto[]>(url);
  return res.data || [];
}

export async function assignSubjectToClass(
  classId: string,
  payload: CreateClassSubjectDto,
): Promise<ClassSubjectDto> {
  const url = `${ADMIN_API.CLASSES}/${classId}/subjects`;
  const res = await API.post<ClassSubjectDto>(url, payload);
  return res.data;
}

export async function updateClassSubject(
  classId: string,
  csId: string,
  payload: UpdateClassSubjectDto,
): Promise<ClassSubjectDto> {
  const url = `${ADMIN_API.CLASSES}/${classId}/subjects/${csId}`;
  const res = await API.put<ClassSubjectDto>(url, payload);
  return res.data;
}

export async function removeClassSubject(
  classId: string,
  csId: string,
): Promise<{ message: string }> {
  const url = `${ADMIN_API.CLASSES}/${classId}/subjects/${csId}/delete`;
  const res = await API.post(url);
  return res.data;
}
