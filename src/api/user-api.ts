import type { User } from "@/types/user"
import { BaseApiService } from "./base-api"
import axiosInstance from './axios-config'

class UserService extends BaseApiService<User> {
  constructor() {
    super('/users')
  }

  // Ghi đè phương thức getAll để xử lý đặc biệt với API users
  async getAll(): Promise<User[]> {
    const response = await axiosInstance.get(this.endpoint)
    // Kiểm tra cấu trúc phản hồi và trích xuất mảng users từ response.data.data
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data
    }
    // Fallback nếu cấu trúc khác với mong đợi
    return response.data
  }

  // Ghi đè phương thức create để đổi tên trường cho phù hợp với backend
  async create(data: Partial<User>): Promise<User> {
    const formattedData = this.formatUserData(data)
    const response = await axiosInstance.post(this.endpoint, formattedData)
    return response.data.data || response.data
  }

  // Ghi đè phương thức update để đổi tên trường cho phù hợp với backend
  async update(id: number, data: Partial<User>): Promise<User> {
    const formattedData = this.formatUserData(data)
    const response = await axiosInstance.put(
      `${this.endpoint}/${id}`,
      formattedData
    )
    return response.data.data || response.data
  }

  // Hàm format lại dữ liệu user để phù hợp với BE
  private formatUserData(data: Partial<User>): any {
    const result: any = { ...data }

    // Chuyển đổi department -> departmentId
    if (result.department !== undefined) {
      // Nếu đã là số thì giữ nguyên, nếu là string thì parse
      result.departmentId =
        typeof result.department === 'number'
          ? result.department
          : parseInt(result.department as any, 10) || null
      delete result.department
    }

    // Chuyển đổi role -> roleId
    if (result.role !== undefined) {
      // Nếu đã là số thì giữ nguyên, nếu là string thì parse
      result.roleId =
        typeof result.role === 'number'
          ? result.role
          : parseInt(result.role as any, 10) || null
      delete result.role
    }

    return result
  }
}

export const userService = new UserService()

