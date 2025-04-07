"use client"

import { useState, useEffect } from "react"
import MainLayout from "@/components/layout/main-layout"
import { DataTable } from "@/components/shared/data-table/data-table"
import { EntityHeader } from "@/components/shared/entity-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { ActionButtons } from "@/components/shared/action-buttons"
import { CrudDialog } from "@/components/shared/crud-dialog"
import { modelService } from "@/src/api/model-api"
import type { LlmModel } from "@/types/model"
import type { Field } from "@/types/form"
import { useToast } from "@/hooks/use-toast"

export default function ModelsPage() {
  const [models, setModels] = useState<LlmModel[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState<LlmModel | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      setLoading(true)
      const data = await modelService.getAll()
      setModels(data)
    } catch (error) {
      console.error("Lỗi khi tải danh sách model:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách model",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddModel = async (data: Record<string, any>) => {
    try {
      await modelService.create({
        name: data.name,
        provider: data.provider,
        type: data.type,
        status: data.status,
        configurations: {
          temperature: Number.parseFloat(data.temperature) || 0.7,
          maxTokens: Number.parseInt(data.maxTokens) || 2048,
        },
      })
      toast({
        title: "Thành công",
        description: "Thêm model thành công",
      })
      loadModels()
      return Promise.resolve()
    } catch (error) {
      console.error("Lỗi khi thêm model:", error)
      toast({
        title: "Lỗi",
        description: "Không thể thêm model",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  const handleEditModel = async (data: Record<string, any>) => {
    if (!selectedModel) return Promise.reject("No model selected")

    try {
      await modelService.update(selectedModel.id, {
        name: data.name,
        provider: data.provider,
        type: data.type,
        status: data.status,
        configurations: {
          ...selectedModel.configurations,
          temperature: Number.parseFloat(data.temperature) || 0.7,
          maxTokens: Number.parseInt(data.maxTokens) || 2048,
        },
      })
      toast({
        title: "Thành công",
        description: "Cập nhật model thành công",
      })
      loadModels()
      return Promise.resolve()
    } catch (error) {
      console.error("Lỗi khi cập nhật model:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật model",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  const handleDeleteModel = async (model: LlmModel) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa model "${model.name}"?`)) {
      try {
        await modelService.delete(model.id)
        toast({
          title: "Thành công",
          description: "Xóa model thành công",
        })
        loadModels()
      } catch (error) {
        console.error("Lỗi khi xóa model:", error)
        toast({
          title: "Lỗi",
          description: "Không thể xóa model",
          variant: "destructive",
        })
      }
    }
  }

  const handleToggleModelStatus = async (model: LlmModel) => {
    try {
      const newStatus = model.status === "Active" ? "Inactive" : "Active"
      await modelService.toggleStatus(model.id, newStatus)
      toast({
        title: "Thành công",
        description: `Model đã được ${newStatus === "Active" ? "kích hoạt" : "vô hiệu hóa"}`,
      })
      loadModels()
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái model:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái model",
        variant: "destructive",
      })
    }
  }

  const modelFields: Field[] = [
    {
      name: "name",
      label: "Tên Model",
      type: "text",
      required: true,
    },
    {
      name: "provider",
      label: "Nhà cung cấp",
      type: "text",
      required: true,
    },
    {
      name: "type",
      label: "Loại",
      type: "text",
      required: true,
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "select",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
    {
      name: "temperature",
      label: "Temperature",
      type: "number",
    },
    {
      name: "maxTokens",
      label: "Max Tokens",
      type: "number",
    },
  ]

  const columns = [
    {
      key: "name",
      header: "Tên Model",
      cell: (model: LlmModel) => model.name,
    },
    {
      key: "provider",
      header: "Nhà cung cấp",
      cell: (model: LlmModel) => model.provider,
    },
    {
      key: "type",
      header: "Loại",
      cell: (model: LlmModel) => model.type,
    },
    {
      key: "status",
      header: "Trạng thái",
      cell: (model: LlmModel) => <StatusBadge status={model.status} />,
    },
    {
      key: "created_at",
      header: "Ngày tạo",
      cell: (model: LlmModel) => new Date(model.created_at).toLocaleDateString("vi-VN"),
    },
  ]

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">Đang tải dữ liệu...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-6">
        <EntityHeader title="Danh sách LLM Model" addButtonLabel="Thêm Model" onAdd={() => setIsAddDialogOpen(true)} />

        <DataTable
          data={models}
          columns={columns}
          onRowSelect={(selectedItems) => console.log(selectedItems)}
          actions={(model) => (
            <ActionButtons
              onView={() => {
                setSelectedModel(model)
                setIsViewDialogOpen(true)
              }}
              onEdit={() => {
                setSelectedModel(model)
                setIsEditDialogOpen(true)
              }}
              onDelete={() => handleDeleteModel(model)}
              onLock={() => handleToggleModelStatus(model)}
              showLock={true}
            />
          )}
        />

        {/* Add Model Dialog */}
        <CrudDialog
          title="Thêm Model mới"
          fields={modelFields}
          trigger={<div />} // Hidden trigger, using state to control
          onSubmit={handleAddModel}
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />

        {/* Edit Model Dialog */}
        {selectedModel && (
          <CrudDialog
            title={`Chỉnh sửa Model: ${selectedModel.name}`}
            fields={modelFields}
            initialData={{
              name: selectedModel.name,
              provider: selectedModel.provider,
              type: selectedModel.type,
              status: selectedModel.status,
              temperature: selectedModel.configurations?.temperature?.toString() || "0.7",
              maxTokens: selectedModel.configurations?.maxTokens?.toString() || "2048",
            }}
            trigger={<div />} // Hidden trigger, using state to control
            onSubmit={handleEditModel}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
        )}

        {/* View Model Dialog */}
        {selectedModel && (
          <CrudDialog
            title={`Chi tiết Model: ${selectedModel.name}`}
            fields={modelFields}
            initialData={{
              name: selectedModel.name,
              provider: selectedModel.provider,
              type: selectedModel.type,
              status: selectedModel.status,
              temperature: selectedModel.configurations?.temperature?.toString() || "0.7",
              maxTokens: selectedModel.configurations?.maxTokens?.toString() || "2048",
            }}
            trigger={<div />} // Hidden trigger, using state to control
            onSubmit={() => Promise.resolve()} // No-op for view mode
            isOpen={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            readOnly={true}
          />
        )}
      </div>
    </MainLayout>
  )
}

