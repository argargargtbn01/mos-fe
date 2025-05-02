"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "./pagination"

interface DataTableProps<T> {
  data: T[]
  columns: {
    key: string
    header: string
    cell: (item: T) => React.ReactNode
    width?: string
  }[]
  actions?: (item: T) => React.ReactNode
  onRowSelect?: (selectedItems: T[]) => void
  itemsPerPage?: number
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  actions,
  onRowSelect,
  itemsPerPage = 10,
}: DataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage)

  // Ensure data is an array to prevent the "data.slice is not a function" error
  const safeData = Array.isArray(data) ? data : []

  const totalPages = Math.ceil(safeData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentData = safeData.slice(startIndex, endIndex)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(currentData)
    } else {
      setSelectedItems([])
    }

    if (onRowSelect) {
      onRowSelect(checked ? currentData : [])
    }
  }

  const handleSelectItem = (item: T, checked: boolean) => {
    let newSelectedItems: T[]

    if (checked) {
      newSelectedItems = [...selectedItems, item]
    } else {
      newSelectedItems = selectedItems.filter(
        (selectedItem) => selectedItem.id !== item.id
      )
    }

    setSelectedItems(newSelectedItems)

    if (onRowSelect) {
      onRowSelect(newSelectedItems)
    }
  }

  const isItemSelected = (item: T) =>
    selectedItems.some((selectedItem) => selectedItem.id === item.id)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = Number.parseInt(value, 10)
    setRowsPerPage(newRowsPerPage)
    setCurrentPage(1) // Reset to first page when changing rows per page
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {onRowSelect && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      currentData.length > 0 &&
                      selectedItems.length === currentData.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}

              {columns.map((column) => (
                <TableHead key={column.key} className={column.width}>
                  {column.header}
                </TableHead>
              ))}

              {actions && <TableHead className="w-32">Thao tác</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + (onRowSelect ? 1 : 0) + (actions ? 1 : 0)
                  }
                  className="text-center py-8 text-gray-500"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item) => (
                <TableRow key={item.id}>
                  {onRowSelect && (
                    <TableCell>
                      <Checkbox
                        checked={isItemSelected(item)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(item, checked as boolean)
                        }
                      />
                    </TableCell>
                  )}

                  {columns.map((column) => (
                    <TableCell key={`${item.id}-${column.key}`}>
                      {column.cell(item)}
                    </TableCell>
                  ))}

                  {actions && <TableCell>{actions(item)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  )
}

