'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import axios from 'axios'

// Create the API instance directly instead of importing it from a separate file
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://quang1709.ddns.net:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Create a simple toast component
const useToast = () => {
  const showToast = (message: {
    title: string
    description: string
    variant?: string
  }) => {
    console.error(`${message.title}: ${message.description}`)
    // Display the toast with an alert when no toast component is available
    alert(`${message.title}: ${message.description}`)
  }

  return { toast: showToast }
}

interface DocumentQueryProps {
  botId: number
}

interface Source {
  documentId: string
  source: string
  similarity: number
  textPreview: string
}

interface RagResponse {
  answer: string
  query: string
  sources: Source[]
  timestamp: string
}

export function DocumentQuery({ botId }: DocumentQueryProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<RagResponse | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setIsLoading(true)
    try {
      const result = await api.post('/documents/query', {
        botId,
        query: query.trim(),
      })

      setResponse(result.data)
    } catch (error) {
      console.error('Error while sending question:', error)
      toast({
        title: 'Error',
        description: 'Unable to process your question. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Document Q&A</CardTitle>
          <CardDescription>
            Ask questions about the content of your documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Input
              placeholder="Enter your question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="ml-2">Send</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {response && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Answer</CardTitle>
            <CardDescription>
              Results based on data from your documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
              {response.answer}
            </div>

            {response.sources && response.sources.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Document sources:</h4>
                <div className="space-y-2">
                  {response.sources.map((source, index) => (
                    <div
                      key={index}
                      className="bg-muted/50 p-3 rounded-md text-sm"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium">{source.source}</div>
                        <Badge variant="outline">
                          {Math.round(source.similarity * 100)}%
                        </Badge>
                      </div>
                      <div className="text-muted-foreground text-xs italic">
                        {source.textPreview}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Question: "{response.query}" •{' '}
            {new Date(response.timestamp).toLocaleString()}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
