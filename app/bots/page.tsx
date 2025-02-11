"use client"

import MainLayout from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Lock, Pencil, Eye } from "lucide-react"

const bots = [
  { id: 10, name: "BIC hỏi đáp", department: "Default Department", created: "02-07-2024 09:32" },
  { id: 61, name: "Test_BOT_CC247_Condensed prompt", department: "Default Department", created: "23-08-2024 08:44" },
  { id: 142, name: "Test bot for ezCode", department: "Default Department", created: "26-11-2024 17:18" },
  { id: 100, name: "ezCollection - Output response", department: "Collection", created: "12-11-2024 18:06" },
  { id: 49, name: "Telss", department: "Default Department", created: "19-07-2024 18:44" },
]

export default function BotsPage() {
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Danh sách BOT</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          THÊM BOT
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead className="w-20">Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phòng ban</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="w-32">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.map((bot) => (
              <TableRow key={bot.id}>
                <TableCell>
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableCell>
                <TableCell>{bot.id}</TableCell>
                <TableCell>{bot.name}</TableCell>
                <TableCell>{bot.department}</TableCell>
                <TableCell>{bot.created}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Số hàng/trang</span>
            <select className="rounded border-gray-300 text-sm">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

