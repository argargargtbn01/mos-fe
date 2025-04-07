import type { Department } from "@/types/department"
import { BaseApiService } from "./base-api"

class DepartmentService extends BaseApiService<Department> {
  constructor() {
    super("/departments")
  }

  // Department-specific methods
  async toggleStatus(id: number, active: boolean): Promise<Department> {
    return this.update(id, { active })
  }

  async getDepartmentStats(): Promise<any> {
    return this.request<any>("GET", "/stats")
  }
}

export const departmentService = new DepartmentService()

