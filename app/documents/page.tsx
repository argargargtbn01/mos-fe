'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/main-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EntityHeader } from '@/components/shared/entity-header'
import { DocumentUploader } from '@/components/document/document-uploader'
import { DocumentList } from '@/components/document/document-list'
import { DocumentViewer } from '@/components/document/document-viewer'
import { documentService } from '@/src/api/document-api'
import { useToast } from '@/hooks/use-toast'
import type { Document } from '@/types/document'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  )
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const { toast } = useToast()

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const data = await documentService.getAll()
      setDocuments(data)
    } catch (error) {
      console.error('Lỗi khi tải danh sách tài liệu:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách tài liệu',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (document: Document) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa tài liệu "${document.filename}"? Điều này sẽ xóa tài liệu khỏi hệ thống.`
      )
    ) {
      try {
        await documentService.delete(document.id)
        toast({
          title: 'Thành công',
          description: 'Xóa tài liệu thành công',
        })
        loadDocuments()
      } catch (error) {
        console.error('Lỗi khi xóa tài liệu:', error)
        toast({
          title: 'Lỗi',
          description: 'Không thể xóa tài liệu',
          variant: 'destructive',
        })
      }
    }
  }

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setIsViewDialogOpen(true)
  }

  const handleUploadComplete = () => {
    loadDocuments()
    setActiveTab('all')
    toast({
      title: 'Thành công',
      description: 'Tài liệu đã được tải lên thành công',
    })
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">Đang tải dữ liệu...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-6">
        <EntityHeader
          title="Quản lý tài liệu"
          addButtonLabel="Tải lên tài liệu mới"
          onAdd={() => setActiveTab('upload')}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="all">Tất cả tài liệu</TabsTrigger>
            <TabsTrigger value="upload">Tải lên tài liệu mới</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <DocumentList
              documents={documents}
              onDelete={handleDeleteDocument}
              onView={handleViewDocument}
              showBotInfo={true}
            />
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <DocumentUploader onUploadComplete={handleUploadComplete} />
          </TabsContent>
        </Tabs>

        <DocumentViewer
          document={selectedDocument}
          isOpen={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
        />
      </div>
    </MainLayout>
  )
}
