import type { Document, DocumentChunk } from '@/types/document'
import { BaseApiService } from './base-api'

class DocumentApiService extends BaseApiService<Document> {
  constructor() {
    super('/documents')
  }

  // Document-specific methods
  async getByBot(botId: number): Promise<Document[]> {
    return this.request<Document[]>('GET', `/by-bot/${botId}`)
  }

  async uploadDocument(file: File, botId = 1): Promise<Document> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('botId', botId.toString())

    return this.request<Document>('POST', '/upload', formData)
  }

  async processDocument(documentId: string): Promise<Document> {
    return this.request<Document>('POST', `/process/${documentId}`)
  }

  async getDocumentChunks(documentId: string): Promise<DocumentChunk[]> {
    return this.request<DocumentChunk[]>('GET', `/chunks/${documentId}`)
  }

  async removeFromBot(documentId: string, botId: number): Promise<void> {
    return this.request<void>(
      'DELETE',
      `/remove-from-bot/${documentId}/bot/${botId}`
    )
  }
}

export const documentService = new DocumentApiService()
