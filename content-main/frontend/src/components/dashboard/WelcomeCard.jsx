import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

export default function WelcomeCard({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-10 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                  <Zap className="w-4 h-4" />
                  <span>Добро пожаловать</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold mb-3">
                  Привет, {user?.full_name?.split(' ')[0]}! 👋
                </h2>
                
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Вы готовы создавать контент, который работает. 
                  Настройте профиль и начните генерировать AI-контент для вашего бренда.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl("Profile")}>
                  <Button size="lg" className="group">
                    <Sparkles className="w-5 h-5" />
                    Настроить профиль
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to={createPageUrl("Generate")}>
                  <Button variant="outline" size="lg">
                    Создать контент сразу
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/25 rotate-3 hover:rotate-0 transition-transform duration-300">
                <Sparkles className="w-20 h-20 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}