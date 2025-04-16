export interface Bot {
    id: number
    name: string
    slug: string
    description?: string
    prompt?: string
    condensePrompt?: string
    modelName?: string // Changed from llmModelId to modelName
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
    modelInfo?: ModelInfo // Added to store model info from API
  }

// New type to match the API response structure
export interface ModelInfo {
  model_name: string
  litellm_params: {
    custom_llm_provider: string
    use_in_pass_through: boolean
    merge_reasoning_content_in_choices: boolean
    model: string
  }
  model_info: {
    id: string
    db_model: boolean
    key: string
    max_tokens: number
    max_input_tokens: number
    max_output_tokens: number
    input_cost_per_token: number
    litellm_provider: string
    mode: string
    supports_system_messages: boolean
    supports_vision: boolean
    supports_function_calling: boolean
    rpm: number
    tpm: number
    supported_openai_params: string[]
    [key: string]: any // For other properties that may be present
  }
}

