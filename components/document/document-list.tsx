'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Bot,
} from 'lucide-react'
import type { Document } from '@/types/document'

interface DocumentListProps {
  documents: Document[]
  onDelete?: (document: Document) => void
  onView?: (document: Document) => void
  showBotInfo?: boolean
}

export function DocumentList({
  documents,
  onDelete,
  onView,
  showBotInfo = false,
}: DocumentListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ready':
        return <CheckCircle size={16} className="text-green-500" />
      case 'Processing':
        return <Clock size={16} className="text-amber-500" />
      case 'Failed':
        return <AlertCircle size={16} className="text-red-500" />
      default:
        return null
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Hàm để lấy tên file từ s3Key
  const getFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase() || ''
    return extension
  }

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-2 text-gray-300" />
            <p>Chưa có tài liệu nào</p>
          </CardContent>
        </Card>
      ) : (
        documents.map((doc) => (
          <Card key={doc.id} className="overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
              onClick={() => toggleExpand(doc.id)}
            >
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-blue-500" />
                <div>
                  <h3 className="font-medium">{doc.filename}</h3>
                  <p className="text-sm text-gray-500 truncate max-w-md">
                    {doc.content.substring(0, 100)}...
                  </p>
                  {showBotInfo && (
                    <div className="flex items-center gap-1 mt-1">
                      <Bot size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Bot ID: {doc.botId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    doc.status === 'Ready'
                      ? 'success'
                      : doc.status === 'Processing'
                      ? 'outline'
                      : 'destructive'
                  }
                  className="flex items-center gap-1"
                >
                  {getStatusIcon(doc.status)}
                  {doc.status}
                </Badge>
              </div>
            </div>

            {expandedId === doc.id && (
              <CardContent className="border-t bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Loại tệp</p>
                    <p className="font-medium">{getFileType(doc.filename)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày tạo</p>
                    <p className="font-medium">{formatDate(doc.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">S3 Key</p>
                    <p className="font-medium text-xs truncate">{doc.s3Key}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bot ID</p>
                    <p className="font-medium">{doc.botId}</p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  {onView && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(doc)}
                    >
                      <FileText size={16} className="mr-1" /> Xem
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(doc)}
                    >
                      <Trash2 size={16} className="mr-1" /> Xóa
                    </Button>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  )
}
