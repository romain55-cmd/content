import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Sparkles, 
  Calendar, 
  BarChart3, 
  Settings, 
  Zap,
  ArrowRight,
  ClipboardList
} from "lucide-react";

const quickActions = [
  {
    title: "Создать контент",
    description: "AI-генерация контента",
    icon: Sparkles,
    href: "Generate",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Календарь",
    description: "Планирование публикаций",
    icon: Calendar,
    href: "Calendar",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Аналитика",
    description: "Метрики эффективности",
    icon: BarChart3,
    href: "Analytics",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    title: "Настройки",
    description: "Профиль и голос бренда",
    icon: Settings,
    href: "Profile",
    gradient: "from-orange-500 to-red-500"
  },
  {
    title: "QA-аудит",
    description: "Полный отчёт проекта",
    icon: ClipboardList,
    href: "Agents?agent=qa_tester&qa=true",
    gradient: "from-indigo-500 to-purple-500"
  }
];

export default function QuickActions({ userProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Zap className="w-6 h-6 text-primary" />
            Быстрые действия
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Link to={createPageUrl(action.href)}>
                <div className="group p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-base mb-1">{action.title}</h4>
                        <p className="text-muted-foreground text-sm">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}