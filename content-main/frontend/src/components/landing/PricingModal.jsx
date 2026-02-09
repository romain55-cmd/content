import React, { useEffect, useState } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Shield, Zap, ArrowRight } from "lucide-react";
import { createCheckoutSession } from "@/api/functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const FEATURES = [
  "Доступ к AI-студии контента",
  "Неограниченная генерация контента",
  "Календарь и библиотека контента",
  "Панель аналитики",
  "Приоритетные обновления и улучшения",
];

export default function PricingModal({ isOpen, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
        const user = await User.me();
        setProfile(user);
    } catch (e) {
        // Not logged in
    } finally {
        setLoading(false);
    }
  };

  const isActiveStarter = profile?.subscription_status === 'active';

  const handleCheckout = async () => {
    setSubmitting(true);
    try {
      const payment = await createCheckoutSession({ price: "1999.00", currency: "RUB" });
      if (payment?.confirmation?.confirmation_url) {
        window.location.href = payment.confirmation.confirmation_url;
      } else {
        setSubmitting(false);
        alert("Could not start checkout. Please try again.");
      }
    } catch (error) {
        setSubmitting(false);
        alert("Could not start checkout. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900/80 border-white/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Разблокируйте ваш рост</DialogTitle>
          <DialogDescription className="text-center text-white/70">
          Переходите на тариф Starter для публикации неограниченного AI-контента и управления всем рабочим процессом в одном месте.
          </DialogDescription>
        </DialogHeader>
        
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl mt-4">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">Стартовый</CardTitle>
                <div className="text-white/60 text-sm">Всё необходимое для создания, планирования и анализа</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">1999₽<span className="text-lg text-white/70">/мес</span></div>
              {isActiveStarter ? (
                <Badge className="mt-2 bg-emerald-500/30 text-emerald-200 border-emerald-400/30">Активен</Badge>
              ) : (
                <Badge className="mt-2 bg-amber-500/30 text-amber-200 border-amber-400/30">Лучшее предложение</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
            <div className="space-y-3">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center border border-emerald-400/30">
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                  </div>
                  <span className="text-white/90">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white/5 border border-white/10 p-6">
              {loading ? (
                <div className="text-white/70">Загружаем ваш тариф...</div>
              ) : isActiveStarter ? (
                <>
                  <div className="text-lg text-white">Вы на тарифе Starter</div>
                   <div className="text-sm text-white/60">Ваша подписка активна.</div>
                </>
              ) : (
                <>
                  <div className="text-white/80 text-center">Начните подписку сейчас</div>
                  <Button
                    onClick={handleCheckout}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8"
                  >
                    {submitting ? "Переход..." : (
                      <>
                        Получить Starter
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                </>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

