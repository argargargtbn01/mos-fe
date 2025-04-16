import type { ModelInfo } from "@/types/bot"
import { BaseApiService } from "./base-api"

interface ModelResponse {
  data: ModelInfo[]
}

class ModelService extends BaseApiService<any> {
  constructor() {
    super("/models")
  }

  // Get all models from the API endpoint
  async getModels(): Promise<ModelInfo[]> {
    const response = await this.request<ModelResponse>("GET", "")
    return response.data
  }

  // Get model by name
  async getModelByName(name: string): Promise<ModelInfo | undefined> {
    const models = await this.getModels()
    return models.find(model => model.model_name === name)
  }
}

export const modelService = new ModelService()

