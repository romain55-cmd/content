import React from "react";
import { CheckCircle2, Wand2, Calendar, BarChart3, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    { 
      icon: Wand2, 
      number: "01",
      title: "Генерация контента", 
      desc: "Опишите вашу идею, выберите платформу и тон. AI создаст профессиональный контент за секунды.",
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: Calendar, 
      number: "02",
      title: "Планирование", 
      desc: "Организуйте контент в интуитивном календаре. Перетаскивайте, редактируйте и оптимизируйте график публикаций.",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: BarChart3, 
      number: "03",
      title: "Анализ результатов", 
      desc: "Отслеживайте метрики эффективности в реальном времени. Используйте инсайты для улучшения стратегии.",
      color: "from-green-500 to-emerald-500"
    },
  ];
  
  return (
    <section id="how" className="relative py-32 overflow-hidden">
      {/* Background with gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/50" />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--primary) / 0.1) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Три шага до <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">успеха</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Простой, но мощный процесс создания контента
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 transform -translate-x-1/2 hidden md:block" />

          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex items-center gap-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="inline-block">
                    <div className="mb-4">
                      <span className={`text-6xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="relative z-10 flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl`}
                  >
                    <step.icon className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  {/* Connecting line - only for non-last items */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                      className="hidden md:block absolute left-1/2 top-full w-0.5 h-24 bg-gradient-to-b from-current to-transparent transform -translate-x-1/2 mt-4"
                      style={{ color: `rgb(var(--${step.color.split('-')[1]}))` }}
                    >
                      <ArrowDown className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4" />
                    </motion.div>
                  )}
                </div>

                {/* Placeholder for alignment */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col items-center gap-6 mt-24 p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Готовы начать?</h3>
            <p className="text-muted-foreground">
              Кредитная карта не требуется • 5 бесплатных генераций • Полный доступ ко всем функциям
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}