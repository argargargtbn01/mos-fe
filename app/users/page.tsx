'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/main-layout'
import { DataTable } from '@/components/shared/data-table/data-table'
import { EntityHeader } from '@/components/shared/entity-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { ActionButtons } from '@/components/shared/action-buttons'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { userService } from '@/src/api/user-api'
import type { User } from '@/types/user'
import type { Field } from '@/types/form'
import { useToast } from '@/hooks/use-toast'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getAll()
      setUsers(data)
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách người dùng',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (data: Record<string, any>) => {
    try {
      // Chuyển đổi role và department từ string sang dạng số
      const formattedData = {
        ...data,
        role: data.role ? parseInt(data.role, 10): 1,
        department: data.department ? parseInt(data.department, 10): 1,
      }

      await userService.create(formattedData)
      toast({
        title: 'Thành công',
        description: 'Thêm người dùng thành công',
      })
      loadUsers()
      return Promise.resolve()
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm người dùng',
        variant: 'destructive',
      })
      return Promise.reject(error)
    }
  }

  const handleEditUser = async (data: Record<string, any>) => {
    if (!selectedUser) return Promise.reject('No user selected')

    try {
      // Chuyển đổi role và department từ string sang dạng số
      const formattedData = {
        ...data,
        role: data.role ? parseInt(data.role, 10) : null,
        department: data.department ? parseInt(data.department, 10) : null,
      }

      await userService.update(selectedUser.id, formattedData)
      toast({
        title: 'Thành công',
        description: 'Cập nhật người dùng thành công',
      })
      loadUsers()
      return Promise.resolve()
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật người dùng',
        variant: 'destructive',
      })
      return Promise.reject(error)
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.username}"?`)
    ) {
      try {
        await userService.delete(user.id)
        toast({
          title: 'Thành công',
          description: 'Xóa người dùng thành công',
        })
        loadUsers()
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error)
        toast({
          title: 'Lỗi',
          description: 'Không thể xóa người dùng',
          variant: 'destructive',
        })
      }
    }
  }

  const handleToggleUserStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active'
      await userService.update(user.id, { status: newStatus })
      toast({
        title: 'Thành công',
        description: `Người dùng đã được ${
          newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'
        }`,
      })
      loadUsers()
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái người dùng:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái người dùng',
        variant: 'destructive',
      })
    }
  }

  const userFields: Field[] = [
    {
      name: 'username',
      label: 'Tên người dùng',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'role',
      label: 'Vai trò',
      type: 'select',
      options: [
        { value: '1', label: 'Admin' },
        { value: '2', label: 'User' },
        { value: '3', label: 'Manager' },
      ],
      required: true,
    },
    {
      name: 'department',
      label: 'Phòng ban',
      type: 'select',
      options: [
        { value: '1', label: 'IT Department' },
        { value: '2', label: 'HR Department' },
        { value: '3', label: 'Sales Department' },
      ],
      required: true,
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    },
  ]

  const columns = [
    {
      key: 'username',
      header: 'Tên',
      cell: (user: User) => user.username || 'không có thông tin',
    },
    {
      key: 'email',
      header: 'Email',
      cell: (user: User) => user.email || 'không có thông tin',
    },
    {
      key: 'role',
      header: 'Vai trò',
      cell: (user: User) =>
        (user.role && user.role.name) || 'không có thông tin',
    },
    {
      key: 'department',
      header: 'Phòng ban',
      cell: (user: User) =>
        (user.department && user.department.name) || 'không có thông tin',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      cell: (user: User) => (
        <StatusBadge status={user.status || 'không có thông tin'} />
      ),
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
          title="Danh sách người dùng"
          addButtonLabel="Thêm người dùng"
          onAdd={() => setIsAddDialogOpen(true)}
        />

        <DataTable
          data={users}
          columns={columns}
          onRowSelect={(selectedItems) => console.log(selectedItems)}
          actions={(user) => (
            <ActionButtons
              onView={() => {
                setSelectedUser(user)
                setIsViewDialogOpen(true)
              }}
              onEdit={() => {
                setSelectedUser(user)
                setIsEditDialogOpen(true)
              }}
              onDelete={() => handleDeleteUser(user)}
              onLock={() => handleToggleUserStatus(user)}
              showLock={true}
            />
          )}
        />

        {/* Add User Dialog */}
        <CrudDialog
          title="Thêm người dùng mới"
          fields={userFields}
          trigger={<div />} // Hidden trigger, using state to control
          onSubmit={handleAddUser}
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />

        {/* Edit User Dialog */}
        {selectedUser && (
          <CrudDialog
            title={`Chỉnh sửa người dùng: ${selectedUser.username}`}
            fields={userFields}
            initialData={{
              username: selectedUser.username,
              email: selectedUser.email,
              role: selectedUser.role?.id.toString(),
              department: selectedUser.department?.id.toString(),
              status: selectedUser.status,
            }}
            trigger={<div />} // Hidden trigger, using state to control
            onSubmit={handleEditUser}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
        )}

        {/* View User Dialog */}
        {selectedUser && (
          <CrudDialog
            title={`Chi tiết người dùng: ${selectedUser.username}`}
            fields={userFields}
            initialData={{
              username: selectedUser.username,
              email: selectedUser.email,
              role: selectedUser.role?.id.toString(),
              department: selectedUser.department?.id.toString(),
              status: selectedUser.status,
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
