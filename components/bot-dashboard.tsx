import BotList from "./bot-list";
import Sidebar from "./sidebar";

export default function BotDashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <BotList />
      </main>
    </div>
  );
}
