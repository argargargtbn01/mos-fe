'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Trash2, UploadCloud } from "lucide-react";
import axios from 'axios';

// Tạo instance API trực tiếp thay vì import từ file riêng
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://quang1709.ddns.net:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tạo một toast component đơn giản
const useToast = () => {
  const showToast = (message: { title: string; description: string; variant?: string }) => {
    console.error(`${message.title}: ${message.description}`);
    // Hiển thị toast bằng alert trong trường hợp không có toast component
    alert(`${message.title}: ${message.description}`);
  };

  return { toast: showToast };
};

interface DocumentListProps {
  botId: number;
}

interface Document {
  id: string;
  filename: string;
  createdAt: string;
  size?: number;
}

export function DocumentList({ botId }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/documents/bot/${botId}`);
      setDocuments(response.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tài liệu. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [botId, toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (documentId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      return;
    }

    try {
      await api.delete(`/documents/${documentId}`);
      setDocuments(documents.filter(doc => doc.id !== documentId));
      toast({
        title: "Thành công",
        description: "Đã xóa tài liệu.",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa tài liệu. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Không có thông tin';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tài liệu của bot</CardTitle>
          <CardDescription>Danh sách tài liệu đã tải lên</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tài liệu của bot</CardTitle>
        <CardDescription>Danh sách tài liệu đã tải lên</CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-6">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Chưa có tài liệu nào. Tải lên tài liệu để bắt đầu.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{doc.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(doc.createdAt)} • {formatFileSize(doc.size)}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(doc.id)}
                  title="Xóa tài liệu"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}