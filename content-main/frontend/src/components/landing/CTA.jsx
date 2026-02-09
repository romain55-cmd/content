import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Check, Star } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CTA({ onOpenPricingModal }) {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const plans = [
    {
      name: "Старт",
      price: "Бесплатно",
      period: "",
      features: ["5 генераций", "Базовая аналитика", "Email поддержка"],
      cta: "Начать бесплатно",
      popular: false
    },
    {
      name: "Про",
      price: "4,700₽",
      period: "/месяц",
      features: ["Безлимит генераций", "Продвинутая аналитика", "Приоритетная поддержка", "API доступ"],
      cta: "Попробовать Pro",
      popular: true
    },
    {
      name: "Команда",
      price: "По запросу",
      period: "",
      features: ["Всё из Pro", "Командные функции", "Персональный менеджер", "SLA 99.9%"],
      cta: "Связаться с нами",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * 500,
          }}
          animate={{
            y: [null, Math.random() * 500],
            x: [null, Math.random() * window.innerWidth],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
          >
            <Star className="w-4 h-4 text-purple-500 fill-purple-500" />
            <span className="text-sm font-semibold text-purple-600">Прозрачные цены</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Выберите свой{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              тариф
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Начните бесплатно, обновитесь когда будете готовы
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredPlan(index)}
              onHoverEnd={() => setHoveredPlan(null)}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow-lg">
                    Популярный
                  </div>
                </div>
              )}
              
              <div className={`
                relative h-full p-8 rounded-3xl border-2 transition-all duration-500
                ${plan.popular 
                  ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl' 
                  : 'border-border bg-card/50 backdrop-blur-xl hover:border-purple-500/50'
                }
                ${hoveredPlan === index ? 'transform scale-105 shadow-2xl' : 'shadow-lg'}
              `}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-500" />
                      </div>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Link to={createPageUrl("Register")} className="block">
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Отмена в любое время</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Без скрытых платежей</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>30 дней гарантия возврата</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}