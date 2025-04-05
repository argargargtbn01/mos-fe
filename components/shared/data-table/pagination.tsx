"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaginationProps {
  currentPage: number
  totalPages: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (value: string) => void
}

export function Pagination({
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show first page
      pageNumbers.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxPagesToShow - 1)
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - maxPagesToShow + 2)
      }

      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push("ellipsis-start")
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push("ellipsis-end")
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Số hàng/trang</span>
        <Select value={rowsPerPage.toString()} onValueChange={onRowsPerPageChange}>
          <SelectTrigger className="w-16">
            <SelectValue placeholder={rowsPerPage.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <span key={`ellipsis-${index}`} className="text-sm text-gray-700">
                ...
              </span>
            )
          }

          return (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={currentPage === page ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {page}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

