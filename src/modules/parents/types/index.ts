export type ParentRelationship =
  | "FATHER"
  | "MOTHER"
  | "GUARDIAN"
  | "OTHER";

export type ParentStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";

export type ParentChild = {
  id: string;
  fullName: string;
  studentCode?: string | null;
  classId?: string | null;
  className?: string | null;
  section?: string | null;
  relationship: ParentRelationship;
};

export type Parent = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  mobile?: string | null;
  address?: string | null;
  gender?: string | null;
  status: string;
  childrenCount: number;
  children?: ParentChild[];
  createdAt?: string;
};

export type ParentsQuery = {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export type ParentsResponse = {
  parents: Parent[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateParentPayload = {
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string;
};

export type CreateParentResponse = {
  email: string;
  temporaryPassword: string;
  parentId: string;
  message: string;
};

export type UpdateParentPayload = Partial<CreateParentPayload> & {
  status?: string;
};

export type LinkChildItem = {
  studentUserId: string;
  relationship?: ParentRelationship;
};

export type LinkChildrenPayload = {
  children: LinkChildItem[];
};
