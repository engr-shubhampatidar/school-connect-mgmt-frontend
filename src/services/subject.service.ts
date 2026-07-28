import { ADMIN_API } from "@/lib/api-routes";
import axios from "@/lib/axios";

export interface Subject {
  id: string;
  name: string;
}

const BASE = ADMIN_API.SUBJECTS;

function normalizeSubjectItem(it: any): Subject {
  if (!it) return { id: "", name: "" };
  if (typeof it === "string") return { id: it, name: it };
  const o = it as Record<string, any>;
  return {
    id: String(o.id ?? o._id ?? o.uuid ?? o.value ?? o.key ?? ""),
    name: String(o.name ?? o.title ?? o.value ?? ""),
  };
}

export async function searchSubjects(search = "", includeDeleted = false) {
  const res = await axios.get(`${BASE}`, {
    params: { search, includeDeleted },
  });
  const data = res.data.subjects;
  // API may return { items: [...] } or an array directly
  if (Array.isArray(data)) {
    return data.map(normalizeSubjectItem);
  }
  if (data && typeof data === "object") {
    const items = data.items ?? data.data ?? [];
    if (Array.isArray(items)) return items.map(normalizeSubjectItem);
  }
  return [];
}

export async function createSubject(payload: { name: string }) {
  const res = await axios.post(`${BASE}`, payload);
  return normalizeSubjectItem(res.data);
}

export default { searchSubjects, createSubject };
