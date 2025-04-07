"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { documentService } from "@/src/api/document-api"

interface DocumentUploaderProps {
  botId?: number
  onUploadComplete?: (document: any) => void
}

export function DocumentUploader({ botId = 1, onUploadComplete }: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus("idle")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploading(true)
      setUploadStatus("uploading")

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

      const uploadedDocument = await documentService.uploadDocument(file, botId)

      clearInterval(progressInterval)
      setProgress(100)
      setUploadStatus("success")

      toast({
        title: "Tải lên thành công",
        description: "Tài liệu đã được tải lên và đang được xử lý",
      })

      if (onUploadComplete) {
        onUploadComplete(uploadedDocument)
      }
    } catch (error) {
      console.error("Lỗi khi tải lên tài liệu:", error)
      setUploadStatus("error")
      toast({
        title: "Lỗi",
        description: "Không thể tải lên tài liệu",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 w-full flex flex-col items-center justify-center gap-4 ${
              uploadStatus === "error" ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => document.getElementById("document-upload")?.click()}
          >
            {uploadStatus === "success" ? (
              <div className="flex flex-col items-center gap-2 text-green-600">
                <CheckCircle size={48} />
                <p className="text-lg font-medium">Tải lên thành công!</p>
              </div>
            ) : uploadStatus === "error" ? (
              <div className="flex flex-col items-center gap-2 text-red-600">
                <AlertCircle size={48} />
                <p className="text-lg font-medium">Tải lên thất bại</p>
                <p className="text-sm">Vui lòng thử lại hoặc chọn một tệp khác</p>
              </div>
            ) : (
              <>
                <Upload size={48} className="text-gray-400" />
                <div className="text-center">
                  <p className="text-lg font-medium">Kéo và thả tệp vào đây</p>
                  <p className="text-sm text-gray-500">Hoặc nhấp để chọn tệp</p>
                  <p className="text-xs text-gray-400 mt-2">Hỗ trợ PDF, DOCX, TXT (tối đa 50MB)</p>
                </div>
              </>
            )}
            <input
              type="file"
              className="hidden"
              id="document-upload"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          {file && uploadStatus !== "success" && (
            <div className="w-full">
              <div className="flex items-center gap-3 p-3 border rounded-md bg-gray-50">
                <File size={24} className="text-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              {uploadStatus === "uploading" && (
                <div className="mt-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1 text-right">{progress}%</p>
                </div>
              )}

              <Button className="w-full mt-4" onClick={handleUpload} disabled={uploading}>
                {uploading ? "Đang tải lên..." : "Tải lên"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

