import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const PROBLEMS = [
  { 
    icon: TrendingDown, 
    title: "Дорогой SMM-специалист", 
    desc: "Наем опытного менеджера стоит дорого, а результат не всегда предсказуем.",
    gradient: "from-red-500 to-rose-500"
  },
  { 
    icon: Clock, 
    title: "Медленный рост", 
    desc: "Ваши охваты и вовлеченность стагнируют, а конкуренты растут быстрее.",
    gradient: "from-orange-500 to-amber-500"
  },
  { 
    icon: AlertCircle, 
    title: "Хаос в публикациях", 
    desc: "Отсутствие системного подхода к SMM планированию приводит к нерегулярным и неэффективным публикациям.",
    gradient: "from-yellow-500 to-orange-500"
  },
];

export default function LeadMagnetProblems() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Дорогой SMM и{" "}
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                медленный рост?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ручное управление социальными сетями отнимает ресурсы, которые можно было бы вложить в развитие бизнеса.
            </p>
          </motion.div>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {PROBLEMS.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative h-full overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 group">
                <CardContent className="p-8">
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${problem.gradient} mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                    <problem.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4">{problem.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{problem.desc}</p>

                  {/* Decorative gradient */}
                  <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${problem.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
