export type Subject = {
  id: string;
  name: string;
  code?: string;
  schoolId?: string;
};

export type SubjectsResponse = {
  subjects: Subject[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type SubjectsQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
};
