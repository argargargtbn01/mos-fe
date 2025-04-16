'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/main-layout'
import { DataTable } from '@/components/shared/data-table/data-table'
import { EntityHeader } from '@/components/shared/entity-header'
import { ActionButtons } from '@/components/shared/action-buttons'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { botService } from '@/src/api/bot-api'
import { departmentService } from '@/src/api/department-api'
import { modelService } from '@/src/api/model-api'
import type { Bot, ModelInfo } from '@/types/bot'
import type { Department } from '@/types/department'
import type { Field } from '@/types/form'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BotDetailsView } from '@/components/shared/bot-details-view'

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [models, setModels] = useState<ModelInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [botsWithModelInfoData, departmentsData, modelsData] =
        await Promise.all([
          botService.getAllWithModelInfo(),
          departmentService.getAll(),
          modelService.getModels(),
        ])

      // Chuyển đổi dữ liệu từ API sang định dạng Bot[]
      const botsData = botsWithModelInfoData.map((item) => ({
        ...item.bot,
        modelInfo: item.modelInfo,
      }))

      setBots(botsData)
      setDepartments(departmentsData)
      setModels(modelsData)
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

  const handleAddBot = async (data: Record<string, any>) => {
    try {
      const departmentId = Number.parseInt(data.department)
      // Find the department name from the departments array
      const departmentName =
        departments.find((d) => d.id === departmentId)?.name ||
        'Unknown Department'

      await botService.create({
        name: data.name,
        slug: data.slug,
        description: data.description,
        prompt: data.prompt,
        modelName: data.modelName, // Changed from llmModelId to modelName
        department: { id: departmentId, name: departmentName },
      })

      toast({
        title: 'Thành công',
        description: 'Thêm bot thành công',
      })

      loadData()
      return Promise.resolve()
    } catch (error) {
      console.error('Lỗi khi thêm bot:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm bot',
        variant: 'destructive',
      })
      return Promise.reject(error)
    }
  }

  const handleEditBot = async (data: Record<string, any>) => {
    if (!selectedBot) return Promise.reject('No bot selected')

    try {
      const departmentId = Number.parseInt(data.department)
      // Find the department name from the departments array
      const departmentName =
        departments.find((d) => d.id === departmentId)?.name ||
        'Unknown Department'
      await botService.update(selectedBot.id, {
        name: data.name,
        slug: data.slug,
        description: data.description,
        prompt: data.prompt,
        modelName: data.modelName, // Changed from llmModelId to modelName
        department: { id: departmentId, name: departmentName },
      })

      toast({
        title: 'Thành công',
        description: 'Cập nhật bot thành công',
      })

      loadData()
      return Promise.resolve()
    } catch (error) {
      console.error('Lỗi khi cập nhật bot:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật bot',
        variant: 'destructive',
      })
      return Promise.reject(error)
    }
  }

  const handleDeleteBot = async (bot: Bot) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bot "${bot.name}"?`)) {
      try {
        await botService.delete(bot.id)
        toast({
          title: 'Thành công',
          description: 'Xóa bot thành công',
        })
        loadData()
      } catch (error) {
        console.error('Lỗi khi xóa bot:', error)
        toast({
          title: 'Lỗi',
          description: 'Không thể xóa bot',
          variant: 'destructive',
        })
      }
    }
  }

  const handleViewBot = async (bot: Bot) => {
    try {
      if (bot.modelName && !bot.modelInfo) {
        // Nếu bot có model nhưng chưa có thông tin chi tiết, tải thông tin model
        const botWithInfo = await botService.getWithModelInfo(bot.id)
        setSelectedBot({
          ...bot,
          modelInfo: botWithInfo.modelInfo,
        })
      } else {
        setSelectedBot(bot)
      }
      setIsViewDialogOpen(true)
    } catch (error) {
      console.error('Lỗi khi tải thông tin chi tiết bot:', error)
    }
  }

  const botFields: Field[] = [
    {
      name: 'name',
      label: 'Tên bot',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
    },
    {
      name: 'prompt',
      label: 'Prompt',
      type: 'textarea',
    },
    {
      name: 'modelName',
      label: 'Model',
      type: 'select',
      options: models.map((model) => ({
        value: model.model_name,
        label: model.model_name,
      })),
      required: true,
    },
    {
      name: 'department',
      label: 'Phòng ban',
      type: 'select',
      options: departments.map((dept) => ({
        value: dept.id.toString(),
        label: dept.name,
      })),
    },
  ]

  const columns = [
    {
      key: 'id',
      header: 'ID',
      cell: (bot: Bot) => bot.id,
      width: 'w-20',
    },
    {
      key: 'name',
      header: 'Tên bot',
      cell: (bot: Bot) => bot.name,
    },
    {
      key: 'department',
      header: 'Phòng ban',
      cell: (bot: Bot) => bot.department?.name || 'không có thông tin',
    },
    {
      key: 'model',
      header: 'Model',
      cell: (bot: Bot) => bot.modelName || 'không có thông tin',
    },
    {
      key: 'created_at',
      header: 'Ngày tạo',
      cell: (bot: Bot) => new Date(bot.created_at).toLocaleDateString('vi-VN'),
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
        <EntityHeader
          title="Danh sách BOT"
          addButtonLabel="Thêm BOT"
          onAdd={() => setIsAddDialogOpen(true)}
        />

        <DataTable
          data={bots}
          columns={columns}
          onRowSelect={(selectedItems) => console.log(selectedItems)}
          actions={(bot) => (
            <ActionButtons
              onView={() => handleViewBot(bot)}
              onEdit={() => {
                setSelectedBot(bot)
                setIsEditDialogOpen(true)
              }}
              onDelete={() => handleDeleteBot(bot)}
            />
          )}
        />

        {/* Add Bot Dialog */}
        <CrudDialog
          title="Thêm BOT mới"
          fields={botFields}
          trigger={<div />} // Hidden trigger, using state to control
          onSubmit={handleAddBot}
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />

        {/* Edit Bot Dialog */}
        {selectedBot && (
          <CrudDialog
            title={`Chỉnh sửa BOT: ${selectedBot.name}`}
            fields={botFields}
            initialData={{
              name: selectedBot.name,
              slug: selectedBot.slug,
              description: selectedBot.description || '',
              prompt: selectedBot.prompt || '',
              modelName: selectedBot.modelName || '',
              department: selectedBot.department?.id.toString() || '',
            }}
            trigger={<div />} // Hidden trigger, using state to control
            onSubmit={handleEditBot}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
        )}

        {/* View Bot Dialog with detailed info */}
        {selectedBot && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Chi tiết BOT: {selectedBot.name}</DialogTitle>
              </DialogHeader>
              <BotDetailsView bot={selectedBot} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  )
}
