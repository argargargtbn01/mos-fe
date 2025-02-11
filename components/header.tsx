import { Bell } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <Input
          type="search"
          placeholder="Search..."
          className="w-64 px-4 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="flex items-center">
        <button className="flex mx-4 text-gray-600 focus:outline-none">
          <Bell className="h-6 w-6" />
        </button>
        <div className="relative">
          <button className="relative z-10 block h-8 w-8 rounded-full overflow-hidden focus:outline-none">
            <img className="h-full w-full object-cover" src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
          </button>
        </div>
      </div>
    </header>
  )
}

