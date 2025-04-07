export interface Bot {
    id: number
    name: string
    slug: string
    description?: string
    prompt?: string
    condensePrompt?: string
    llmModelId?: string
    configurations?: any
    condenseConfigurations?: any
    dataSourceIds?: any
    needAssignPrompt?: string
    agentAssignMessage?: string
    noAgentAvailableMessage?: string
    systemTimeoutServiceMessage?: string
    ratingMessage?: string
    afterHourMessage?: string
    department?: {
      id: number
      name: string
    }
    created_at: Date
    updated_at: Date
  }
  
  