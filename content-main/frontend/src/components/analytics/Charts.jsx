import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

export default function AnalyticsCharts({ timeSeries, platformData }) {
  return (
    <>
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Создано контента (последние 2 недели)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.7)" }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.7)" }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", color: "white" }} />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 3, stroke: "#10b981" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" /> Разбивка по платформам
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.7)" }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.7)" }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", color: "white" }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}