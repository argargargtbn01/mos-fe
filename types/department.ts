export interface Department {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  active?: boolean;
}

export interface UpdateDepartmentDto {
  name?: string;
  code?: string;
  active?: boolean;
}
