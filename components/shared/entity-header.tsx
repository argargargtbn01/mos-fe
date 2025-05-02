"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface EntityHeaderProps {
  title: string
  addButtonLabel?: string
  onAdd?: () => void
}

export function EntityHeader({
  title,
  addButtonLabel,
  onAdd,
}: EntityHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {addButtonLabel && onAdd && (
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          {addButtonLabel}
        </Button>
      )}
    </div>
  )
}

