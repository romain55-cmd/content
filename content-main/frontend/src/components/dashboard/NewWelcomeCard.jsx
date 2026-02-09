import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function NewWelcomeCard() {
  const userName = localStorage.getItem("userName") || "Пользователь";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-2">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                {greeting}
              </p>
              <CardTitle className="text-3xl font-black">
                {userName}! 👋
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Вы готовы создавать контент, который работает. Настройте профиль и начните генерировать AI-контент для вашего бренда.
              </p>
            </div>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg animate-pulse">
              <Rocket className="w-10 h-10 text-white" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={createPageUrl("Generate")}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 group">
                <Sparkles className="w-5 h-5" />
                Создать контент сразу
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to={createPageUrl("Profile")}>
              <Button size="lg" variant="outline">
                Настроить профиль
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
