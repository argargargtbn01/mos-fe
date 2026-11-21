"use client"

import { useState, useEffect } from "react"
import MainLayout from "@/components/layout/main-layout"
import { DataTable } from "@/components/shared/data-table/data-table"
import { EntityHeader } from "@/components/shared/entity-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { ActionButtons } from "@/components/shared/action-buttons"
import { CrudDialog } from "@/components/shared/crud-dialog"
import { modelService } from "@/src/api/model-api"
import type { ModelInfo } from '@/types/bot'
import type { Field } from '@/types/form'
import { useToast } from '@/hooks/use-toast'

// Adapter to transform ModelInfo to LlmModel format expected by the UI
const adaptModelInfo = (modelInfo: ModelInfo) => {
  return {
    id: modelInfo.model_info.id,
    name: modelInfo.model_name,
    provider: modelInfo.litellm_params.custom_llm_provider,
    type: modelInfo.model_info.mode,
    status: 'Active', // Default status since API doesn't provide this
    configurations: {
      temperature: 0.7, // Default value since API doesn't provide this
      maxTokens: modelInfo.model_info.max_tokens,
    },
    created_at: new Date().toISOString(), // Default value since API doesn't provide this
  }
}

type LlmModel = ReturnType<typeof adaptModelInfo>

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
      const modelInfos = await modelService.getModels()
      // Convert ModelInfo to LlmModel format expected by the UI
      const adaptedModels = modelInfos.map(adaptModelInfo)
      setModels(adaptedModels)
    } catch (error) {
      console.error('Error while loading list model:', error)
      toast({
        title: 'Error',
        description: 'Unable to load model list',
        variant: 'destructive',
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
        title: 'Success',
        description: 'Add Model successfully',
      })
      loadModels()
      return Promise.resolve()
    } catch (error) {
      console.error('Error while adding model:', error)
      toast({
        title: 'Error',
        description: 'Unable to add model',
        variant: 'destructive',
      })
      return Promise.reject(error)
    }
  }

  const handleEditModel = async (data: Record<string, any>) => {
    if (!selectedModel) return Promise.reject('No model selected')

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
        title: 'Success',
        description: 'Update model successfully',
      })
      loadModels()
      return Promise.resolve()
    } catch (error) {
      console.error('Error while updating model:', error)
      toast({
        title: 'Error',
        description: 'Unable to update model',
        variant: 'destructive',
      })
      return Promise.reject(error)
    }
  }

  const handleDeleteModel = async (model: LlmModel) => {
    if (window.confirm(`Are you sure you want to delete model "${model.name}"?`)) {
      try {
        await modelService.delete(model.id)
        toast({
          title: 'Success',
          description: 'Delete model successfully',
        })
        loadModels()
      } catch (error) {
        console.error('Error while deleting model:', error)
        toast({
          title: 'Error',
          description: 'Unable to delete model',
          variant: 'destructive',
        })
      }
    }
  }

  const handleToggleModelStatus = async (model: LlmModel) => {
    try {
      const newStatus = model.status === 'Active' ? 'Inactive' : 'Active'
      // await modelService.toggleStatus(model.id, newStatus)
      toast({
        title: 'Success',
        description: `Model has been ${
          newStatus === 'Active' ? 'activated' : 'deactivated'
        }`,
      })
      loadModels()
    } catch (error) {
      console.error('Error while updating model status:', error)
      toast({
        title: 'Error',
        description: 'Unable to update model status',
        variant: 'destructive',
      })
    }
  }

  const modelFields: Field[] = [
    {
      name: 'name',
      label: 'Model Name',
      type: 'text',
      required: true,
    },
    {
      name: 'provider',
      label: 'Provider',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      label: 'Type',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    },
    {
      name: 'temperature',
      label: 'Temperature',
      type: 'number',
    },
    {
      name: 'maxTokens',
      label: 'Max Tokens',
      type: 'number',
    },
  ]

  const columns = [
    {
      key: 'name',
      header: 'Model Name',
      cell: (model: LlmModel) => model.name,
    },
    {
      key: 'provider',
      header: 'Provider',
      cell: (model: LlmModel) => model.provider,
    },
    {
      key: 'type',
      header: 'Type',
      cell: (model: LlmModel) => model.type,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (model: LlmModel) => <StatusBadge status={model.status} />,
    },
    {
      key: 'created_at',
      header: 'Created date',
      cell: (model: LlmModel) =>
        new Date(model.created_at).toLocaleDateString('vi-VN'),
    },
  ]

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">Loading data...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-6">
        <EntityHeader
          title="LLM Model List"
        />

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
          title="Add New Model"
          fields={modelFields}
          trigger={<div />} // Hidden trigger, using state to control
          onSubmit={handleAddModel}
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />

        {/* Edit Model Dialog */}
        {selectedModel && (
          <CrudDialog
            title={`Edit Model: ${selectedModel.name}`}
            fields={modelFields}
            initialData={{
              name: selectedModel.name,
              provider: selectedModel.provider,
              type: selectedModel.type,
              status: selectedModel.status,
              temperature:
                selectedModel.configurations?.temperature?.toString() || '0.7',
              maxTokens:
                selectedModel.configurations?.maxTokens?.toString() || '2048',
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
            title={`Model Details: ${selectedModel.name}`}
            fields={modelFields}
            initialData={{
              name: selectedModel.name,
              provider: selectedModel.provider,
              type: selectedModel.type,
              status: selectedModel.status,
              temperature:
                selectedModel.configurations?.temperature?.toString() || '0.7',
              maxTokens:
                selectedModel.configurations?.maxTokens?.toString() || '2048',
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

