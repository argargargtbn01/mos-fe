"use client"

import { Button } from "@/components/ui/button"
import { Lock, Pencil, Eye, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ActionButtonsProps {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onLock?: () => void
  showLock?: boolean
}

export function ActionButtons({ onView, onEdit, onDelete, onLock, showLock = false }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {showLock && onLock && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onLock}>
                <Lock className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Khóa/Mở khóa</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {onEdit && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Pencil className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chỉnh sửa</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {onView && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onView}>
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Xem chi tiết</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {onDelete && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Xóa</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

