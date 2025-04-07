import type { Bot } from "@/types/bot"
import { BaseApiService } from "./base-api"

class BotApiService extends BaseApiService<Bot> {
    constructor() {
      super("/bots")
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

