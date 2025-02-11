export interface Department {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  status: string;
  department: Department;
  role: Role;
}

export interface CreateUserDto {
  username: string;
  email: string;
  departmentId: number;
  roleId: number;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  status?: string;
}
