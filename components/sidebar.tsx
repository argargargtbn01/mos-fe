import {
  MessageCircle,
  Users,
  Bot,
  BarChart2,
  Settings,
  FileText,
  PenToolIcon as Tool,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

const menuItems = [
  { label: "CHAT BOT", type: "header" },
  { label: "Quản trị", type: "subheader" },
  { label: "Quản lý người dùng", icon: Users },
  { label: "Quản lý phòng ban", icon: FileText },
  {
    label: "Quản lý BOT",
    icon: Bot,
    expanded: true,
    subItems: [
      "Danh sách BOT",
      "Danh sách BOT Channel",
      "Danh sách BOT Token",
      "Danh sách Data Source",
    ],
  },
  { label: "Quản lý LLM Model", icon: BarChart2 },
  { label: "Quản lý báo cáo", icon: FileText },
  { label: "Tools", icon: Tool },
  { label: "Cấu hình", type: "header" },
  { label: "Chat setting", icon: MessageCircle },
  { label: "Document setting", icon: Settings },
  { label: "Test Bot", icon: Bot },
  { label: "Test Bot Batch", icon: MessageSquare },
  { label: "Lịch sử chat", icon: MessageCircle },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4742-BpsmpzT5J0HSIaaPjErYU4jNknBkYT.png"
            alt="GENAI Logo"
            width={40}
            height={40}
            className="rounded"
          />
          <span className="text-emerald-600 font-bold text-xl">GENAI</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-2">
            {item.type === "header" ? (
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {item.label}
              </h2>
            ) : item.type === "subheader" ? (
              <h3 className="text-sm text-gray-600 mb-2">{item.label}</h3>
            ) : (
              <div className="space-y-1">
                <button
                  className={`flex items-center gap-2 w-full px-2 py-1.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 ${
                    item.expanded ? "bg-gray-100" : ""
                  }`}
                >
                  {item.icon && <item.icon size={18} />}
                  <span>{item.label}</span>
                </button>
                {item.expanded && item.subItems && (
                  <div className="ml-6 space-y-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        className={`w-full px-2 py-1.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 ${
                          subIndex === 0 ? "bg-emerald-50 text-emerald-600" : ""
                        }`}
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
