import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, Edit2, CheckCircle, Clock } from "lucide-react";
import { getUserContentApi } from "@/api/content";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const statusTranslations = {
  draft: "Черновик",
  published: "Опубликован",
  scheduled: "Запланирован",
  archived: "В архиве",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-card backdrop-blur-sm border border-border rounded-lg">
        <p className="label font-bold text-foreground">{`${label}`}</p>
        <p className="intro text-muted-foreground">{`Количество: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const userContent = await getUserContentApi();
        setContent(userContent || []);
      } catch (error) {
        console.error("Failed to fetch analytics content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const { chartData, statusData, totalContent, draftCount, publishedCount } = useMemo(() => {
    const platformCounts = content.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + 1;
      return acc;
    }, {});
    
    const statusCounts = content.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    return {
      chartData: Object.keys(platformCounts).map(platform => ({ name: platform, count: platformCounts[platform] })),
      statusData: Object.keys(statusCounts).map(status => ({ name: statusTranslations[status] || status, value: statusCounts[status] })),
      totalContent: content.length,
      draftCount: statusCounts.draft || 0,
      publishedCount: statusCounts.published || 0,
    };
  }, [content]);

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Аналитика</h1>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего постов</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Опубликовано</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">В черновиках</CardTitle>
              <Edit2 className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftCount}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Контент по платформам</CardTitle>
            </CardHeader>
            <CardContent style={{ height: '400px' }}>
              {isLoading ? (<p className="text-muted-foreground text-center">Загрузка...</p>) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Контент по статусам</CardTitle>
            </CardHeader>
            <CardContent style={{ height: '400px' }}>
              {isLoading ? (<p className="text-muted-foreground text-center">Загрузка...</p>) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


