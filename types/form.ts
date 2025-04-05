export interface Field {
    name: string
    label: string
    type: "text" | "email" | "select" | "switch" | "number" | "password" | "textarea"
    options?: { value: string; label: string }[]
    required?: boolean
    placeholder?: string
  }
  
  