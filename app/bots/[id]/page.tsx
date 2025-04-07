'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, FileText, Settings } from 'lucide-react'
import Link from 'next/link'
import { botService } from '@/src/api/bot-api'
import { documentService } from '@/src/api/document-api'
import { useToast } from '@/hooks/use-toast'
import type { Bot } from '@/types/bot'
import type { Document } from '@/types/document'

export default function BotDetailPage() {
  const params = useParams()
  const router = useRouter()
  const botId = Number.parseInt(params.id as string)

  const [bot, setBot] = useState<Bot | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (botId) {
      loadData()
    }
  }, [botId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [botData, documentsData] = await Promise.all([
        botService.getById(botId),
        documentService.getByBot(botId),
      ])
      setBot(botData)
      setDocuments(documentsData)
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">Đang tải dữ liệu...</div>
      </MainLayout>
    )
  }

  if (!bot) {
    return (
      <MainLayout>
        <div className="p-6">
          <p>Không tìm thấy bot</p>
          <Button variant="outline" size="sm" asChild className="mt-4">
            <Link href="/bots">Quay lại danh sách bot</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/bots">
              <ArrowLeft size={16} className="mr-2" /> Quay lại danh sách bot
            </Link>
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{bot.name}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/bots/${botId}/documents`}>
                <FileText size={16} className="mr-2" /> Quản lý tài liệu
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Settings size={16} className="mr-2" /> Cài đặt
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Phòng ban
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">
                {bot.department?.name || 'Không có'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Tài liệu
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <p className="text-lg font-medium">{documents.length}</p>
              <Link
                href={`/bots/${botId}/documents`}
                className="text-xs text-blue-500 hover:underline"
              >
                Quản lý
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Ngày tạo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">
                {new Date(bot.created_at).toLocaleDateString('vi-VN')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList>
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Tên Bot
                    </h3>
                    <p className="font-medium">{bot.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Slug
                    </h3>
                    <p className="font-medium">{bot.slug}</p>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Mô tả
                    </h3>
                    <p className="font-medium">
                      {bot.description || 'Không có mô tả'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prompt" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Prompt
                </h3>
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                  {bot.prompt || 'Không có prompt'}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Tài liệu đã thêm ({documents.length})
              </h3>
              <Button size="sm" asChild>
                <Link href={`/bots/${botId}/documents`}>
                  <FileText size={16} className="mr-2" /> Quản lý tài liệu
                </Link>
              </Button>
            </div>

            {documents.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText size={48} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">
                    Chưa có tài liệu nào được thêm vào bot này
                  </p>
                  <Button size="sm" className="mt-4" asChild>
                    <Link href={`/bots/${botId}/documents?tab=upload`}>
                      Tải lên tài liệu
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.slice(0, 4).map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <FileText size={24} className="text-blue-500 mt-1" />
                        <div>
                          <h4 className="font-medium">{doc.filename}</h4>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {doc.content.substring(0, 100)}...
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {doc.filename.split('.').pop()?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {documents.length > 4 && (
                  <Card className="flex items-center justify-center">
                    <CardContent className="p-4 text-center">
                      <Link
                        href={`/bots/${botId}/documents`}
                        className="text-blue-500 hover:underline"
                      >
                        Xem tất cả {documents.length} tài liệu
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
