import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Heart, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function NewStatsGrid({ stats, isLoading }) {
  const statsData = [
    {
      icon: FileText,
      label: "Всего контента",
      value: stats?.totalContent || 0,
      change: "+12%",
      changeType: "positive",
      color: "text-purple-500",
      bgColor: "from-purple-500/20 to-purple-500/10"
    },
    {
      icon: Heart,
      label: "Общее вовлечение",
      value: stats?.totalEngagement || 0,
      change: "+8%",
      changeType: "positive",
      color: "text-pink-500",
      bgColor: "from-pink-500/20 to-pink-500/10"
    },
    {
      icon: TrendingUp,
      label: "Ср. вовлечение",
      value: `${stats?.avgEngagement || 0}%`,
      change: "+15%",
      changeType: "positive",
      color: "text-green-500",
      bgColor: "from-green-500/20 to-green-500/10"
    },
    {
      icon: Calendar,
      label: "На этой неделе",
      value: stats?.contentThisWeek || 0,
      change: "+5%",
      changeType: "positive",
      color: "text-blue-500",
      bgColor: "from-blue-500/20 to-blue-500/10"
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${stat.changeType === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
