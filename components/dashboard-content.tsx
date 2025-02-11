import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, DollarSign, ShoppingCart } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$53,000",
    icon: DollarSign,
    change: "+55%",
    color: "text-green-500",
  },
  {
    title: "Subscribers",
    value: "2,300",
    icon: Users,
    change: "+5%",
    color: "text-blue-500",
  },
  {
    title: "Purchases",
    value: "3,100",
    icon: ShoppingCart,
    change: "+12%",
    color: "text-yellow-500",
  },
  {
    title: "Active Now",
    value: "1,200",
    icon: BarChart,
    change: "-2%",
    color: "text-red-500",
  },
];

export default function DashboardContent() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.color}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Add more dashboard content here */}
    </div>
  );
}
