"use client"

import { useState, useEffect } from "react"
import MainLayout from "@/components/layout/main-layout"
import { DataTable } from "@/components/shared/data-table/data-table"
import { EntityHeader } from "@/components/shared/entity-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { ActionButtons } from "@/components/shared/action-buttons"
import { CrudDialog } from "@/components/shared/crud-dialog"
import { departmentService } from "@/src/api/department-api"
import type { Department } from "@/types/department"
import type { Field } from "@/types/form"
import { useToast } from "@/hooks/use-toast"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadDepartments()
  }, [])

  const loadDepartments = async () => {
    try {
      setLoading(true)
      const data = await departmentService.getAll()
      setDepartments(data)
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng ban:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách phòng ban",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddDepartment = async (data: Record<string, any>) => {
    try {
      await departmentService.create({
        name: data.name,
        code: data.code,
        active: data.active === "true",
      })
      toast({
        title: "Thành công",
        description: "Thêm phòng ban thành công",
      })
      loadDepartments()
      return Promise.resolve()
    } catch (error) {
      console.error("Lỗi khi thêm phòng ban:", error)
      toast({
        title: "Lỗi",
        description: "Không thể thêm phòng ban",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  const handleEditDepartment = async (data: Record<string, any>) => {
    if (!selectedDepartment) return Promise.reject("No department selected")

    try {
      await departmentService.update(selectedDepartment.id, {
        name: data.name,
        code: data.code,
        active: data.active === "true",
      })
      toast({
        title: "Thành công",
        description: "Cập nhật phòng ban thành công",
      })
      loadDepartments()
      return Promise.resolve()
    } catch (error) {
      console.error("Lỗi khi cập nhật phòng ban:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật phòng ban",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  const handleDeleteDepartment = async (department: Department) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phòng ban "${department.name}"?`)) {
      try {
        await departmentService.delete(department.id)
        toast({
          title: "Thành công",
          description: "Xóa phòng ban thành công",
        })
        loadDepartments()
      } catch (error) {
        console.error("Lỗi khi xóa phòng ban:", error)
        toast({
          title: "Lỗi",
          description: "Không thể xóa phòng ban",
          variant: "destructive",
        })
      }
    }
  }

  const handleToggleDepartmentStatus = async (department: Department) => {
    try {
      await departmentService.toggleStatus(department.id, !department.active)
      toast({
        title: "Thành công",
        description: `Phòng ban đã được ${department.active ? "vô hiệu hóa" : "kích hoạt"}`,
      })
      loadDepartments()
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái phòng ban:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái phòng ban",
        variant: "destructive",
      })
    }
  }

  const departmentFields: Field[] = [
    {
      name: "name",
      label: "Tên phòng ban",
      type: "text",
      required: true,
    },
    {
      name: "code",
      label: "Mã phòng ban",
      type: "text",
      required: true,
    },
    {
      name: "active",
      label: "Trạng thái",
      type: "select",
      options: [
        { value: "true", label: "Hoạt động" },
        { value: "false", label: "Không hoạt động" },
      ],
    },
  ]

  const columns = [
    {
      key: "name",
      header: "Tên phòng ban",
      cell: (department: Department) => department.name,
    },
    {
      key: "code",
      header: "Mã phòng ban",
      cell: (department: Department) => department.code,
    },
    {
      key: "status",
      header: "Trạng thái",
      cell: (department: Department) => <StatusBadge status={department.active ? "Active" : "Inactive"} />,
    },
    {
      key: "created_at",
      header: "Ngày tạo",
      cell: (department: Department) => new Date(department.created_at).toLocaleDateString("vi-VN"),
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
          title="Danh sách phòng ban"
          addButtonLabel="Thêm phòng ban"
          onAdd={() => setIsAddDialogOpen(true)}
        />

        <DataTable
          data={departments}
          columns={columns}
          onRowSelect={(selectedItems) => console.log(selectedItems)}
          actions={(department) => (
            <ActionButtons
              onView={() => {
                setSelectedDepartment(department)
                setIsViewDialogOpen(true)
              }}
              onEdit={() => {
                setSelectedDepartment(department)
                setIsEditDialogOpen(true)
              }}
              onDelete={() => handleDeleteDepartment(department)}
              onLock={() => handleToggleDepartmentStatus(department)}
              showLock={true}
            />
          )}
        />

        {/* Add Department Dialog */}
        <CrudDialog
          title="Thêm phòng ban mới"
          fields={departmentFields}
          trigger={<div />} // Hidden trigger, using state to control
          onSubmit={handleAddDepartment}
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />

        {/* Edit Department Dialog */}
        {selectedDepartment && (
          <CrudDialog
            title={`Chỉnh sửa phòng ban: ${selectedDepartment.name}`}
            fields={departmentFields}
            initialData={{
              name: selectedDepartment.name,
              code: selectedDepartment.code,
              active: selectedDepartment.active.toString(),
            }}
            trigger={<div />} // Hidden trigger, using state to control
            onSubmit={handleEditDepartment}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
        )}

        {/* View Department Dialog */}
        {selectedDepartment && (
          <CrudDialog
            title={`Chi tiết phòng ban: ${selectedDepartment.name}`}
            fields={departmentFields}
            initialData={{
              name: selectedDepartment.name,
              code: selectedDepartment.code,
              active: selectedDepartment.active.toString(),
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

