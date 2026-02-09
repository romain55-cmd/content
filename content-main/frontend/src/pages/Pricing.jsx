import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from 'react-helmet-async';
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Crown, Zap, ArrowRight, Loader2 } from "lucide-react";
import { createCheckoutSession, getProducts } from "@/api/functions";
import { applyPromoCodeApi } from "@/api/promocodes";

const FEATURES = [
  "Доступ к AI-студии контента",
  "Неограниченная генерация контента",
  "Календарь и библиотека контента",
  "Панель аналитики",
  "Приоритетные обновления и улучшения",
];

export default function Pricing() {
  const [profile, setProfile] = useState(null);
  const [starterProduct, setStarterProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userPromise = User.me();
        const productsPromise = getProducts();
        
        const [user, products] = await Promise.all([userPromise, productsPromise]);

        setProfile(user);

        const starter = products.find(p => p.name === 'Starter');
        if (starter) {
          setStarterProduct(starter);
        } else {
          throw new Error("Тариф 'Starter' не найден.");
        }
      } catch (err) {
        console.error("Failed to load pricing data:", err);
        setError("Не удалось загрузить информацию о тарифах. Попробуйте обновить страницу.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const originalPrice = useMemo(() => starterProduct?.price, [starterProduct]);

  const isActiveStarter = profile?.productId === starterProduct?.id && profile?.subscription_status === 'active';

  const handleCheckout = async () => {
    if (!starterProduct) return;
    setSubmitting(true);
    try {
      const priceToUse = discountedPrice !== null ? discountedPrice : originalPrice;
      const payment = await createCheckoutSession({ 
        price: priceToUse.toFixed(2), 
        currency: "RUB",
        productId: starterProduct.id,
        description: `Подписка на тариф ${starterProduct.name}`
      });
      if (payment?.confirmation?.confirmation_url) {
        window.location.href = payment.confirmation.confirmation_url;
      } else {
        setSubmitting(false);
        alert("Не удалось начать оплату. Пожалуйста, попробуйте снова.");
      }
    } catch (error) {
        setSubmitting(false);
        alert("Не удалось начать оплату. Пожалуйста, попробуйте снова.");
    }
  };

  const applyPromoCode = async () => {
    if (!originalPrice) return;
    setSubmitting(true);
    try {
      const response = await applyPromoCodeApi(promoCode, originalPrice);
      if (response.success) {
        setDiscountedPrice(response.data.discountedPrice);
      } else {
        setDiscountedPrice(null);
        alert(response.message || "Неверный промокод.");
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      setDiscountedPrice(null);
      alert("Ошибка при применении промокода.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <Helmet>
        <title>Тарифы - Impulse AI</title>
        {/* Top.Mail.Ru counter */}
        <script type="text/javascript">
          {`
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "3724112", type: "pageView", start: (new Date()).getTime()});
            (function (d, w, id) {
              if (d.getElementById(id)) return;
              var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
              ts.src = "https://top-fwz1.mail.ru/js/code.js";
              var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
              if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
            })(document, window, "tmr-code");
          `}
        </script>
        <noscript>
          {`
            <div><img src="https://top-fwz1.mail.ru/counter?id=3724112;js=na" style="position:absolute;left:-9999px;" alt="Top.Mail.Ru" /></div>
          `}
        </noscript>
        {/* /Top.Mail.Ru counter */}
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary">
            <Crown className="w-4 h-4" />
            <span className="text-sm font-semibold">Импульс AI</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Разблокируйте ваш рост</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Переходите на тариф Starter для публикации неограниченного AI-контента и управления всем рабочим процессом в одном месте.
          </p>
        </div>

        {error && <div className="p-4 rounded-xl bg-destructive/20 border border-destructive/30 text-destructive text-center">{error}</div>}

        <Card className="bg-card border-border shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
          ) : starterProduct && (
            <>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                    <Zap className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">{starterProduct.name}</CardTitle>
                    <div className="text-muted-foreground text-sm">{starterProduct.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">
                    {discountedPrice !== null ? discountedPrice : originalPrice}₽
                    <span className="text-lg text-muted-foreground">/мес</span>
                  </div>
                  {isActiveStarter ? (
                    <Badge className="mt-2 bg-primary/10 text-primary border-primary/30">Активен</Badge>
                  ) : (
                    <Badge className="mt-2 bg-primary/10 text-primary border-primary/30">Лучшее предложение</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  {FEATURES.map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-foreground">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-background border-border p-6">
                  {isActiveStarter ? (
                    <>
                      <div className="text-lg text-foreground">Вы на тарифе Starter</div>
                       <div className="text-sm text-muted-foreground">Ваша подписка активна.</div>
                    </>
                  ) : (
                    <>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="Промокод"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-grow"
                        />
                        <Button
                          onClick={applyPromoCode}
                          disabled={submitting}
                        >
                          Применить
                        </Button>
                      </div>
                      <div className="text-muted-foreground text-center">Начните подписку сейчас</div>
                      <Button
                        onClick={handleCheckout}
                        disabled={submitting}
                        className="w-full"
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
            </>
          )}
        </Card>
      </div>
    </div>
  );
}