import type {
  CreateTimetableEntryDto,
  TimetableEntryDto,
  UpdateTimetableEntryDto,
} from "@/modules/timetable/types/timetable";
import { ADMIN_API } from "@/config/api-routes";
import API from "@/services/axios";

export type {
  CreateTimetableEntryDto,
  TimetableEntryDto,
  UpdateTimetableEntryDto,
} from "@/modules/timetable/types/timetable";

export async function fetchTimetable(
  classId: string,
): Promise<TimetableEntryDto[]> {
  const url = `${ADMIN_API.CLASSES}/${classId}/timetable`;
  const res = await API.get<TimetableEntryDto[]>(url);
  return res.data || [];
}

export async function createTimetableEntry(
  classId: string,
  payload: CreateTimetableEntryDto,
): Promise<TimetableEntryDto> {
  const url = `${ADMIN_API.CLASSES}/${classId}/timetable`;
  const res = await API.post<TimetableEntryDto>(url, payload);
  return res.data;
}

export async function updateTimetableEntry(
  classId: string,
  teId: string,
  payload: UpdateTimetableEntryDto,
): Promise<TimetableEntryDto> {
  const url = `${ADMIN_API.CLASSES}/${classId}/timetable/${teId}`;
  const res = await API.put<TimetableEntryDto>(url, payload);
  return res.data;
}

export async function deleteTimetableEntry(
  classId: string,
  teId: string,
): Promise<{ message: string }> {
  const url = `${ADMIN_API.CLASSES}/${classId}/timetable/${teId}/delete`;
  const res = await API.post(url);
  return res.data;
}
