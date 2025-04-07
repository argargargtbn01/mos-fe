'use client'
import { MessageCircle, Users, Bot, BarChart2, Settings, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  { label: "CHAT BOT", type: "header" },
  { label: "Quản trị", type: "subheader" },
  { label: "Quản lý người dùng", icon: Users, href: "/users" },
  { label: "Quản lý phòng ban", icon: FileText, href: "/departments" },
  { label: "Quản lý BOT", icon: Bot, href: "/bots" },
  { label: "Quản lý LLM Model", icon: BarChart2, href: "/models" },
  { label: "Cấu hình", type: "header" },
  { label: "Chat setting", icon: MessageCircle, href: "/chat" },
  { label: "Document setting", icon: Settings, href: "/documents" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4742-BpsmpzT5J0HSIaaPjErYU4jNknBkYT.png"
            alt="GENAI Logo"
            width={40}
            height={40}
            className="rounded"
          />
          <span className="text-emerald-600 font-bold text-xl">GENAI</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-2">
            {item.type === "header" ? (
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{item.label}</h2>
            ) : item.type === "subheader" ? (
              <h3 className="text-sm text-gray-600 mb-2">{item.label}</h3>
            ) : (
              <Link
                href={item.href || "#"}
                className={`flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-lg hover:bg-gray-100 
                  ${pathname === item.href ? "bg-emerald-50 text-emerald-600" : "text-gray-700"}`}
              >
                {item.icon && <item.icon size={18} />}
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}

