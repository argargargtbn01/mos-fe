"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { documentService } from "@/src/api/document-api"
import type { Document, DocumentChunk } from "@/types/document"

interface DocumentViewerProps {
  document: Document | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentViewer({ document, isOpen, onOpenChange }: DocumentViewerProps) {
  const [chunks, setChunks] = useState<DocumentChunk[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && document) {
      loadChunks()
    }
  }, [isOpen, document])

  const loadChunks = async () => {
    if (!document) return

    try {
      setLoading(true)
      const data = await documentService.getDocumentChunks(document.id)
      setChunks(data)
    } catch (error) {
      console.error("Lỗi khi tải đoạn tài liệu:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!document) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Xem tài liệu: {document.filename}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="content" className="flex-1 overflow-hidden flex flex-col">
          <TabsList>
            <TabsTrigger value="content">Nội dung</TabsTrigger>
            <TabsTrigger value="chunks">Đoạn văn bản</TabsTrigger>
            <TabsTrigger value="metadata">Thông tin</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="flex-1 overflow-auto p-4">
            <Card>
              <CardContent className="p-4">
                <p className="whitespace-pre-wrap text-sm">{document.content}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chunks" className="flex-1 overflow-auto p-1">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p>Đang tải...</p>
              </div>
            ) : chunks.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Không có đoạn văn bản nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chunks.map((chunk) => (
                  <Card key={chunk.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">ID: {chunk.id.substring(0, 8)}...</span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm">{chunk.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="metadata" className="flex-1 overflow-auto">
            <div className="grid grid-cols-2 gap-4 p-4">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium text-xs">{document.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tên file</p>
                <p className="font-medium">{document.filename}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">S3 Key</p>
                <p className="font-medium text-xs truncate">{document.s3Key}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bot ID</p>
                <p className="font-medium">{document.botId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p className="font-medium">{document.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium">
                  {new Date(document.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày cập nhật</p>
                <p className="font-medium">
                  {new Date(document.updatedAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

