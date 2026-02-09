import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Calendar, BarChart3, Library, Zap, Shield, Brain, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  { 
    icon: Sparkles, 
    title: "AI-генерация", 
    desc: "Создавайте уникальный контент с помощью передовых AI-моделей",
    gradient: "from-purple-500 via-pink-500 to-purple-500",
    size: "large" // Takes 2 columns
  },
  { 
    icon: Calendar, 
    title: "Умное планирование", 
    desc: "Автоматический календарь публикаций",
    gradient: "from-blue-500 to-cyan-500",
    size: "small"
  },
  { 
    icon: BarChart3, 
    title: "Продвинутая аналитика", 
    desc: "Real-time метрики и инсайты",
    gradient: "from-green-500 to-emerald-500",
    size: "small"
  },
  { 
    icon: Brain, 
    title: "Обучаемый AI", 
    desc: "Система адаптируется под ваш стиль написания и автоматически улучшает контент",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    size: "medium" // Takes full width on mobile, 2 cols on desktop
  },
  { 
    icon: Library, 
    title: "Библиотека шаблонов", 
    desc: "Готовые шаблоны для всех платформ",
    gradient: "from-amber-500 to-orange-500",
    size: "small"
  },
  { 
    icon: Zap, 
    title: "Мгновенная генерация", 
    desc: "От идеи до контента за 5 секунд",
    gradient: "from-yellow-400 to-amber-500",
    size: "small"
  },
  { 
    icon: Rocket, 
    title: "Автопубликация", 
    desc: "Интеграция со всеми популярными платформами для автоматического постинга",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    size: "large"
  },
  { 
    icon: Shield, 
    title: "Безопасность", 
    desc: "Корпоративный уровень защиты данных",
    gradient: "from-cyan-500 to-blue-500",
    size: "small"
  },
];

export default function FeatureGrid() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
              Мощные инструменты.<br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Простое использование.
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Всё что нужно для создания контента мирового уровня
            </p>
          </motion.div>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[280px]">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                rotateY: 5,
                rotateX: 5,
                z: 50
              }}
              style={{ 
                perspective: 1000,
                transformStyle: "preserve-3d"
              }}
              className={`group ${
                feature.size === 'large' ? 'md:col-span-2 md:row-span-2' :
                feature.size === 'medium' ? 'md:col-span-2' :
                'md:col-span-1'
              }`}
            >
              <Card className="h-full overflow-hidden border-2 hover:border-purple-500/50 transition-all duration-500 relative hover:shadow-2xl hover:shadow-purple-500/20">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
                  <div>
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 }
                      }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className={`font-bold mb-3 ${feature.size === 'large' ? 'text-3xl' : 'text-xl'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-muted-foreground leading-relaxed ${feature.size === 'large' ? 'text-lg' : 'text-base'}`}>
                      {feature.desc}
                    </p>
                  </div>

                  {/* Interactive element for large cards */}
                  {feature.size === 'large' && (
                    <div className="mt-6 flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleY: 0.3 }}
                          whileInView={{ scaleY: Math.random() * 0.7 + 0.3 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatType: "reverse",
                            repeatDelay: 1
                          }}
                          className={`flex-1 bg-gradient-to-t ${feature.gradient} rounded-full opacity-50`}
                          style={{ transformOrigin: 'bottom' }}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { label: "Активных пользователей", value: "10,000+" },
            { label: "Контента создано", value: "500K+" },
            { label: "Сэкономленных часов", value: "1M+" },
            { label: "Средний рейтинг", value: "4.9/5" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}