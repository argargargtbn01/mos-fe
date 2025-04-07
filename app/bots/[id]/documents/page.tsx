"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import MainLayout from "@/components/layout/main-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Plus } from "lucide-react"
import Link from "next/link"
import { EntityHeader } from "@/components/shared/entity-header"
import { DocumentUploader } from "@/components/document/document-uploader"
import { DocumentList } from "@/components/document/document-list"
import { DocumentViewer } from "@/components/document/document-viewer"
import { documentService } from "@/src/api/document-api"
import { botService } from "@/src/api/bot-api"
import { useToast } from "@/hooks/use-toast"
import type { Document } from "@/types/document"
import type { Bot } from "@/types/bot"

export default function BotDocumentsPage() {
  const params = useParams()
  const router = useRouter()
  const botId = Number.parseInt(params.id as string)

  const [bot, setBot] = useState<Bot | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("documents")
  const { toast } = useToast()

  useEffect(() => {
    if (botId) {
      loadData()
    }
  }, [botId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [botData, documentsData] = await Promise.all([botService.getById(botId), documentService.getByBot(botId)])
      setBot(botData)
      setDocuments(documentsData)
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (document: Document) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài liệu "${document.filename}" khỏi bot này?`)) {
      try {
        // Chỉ xóa liên kết giữa document và bot, không xóa document
        await documentService.removeFromBot(document.id, botId)
        toast({
          title: "Thành công",
          description: "Đã xóa tài liệu khỏi bot này",
        })
        loadData()
      } catch (error) {
        console.error("Lỗi khi xóa tài liệu khỏi bot:", error)
        toast({
          title: "Lỗi",
          description: "Không thể xóa tài liệu khỏi bot",
          variant: "destructive",
        })
      }
    }
  }

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setIsViewDialogOpen(true)
  }

  const handleUploadComplete = () => {
    loadData()
    setActiveTab("documents")
    toast({
      title: "Thành công",
      description: "Tài liệu đã được tải lên và gắn với bot",
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
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/bots/${botId}`}>
              <ArrowLeft size={16} className="mr-2" /> Quay lại chi tiết bot
            </Link>
          </Button>
        </div>

        <EntityHeader
          title={`Tài liệu của Bot: ${bot?.name || ""}`}
          addButtonLabel="Thêm tài liệu mới"
          onAdd={() => setActiveTab("upload")}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="documents">Tài liệu đã thêm ({documents.length})</TabsTrigger>
            <TabsTrigger value="upload">Tải lên tài liệu mới</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="mt-6">
            {documents.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Chưa có tài liệu nào</h3>
                <p className="text-gray-500 mb-4">Tải lên tài liệu để bot có thể sử dụng để trả lời câu hỏi</p>
                <Button onClick={() => setActiveTab("upload")}>
                  <Plus size={16} className="mr-2" /> Thêm tài liệu
                </Button>
              </div>
            ) : (
              <DocumentList documents={documents} onDelete={handleDeleteDocument} onView={handleViewDocument} />
            )}
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <DocumentUploader botId={botId} onUploadComplete={handleUploadComplete} />
          </TabsContent>
        </Tabs>

        <DocumentViewer document={selectedDocument} isOpen={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} />
      </div>
    </MainLayout>
  )
}

