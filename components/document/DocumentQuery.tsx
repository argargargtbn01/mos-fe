import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from '@/lib/api';

interface DocumentQueryProps {
  botId: number;
}

interface Source {
  documentId: string;
  source: string;
  similarity: number;
  textPreview: string;
}

interface RagResponse {
  answer: string;
  query: string;
  sources: Source[];
  timestamp: string;
}

export function DocumentQuery({ botId }: DocumentQueryProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<RagResponse | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await api.post('/documents/query', {
        botId,
        query: query.trim()
      });
      
      setResponse(result.data);
    } catch (error) {
      console.error('Lỗi khi gửi câu hỏi:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xử lý câu hỏi của bạn. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Hỏi đáp tài liệu</CardTitle>
          <CardDescription>
            Đặt câu hỏi về nội dung trong tài liệu của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Input
              placeholder="Nhập câu hỏi của bạn..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="ml-2">Gửi</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {response && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Câu trả lời</CardTitle>
            <CardDescription>
              Kết quả dựa trên dữ liệu từ tài liệu của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
              {response.answer}
            </div>

            {response.sources && response.sources.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Nguồn tài liệu:</h4>
                <div className="space-y-2">
                  {response.sources.map((source, index) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-md text-sm">
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
            Câu hỏi: "{response.query}" • {new Date(response.timestamp).toLocaleString()}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}