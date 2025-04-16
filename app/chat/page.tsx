"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import MainLayout from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Bot, User, RefreshCw, Download } from "lucide-react"
import { botService } from '@/src/api/bot-api'
import axiosInstance from '@/src/api/axios-config'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp: Date
  sources?: {
    documentId: string
    source: string
    similarity: number
    textPreview: string
  }[]
}

interface BotOption {
  id: number
  name: string
}

export default function ChatPage() {
  const [selectedBot, setSelectedBot] = useState<string>('')
  const [bots, setBots] = useState<BotOption[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [temperature, setTemperature] = useState<number>(0.7)
  const [maxTokens, setMaxTokens] = useState<number>(2048)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Lấy danh sách bot khi trang được tải
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await botService.getAll()
        setBots(response)
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bot:', error)
        toast({
          title: 'Lỗi',
          description: 'Không thể lấy danh sách bot. Vui lòng thử lại sau.',
          variant: 'destructive',
        })
      }
    }

    fetchBots()
    // Loại bỏ dependency toast, chỉ chạy 1 lần khi component mount
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedBot) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Gọi API chat với parameter sử dụng RAG
      const response = await axiosInstance.post('/chat', {
        botId: parseInt(selectedBot),
        query: userMessage.content,
        useRAG: true,
        temperature: temperature,
        maxTokens: maxTokens,
      })

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.data.answer,
        timestamp: new Date(),
        sources: response.data.sources,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
        variant: 'destructive',
      })

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content:
          'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearConversation = () => {
    setMessages([])
  }

  const downloadConversation = () => {
    const conversationText = messages
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Bot'}: ${msg.content}`)
      .join('\n\n')

    const blob = new Blob([conversationText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-semibold text-gray-900">
            Trò chuyện với Bot
          </h1>
          <p className="text-gray-500">
            Tương tác với bot thông minh với khả năng truy vấn tài liệu (RAG)
          </p>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar with bot selection and settings */}
          <div className="w-80 border-r bg-gray-50 p-4 flex flex-col">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn Bot
              </label>
              <Select value={selectedBot} onValueChange={setSelectedBot}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn bot để trò chuyện" />
                </SelectTrigger>
                <SelectContent>
                  {bots.map((bot) => (
                    <SelectItem key={bot.id} value={bot.id.toString()}>
                      <div className="flex items-center">
                        <Bot className="w-4 h-4 mr-2 text-emerald-500" />
                        {bot.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cài đặt
              </label>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Temperature
                      </label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={temperature}
                          onChange={(e) =>
                            setTemperature(parseFloat(e.target.value))
                          }
                          className="w-full"
                        />
                        <span className="ml-2 text-sm">{temperature}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Max tokens
                      </label>
                      <Input
                        type="number"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-auto space-y-2">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                onClick={clearConversation}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới cuộc trò chuyện
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                onClick={downloadConversation}
              >
                <Download className="w-4 h-4 mr-2" />
                Tải xuống cuộc trò chuyện
              </Button>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
                    <p>Chọn một bot và bắt đầu cuộc trò chuyện</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-3xl rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.role === 'bot' ? (
                          <Bot className="w-4 h-4 mr-2" />
                        ) : (
                          <User className="w-4 h-4 mr-2" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.role === 'user'
                            ? 'Bạn'
                            : bots.find((b) => b.id.toString() === selectedBot)
                                ?.name || 'Bot'}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>

                      {/* Hiển thị sources nếu có */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-medium mb-2">
                            Nguồn tài liệu:
                          </p>
                          <div className="space-y-2">
                            {message.sources.map((source, idx) => (
                              <div
                                key={idx}
                                className="bg-white/50 p-2 rounded-md text-xs"
                              >
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    {source.source}
                                  </span>
                                  <span className="text-xs bg-amber-100 text-amber-800 px-1 rounded">
                                    {Math.round(source.similarity * 100)}%
                                  </span>
                                </div>
                                <p className="text-gray-600 text-xs mt-1 italic">
                                  {source.textPreview}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t p-4">
              <div className="flex items-end">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 resize-none"
                  rows={3}
                  disabled={!selectedBot || isLoading}
                />
                <Button
                  className="ml-2 h-10 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleSendMessage}
                  disabled={!input.trim() || !selectedBot || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Nhấn Enter để gửi, Shift+Enter để xuống dòng
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

