
import React, { useEffect, useState } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import apiClient from "@/api/apiClient";

export default function PaymentSuccess() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const me = await User.me();
      setProfile(me);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-card backdrop-blur-xl border-border shadow-2xl">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-300" />
            </div>
            <CardTitle className="text-foreground text-3xl">Все готово!</CardTitle>
            <p className="text-foreground/70">
              Благодарим за подписку на Impulse AI. Ваш план активирован, и вы можете начать создавать, планировать и анализировать контент.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-accent/50 border border-border p-4">
              <div className="text-foreground/80 text-sm">
                Статус:{" "}
                {loading ? (
                  "Проверка..."
                ) : profile?.subscription_status === 'active' ? (
                  <span className="text-emerald-300 font-medium">Подтвержден</span>
                ) : (
                  <span className="text-foreground/60">В ожидании</span>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <Link to={createPageUrl("Dashboard")} className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Home className="w-4 h-4 mr-2" /> Панель управления
                </Button>
              </Link>
            </div>

            <div className="text-xs text-foreground/60 text-center">
              Совет: Вы можете в любое время вернуться к тарифам, чтобы управлять своим планом.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
