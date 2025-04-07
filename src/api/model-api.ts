import type { LlmModel } from "@/types/model"
import { BaseApiService } from "./base-api"

class ModelService extends BaseApiService<LlmModel> {
  constructor() {
    super("/models")
  }

  // Model-specific methods
  async getActiveModels(): Promise<LlmModel[]> {
    const response = await this.request<LlmModel[]>("GET", "/active")
    return response
  }

  async toggleStatus(id: number, status: string): Promise<LlmModel> {
    return this.update(id, { status })
  }

  async updateConfigurations(id: number, configurations: any): Promise<LlmModel> {
    return this.update(id, { configurations })
  }
}

export const modelService = new ModelService()

