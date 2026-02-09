import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  TrendingUp, 
  Heart, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function StatsGrid({ stats, isLoading }) {
  if (isLoading || !stats) {
    // Modern skeleton loader
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
             <CardContent className="p-8">
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-10 w-10 bg-muted rounded-xl"></div>
                  </div>
                  <div className="h-10 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Всего контента",
      value: stats.totalContent,
      icon: FileText,
      change: "+12%",
      trend: "up",
      color: "text-purple-500"
    },
    {
      title: "Общее вовлечение",
      value: stats.totalEngagement.toLocaleString(),
      icon: Heart,
      change: "+8%",
      trend: "up",
      color: "text-pink-500"
    },
    {
      title: "Ср. вовлечение",
      value: Math.round(stats.avgEngagement),
      icon: TrendingUp,
      change: "+15%",
      trend: "up",
      color: "text-green-500"
    },
    {
      title: "На этой неделе",
      value: stats.contentThisWeek,
      icon: Calendar,
      change: "+5%",
      trend: "up",
      color: "text-blue-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="group hover:border-primary/50 transition-all duration-300 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                  stat.color === "text-purple-500" ? "from-purple-500/10 to-purple-500/5" :
                  stat.color === "text-pink-500" ? "from-pink-500/10 to-pink-500/5" :
                  stat.color === "text-green-500" ? "from-green-500/10 to-green-500/5" :
                  "from-blue-500/10 to-blue-500/5"
                } flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                <div className="flex items-center gap-2">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground">в этом месяце</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}