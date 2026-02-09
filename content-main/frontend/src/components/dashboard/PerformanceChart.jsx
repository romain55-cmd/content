import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp } from "lucide-react";

export default function PerformanceChart({ content }) {
  // Generate mock data for demo purposes
  const mockData = [
    { date: "Week 1", engagement: 120, reach: 1200 },
    { date: "Week 2", engagement: 190, reach: 1800 },
    { date: "Week 3", engagement: 280, reach: 2400 },
    { date: "Week 4", engagement: 350, reach: 3200 },
    { date: "Week 5", engagement: 420, reach: 3800 },
    { date: "Week 6", engagement: 380, reach: 3600 },
    { date: "Week 7", engagement: 480, reach: 4200 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-card backdrop-blur-xl border-border shadow-2xl">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#engagementGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#reachGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-400/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-foreground/70 text-sm">Engagement</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">+28%</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-400/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-foreground/70 text-sm">Reach</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">+42%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}