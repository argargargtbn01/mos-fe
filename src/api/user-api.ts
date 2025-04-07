import type { User } from "@/types/user"
import { BaseApiService } from "./base-api"

class UserService extends BaseApiService<User> {
  constructor() {
    super("/users")
  }

  // // Model-specific methods
  // async getActiveModels(): Promise<LlmModel[]> {
  //   const response = await this.request<LlmModel[]>("GET", "/active")
  //   return response
  // }

  // async toggleStatus(id: number, status: string): Promise<LlmModel> {
  //   return this.update(id, { status })
  // }

  // async updateConfigurations(id: number, configurations: any): Promise<LlmModel> {
  //   return this.update(id, { configurations })
  // }
}

export const userService = new UserService()

