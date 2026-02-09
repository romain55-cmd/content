import React from "react";
import { Sparkles, Calendar, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  {
    number: "1",
    icon: Sparkles,
    title: "Генерация",
    desc: "Наша AI-студия создает конверсионный контент (посты, идеи, сценарии) за считанные минуты.",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    number: "2",
    icon: Calendar,
    title: "Планирование",
    desc: "Визуальный календарь и функция drag-and-drop делают SMM планирование простым и предсказуемым.",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    number: "3",
    icon: BarChart3,
    title: "Анализ",
    desc: "Наша аналитика контента показывает, какие темы и форматы удваивают вашу вовлеченность.",
    gradient: "from-green-500 to-emerald-500"
  },
];

export default function LeadMagnetSteps() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Автоматизация SMM в{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                3 простых шага
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connecting line (hidden on mobile) */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-current to-transparent opacity-20" />
              )}

              <div className="relative group">
                {/* Number badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-background to-muted border-2 border-primary/20 flex items-center justify-center font-bold text-2xl z-10 group-hover:scale-110 transition-transform">
                  {step.number}
                </div>

                {/* Card */}
                <div className="relative rounded-3xl bg-card border-2 border-border p-8 hover:border-primary/50 transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} mb-6 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>

                  {/* Decorative gradient overlay */}
                  <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${step.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
