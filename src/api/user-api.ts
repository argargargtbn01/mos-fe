import { User, CreateUserDto, UpdateUserDto } from '@/types/user'
import axiosInstance from './axios-config'

export class UserService {
  private static instance: UserService
  private readonly baseUrl = '/users'

  private constructor() {}

  // Singleton: đảm bảo chỉ có 1 instance của UserService trong toàn bộ ứng dụng
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  /**
   * Lấy danh sách user
   */
  async getUsers(): Promise<User[]> {
    const response = await axiosInstance.get<User[]>(this.baseUrl)
    return response.data // Trả về trực tiếp mảng User[]
  }

  /**
   * Lấy thông tin 1 user theo ID
   */
  async getUserById(id: number): Promise<User> {
    const response = await axiosInstance.get<User>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Tạo mới user
   */
  async createUser(data: CreateUserDto): Promise<User> {
    const response = await axiosInstance.post<User>(this.baseUrl, data)
    return response.data
  }

  /**
   * Cập nhật user
   */
  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const response = await axiosInstance.patch<User>(
      `${this.baseUrl}/${id}`,
      data
    )
    return response.data
  }

  /**
   * Xoá user
   */
  async deleteUser(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }
}

// Xuất instance singleton của UserService
export const userService = UserService.getInstance()
