"use client"

import { useState, useEffect } from "react"
import MainLayout from "@/components/layout/main-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EntityHeader } from "@/components/shared/entity-header"
import { DocumentUploader } from "@/components/document/document-uploader"
import { DocumentList } from "@/components/document/document-list"
import { DocumentViewer } from "@/components/document/document-viewer"
import { documentService } from "@/src/api/document-api"
import { botService } from "@/src/api/bot-api"
import { useToast } from "@/hooks/use-toast"
import type { Document } from "@/types/document"
import type { Bot } from "@/types/bot"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [bots, setBots] = useState<Bot[]>([])
  const [selectedBotId, setSelectedBotId] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    loadBots()
  }, [])

  useEffect(() => {
    loadDocuments()
  }, [selectedBotId])

  const loadBots = async () => {
    try {
      const data = await botService.getAll()
      setBots(data)
    } catch (error) {
      console.error("Lỗi khi tải danh sách bot:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bot",
        variant: "destructive",
      })
    }
  }

  const loadDocuments = async () => {
    try {
      setLoading(true)
      let data: Document[]

      if (selectedBotId === "all") {
        data = await documentService.getAll()
      } else {
        const botId = Number.parseInt(selectedBotId)
        data = await documentService.getByBot(botId)
      }

      setDocuments(data)
    } catch (error) {
      console.error("Lỗi khi tải danh sách tài liệu:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tài liệu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (document: Document) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa tài liệu "${document.filename}"? Điều này sẽ xóa tài liệu khỏi hệ thống.`,
      )
    ) {
      try {
        await documentService.delete(document.id)
        toast({
          title: "Thành công",
          description: "Xóa tài liệu thành công",
        })
        loadDocuments()
      } catch (error) {
        console.error("Lỗi khi xóa tài liệu:", error)
        toast({
          title: "Lỗi",
          description: "Không thể xóa tài liệu",
          variant: "destructive",
        })
      }
    }
  }

  const handleRemoveFromBot = async (document: Document) => {
    if (selectedBotId === "all" || !document.botId) return

    if (window.confirm(`Bạn có chắc chắn muốn xóa tài liệu "${document.filename}" khỏi bot này?`)) {
      try {
        const botId = Number.parseInt(selectedBotId)
        await documentService.removeFromBot(document.id, botId)
        toast({
          title: "Thành công",
          description: "Đã xóa tài liệu khỏi bot này",
        })
        loadDocuments()
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
    loadDocuments()
    setActiveTab("all")
    toast({
      title: "Thành công",
      description: "Tài liệu đã được tải lên thành công",
    })
  }

  const getSelectedBotName = () => {
    if (selectedBotId === "all") return "Tất cả Bot"
    const bot = bots.find((b) => b.id.toString() === selectedBotId)
    return bot ? bot.name : "Bot không xác định"
  }

  if (loading && documents.length === 0) {
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
          onAdd={() => setActiveTab("upload")}
        />

        <div className="mb-6 mt-4">
          <label className="block text-sm font-medium mb-2">Chọn Bot</label>
          <Select value={selectedBotId} onValueChange={setSelectedBotId}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Chọn Bot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả Bot</SelectItem>
              {bots.map((bot) => (
                <SelectItem key={bot.id} value={bot.id.toString()}>
                  {bot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="all">
              Tài liệu {selectedBotId !== "all" ? `của ${getSelectedBotName()}` : ""} ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="upload">
              Tải lên tài liệu mới {selectedBotId !== "all" ? `cho ${getSelectedBotName()}` : ""}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <DocumentList
              documents={documents}
              onDelete={selectedBotId === "all" ? handleDeleteDocument : handleRemoveFromBot}
              onView={handleViewDocument}
              showBotInfo={selectedBotId === "all"}
              deleteLabel={selectedBotId === "all" ? "Xóa" : "Xóa khỏi bot"}
            />
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <DocumentUploader
              botId={selectedBotId !== "all" ? Number.parseInt(selectedBotId) : undefined}
              onUploadComplete={handleUploadComplete}
            />
          </TabsContent>
        </Tabs>

        <DocumentViewer document={selectedDocument} isOpen={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} />
      </div>
    </MainLayout>
  )
}
