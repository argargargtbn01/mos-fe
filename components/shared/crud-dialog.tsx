"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Field } from "@/types/form"

interface CrudDialogProps {
  title: string
  fields: Field[]
  trigger: React.ReactNode
  initialData?: Record<string, any>
  onSubmit: (data: Record<string, any>) => Promise<void>
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  readOnly?: boolean
}

export function CrudDialog({
  title,
  fields,
  trigger,
  initialData,
  onSubmit,
  isOpen,
  onOpenChange,
  readOnly = false,
}: CrudDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState<Record<string, any>>(initialData || {})

  // Reset form when dialog opens/closes or initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly) return

    setLoading(true)
    try {
      await onSubmit(formData)
      setOpen(false)
      if (onOpenChange) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (name: string, value: any) => {
    if (readOnly) return

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const renderField = (field: Field) => {
    switch (field.type) {
      case "select":
        return (
          <Select
            value={formData[field.name] || ""}
            onValueChange={(value) => handleFieldChange(field.name, value)}
            disabled={readOnly}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "switch":
        return (
          <Switch
            checked={formData[field.name] || false}
            onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
            disabled={readOnly}
          />
        )
      default:
        return (
          <Input
            type={field.type}
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={readOnly}
          />
        )
    }
  }

  return (
    <Dialog open={isOpen ?? open} onOpenChange={onOpenChange ?? setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  {field.label}
                </Label>
                <div className="col-span-3">{renderField(field)}</div>
              </div>
            ))}
          </div>
          <DialogFooter>
            {!readOnly && (
              <Button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Lưu"}
              </Button>
            )}
            {readOnly && (
              <Button type="button" onClick={() => onOpenChange?.(false)}>
                Đóng
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

