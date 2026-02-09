import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Wand2, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const QUICK_ACTIONS = [
  {
    icon: Sparkles,
    title: "Создать контент",
    description: "AI-генерация контента",
    href: createPageUrl("Generate"),
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Calendar,
    title: "Календарь",
    description: "Планирование публикаций",
    href: createPageUrl("Calendar"),
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: TrendingUp,
    title: "Аналитика",
    description: "Метрики эффективности",
    href: createPageUrl("Analytics"),
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Wand2,
    title: "QA-аудит",
    description: "Полный отчёт проекта",
    href: "#",
    gradient: "from-orange-500 to-amber-500"
  },
];

export default function NewQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {QUICK_ACTIONS.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link to={action.href}>
            <Card className="group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-base mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
