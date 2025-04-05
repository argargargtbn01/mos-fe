import { Department, CreateDepartmentDto, UpdateDepartmentDto } from "@/types/department";
import axiosInstance from "./axios-config";

export class DepartmentService {
  private static instance: DepartmentService;
  private readonly baseUrl = "/departments";

  private constructor() {}

  // Singleton: đảm bảo chỉ có 1 instance của DepartmentService trong toàn bộ ứng dụng
  public static getInstance(): DepartmentService {
    if (!DepartmentService.instance) {
      DepartmentService.instance = new DepartmentService();
    }
    return DepartmentService.instance;
  }

  /**
   * Lấy danh sách department
   */
  async getDepartments(): Promise<Department[]> {
    const response = await axiosInstance.get<Department[]>(this.baseUrl);
    return response.data;
  }

  /**
   * Lấy thông tin 1 department theo ID
   */
  async getDepartmentById(id: number): Promise<Department> {
    const response = await axiosInstance.get<Department>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Tạo mới department
   */
  async createDepartment(data: CreateDepartmentDto): Promise<Department> {
    const response = await axiosInstance.post<Department>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Cập nhật department
   */
  async updateDepartment(id: number, data: UpdateDepartmentDto): Promise<Department> {
    const response = await axiosInstance.patch<Department>(`${this.baseUrl}/${id}`, data);
    return response.data;  
  }

  /**
   * Xoá department
   */
  async deleteDepartment(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }
}

// Xuất instance singleton của DepartmentService
export const departmentService = DepartmentService.getInstance();
