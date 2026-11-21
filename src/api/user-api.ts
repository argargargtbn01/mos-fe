import type { User } from "@/types/user"
import { BaseApiService } from "./base-api"
import axiosInstance from './axios-config'

class UserService extends BaseApiService<User> {
  constructor() {
    super('/users')
  }

  // Override the method getAll to handle the API specifically users
  async getAll(): Promise<User[]> {
    const response = await axiosInstance.get(this.endpoint)
    // Check the response structure and extract the users array from response.data.data
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data
    }
    // Fallback if the structure differs from expected
    return response.data
  }

  // Override the method create to rename fields for the backend
  async create(data: Partial<User>): Promise<User> {
    const formattedData = this.formatUserData(data)
    const response = await axiosInstance.post(this.endpoint, formattedData)
    return response.data.data || response.data
  }

  // Override the method update to rename fields for the backend
  async update(id: number, data: Partial<User>): Promise<User> {
    const formattedData = this.formatUserData(data)
    const response = await axiosInstance.put(
      `${this.endpoint}/${id}`,
      formattedData
    )
    return response.data.data || response.data
  }

  // Format user data for the backend
  private formatUserData(data: Partial<User>): any {
    const result: any = { ...data }

    // Convert department to departmentId
    if (result.department !== undefined) {
      // Keep numbers as-is and parse strings
      result.departmentId =
        typeof result.department === 'number'
          ? result.department
          : parseInt(result.department as any, 10) || null
      delete result.department
    }

    // Convert role to roleId
    if (result.role !== undefined) {
      // Keep numbers as-is and parse strings
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

