export interface Document {
  id: string
  filename: string
  s3Key: string
  content: string
  botId: number
  status: 'Processing' | 'Ready' | 'Failed'
  createdAt: Date
  updatedAt: Date
}

export interface DocumentChunk {
  id: string
  content: string
  embedding: number[]
  documentId: string
  createdAt: Date
  updatedAt: Date
}
