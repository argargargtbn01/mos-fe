import type { Bot, ModelInfo } from "@/types/bot"
import { BaseApiService } from "./base-api"

interface BotWithModelInfo {
  bot: Bot
  modelInfo?: ModelInfo
}

class BotApiService extends BaseApiService<Bot> {
  constructor() {
    super("/bots")
  }
  
  // Get all bots with their model information
  async getAllWithModelInfo(): Promise<BotWithModelInfo[]> {
    return this.request<BotWithModelInfo[]>("GET", "/with-model-info")
  }

  // Get a specific bot with its model information
  async getWithModelInfo(id: number): Promise<BotWithModelInfo> {
    return this.request<BotWithModelInfo>("GET", `/${id}/with-model-info`)
  }
  
  // Bot-specific methods
  async getByDepartment(departmentId: number): Promise<Bot[]> {
    return this.request<Bot[]>("GET", `/by-department/${departmentId}`)
  }
  
  async updatePrompt(id: number, prompt: string): Promise<Bot> {
    return this.update(id, { prompt })
  }
  
  async updateCondensePrompt(id: number, condensePrompt: string): Promise<Bot> {
    return this.update(id, { condensePrompt })
  }
}
  
export const botService = new BotApiService()

