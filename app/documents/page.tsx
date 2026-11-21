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
      console.error("Error while loading list bot:", error)
      toast({
        title: "Error",
        description: "Unable to load bot list",
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
      console.error("Error while loading list document:", error)
      toast({
        title: "Error",
        description: "Unable to load document list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (document: Document) => {
    if (
      window.confirm(
        `Are you sure you want to delete document "${document.filename}"? This will remove the document from the system.`,
      )
    ) {
      try {
        await documentService.delete(document.id)
        toast({
          title: "Success",
          description: "Document deleted successfully",
        })
        loadDocuments()
      } catch (error) {
        console.error("Error while deleting document:", error)
        toast({
          title: "Error",
          description: "Unable to delete document",
          variant: "destructive",
        })
      }
    }
  }

  const handleRemoveFromBot = async (document: Document) => {
    if (selectedBotId === "all" || !document.botId) return

    if (window.confirm(`Are you sure you want to delete document "${document.filename}" from this bot?`)) {
      try {
        const botId = Number.parseInt(selectedBotId)
        await documentService.removeFromBot(document.id, botId)
        toast({
          title: "Success",
          description: "Document removed from this bot",
        })
        loadDocuments()
      } catch (error) {
        console.error("Error while deleting document from bot:", error)
        toast({
          title: "Error",
          description: "Unable to remove document from bot",
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
      title: "Success",
      description: "Document uploaded successfully",
    })
  }

  const getSelectedBotName = () => {
    if (selectedBotId === "all") return "All Bots"
    const bot = bots.find((b) => b.id.toString() === selectedBotId)
    return bot ? bot.name : "Unknown bot"
  }

  if (loading && documents.length === 0) {
    return (
      <MainLayout>
        <div className="p-6">Loading data...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-6">
        <EntityHeader
          title="Document Management"
          addButtonLabel="Upload New Document"
          onAdd={() => setActiveTab("upload")}
        />

        <div className="mb-6 mt-4">
          <label className="block text-sm font-medium mb-2">Select Bot</label>
          <Select value={selectedBotId} onValueChange={setSelectedBotId}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select Bot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bots</SelectItem>
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
              Documents {selectedBotId !== "all" ? `of ${getSelectedBotName()}` : ""} ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="upload">
              Upload New Document {selectedBotId !== "all" ? `for ${getSelectedBotName()}` : ""}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <DocumentList
              documents={documents}
              onDelete={selectedBotId === "all" ? handleDeleteDocument : handleRemoveFromBot}
              onView={handleViewDocument}
              showBotInfo={selectedBotId === "all"}
              deleteLabel={selectedBotId === "all" ? "Delete" : "Remove from bot"}
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
