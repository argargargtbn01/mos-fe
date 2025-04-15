"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { documentService } from "@/src/api/document-api"
import { botService } from "@/src/api/bot-api"
import type { Document } from "@/types/document"
import type { Bot } from "@/types/bot"

interface DocumentSyncDialogProps {
  document: Document | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSyncComplete?: () => void
}

export function DocumentSyncDialog({ document, isOpen, onOpenChange, onSyncComplete }: DocumentSyncDialogProps) {
  const [bots, setBots] = useState<Bot[]>([])
  const [selectedBotId, setSelectedBotId] = useState<string>("")
  const [syncing, setSyncing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [syncComplete, setSyncComplete] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      loadBots()
      setSelectedBotId(document?.botId?.toString() || "")
      setSyncComplete(false)
      setProgress(0)
    }
  }, [isOpen, document])

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

  const handleSync = async () => {
    if (!document || !selectedBotId) return

    try {
      setSyncing(true)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 300)

      await documentService.syncWithBot(document.id, Number.parseInt(selectedBotId))

      clearInterval(progressInterval)
      setProgress(100)
      setSyncComplete(true)

      toast({
        title: "Đồng bộ thành công",
        description: "Tài liệu đã được đồng bộ với bot",
      })

      if (onSyncComplete) {
        onSyncComplete()
      }
    } catch (error) {
      console.error("Lỗi khi đồng bộ tài liệu:", error)
      toast({
        title: "Lỗi",
        description: "Không thể đồng bộ tài liệu với bot",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đồng bộ tài liệu với Bot</DialogTitle>
          <DialogDescription>
            Chọn bot để đồng bộ tài liệu này. Bot sẽ sử dụng tài liệu này để trả lời câu hỏi.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {syncComplete ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <CheckCircle size={48} className="text-green-500" />
              <p className="text-center font-medium">Đồng bộ thành công!</p>
              <p className="text-center text-sm text-gray-500">Tài liệu đã được đồng bộ với bot và sẵn sàng sử dụng.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Chọn Bot</label>
                <Select value={selectedBotId} onValueChange={setSelectedBotId} disabled={syncing}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn bot" />
                  </SelectTrigger>
                  <SelectContent>
                    {bots.map((bot) => (
                      <SelectItem key={bot.id} value={bot.id.toString()}>
                        {bot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {syncing && (
                <div className="mb-4">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1 text-right">{progress}%</p>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          {syncComplete ? (
            <Button onClick={() => onOpenChange(false)}>Đóng</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={syncing}>
                Hủy
              </Button>
              <Button onClick={handleSync} disabled={!selectedBotId || syncing}>
                {syncing ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" /> Đang đồng bộ...
                  </>
                ) : (
                  "Đồng bộ"
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
