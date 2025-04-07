import axiosInstance from '@/src/api/axios-config'
import type { AxiosResponse } from 'axios'

export class BaseApiService<T> {
  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  // Get all items
  async getAll(): Promise<T[]> {
    const response: AxiosResponse<T[]> = await axiosInstance.get(this.endpoint)
    return response.data
  }

  // Get item by ID
  async getById(id: number): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.get(
      `${this.endpoint}/${id}`
    )
    return response.data
  }

  // Create new item
  async create(data: Partial<T>): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.post(
      this.endpoint,
      data
    )
    return response.data
  }

  // Update item
  async update(id: number, data: Partial<T>): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.put(
      `${this.endpoint}/${id}`,
      data
    )
    return response.data
  }

  // Delete item
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.endpoint}/${id}`)
  }

  // Custom method for handling any request
  async request<R>(method: string, url: string, data?: any): Promise<R> {
    const response: AxiosResponse<R> = await axiosInstance({
      method,
      url: `${this.endpoint}${url}`,
      data,
    })
    return response.data
  }
}
