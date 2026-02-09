import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gift, Sparkles, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LeadMagnetCTA() {
  const navigate = useNavigate();

  const handleGetPromoCode = () => {
    navigate('/register');
  };

  const benefits = [
    "Полный доступ к AI-генерации",
    "Календарь публикаций",
    "Продвинутая аналитика",
    "Приоритетная поддержка"
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-amber-500/30 rounded-full"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
            y: Math.random() * 500,
          }}
          animate={{
            y: [null, Math.random() * 500],
            x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8"
          >
            <Gift className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-amber-600">Последний шаг</span>
          </motion.div>

          {/* Main heading */}
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Начните развитие{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              прямо сейчас
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Получите ваш персональный промокод и сделайте первый шаг к автоматизации SMM и росту вашего бизнеса.
          </p>

          {/* Benefits grid */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={handleGetPromoCode}
              className="text-lg px-10 h-16 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 group shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] transition-all duration-300"
            >
              <Sparkles className="w-6 h-6" />
              Получить промокод на скидку 30%
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Trust text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            Кредитная карта не требуется. Безопасный вход через Google.
          </motion.p>

          {/* Decorative card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 inline-block"
          >
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 backdrop-blur-xl border border-amber-500/10 p-6">
              <div className="flex items-center justify-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Обычная цена</p>
                  <p className="text-2xl font-bold line-through text-muted-foreground">4,700₽</p>
                </div>
                <ArrowRight className="w-6 h-6 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Со скидкой</p>
                  <p className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    3,290₽
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
