import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import NewWelcomeCard from "@/components/dashboard/NewWelcomeCard";
import NewStatsGrid from "@/components/dashboard/NewStatsGrid";
import RecentContent from "@/components/dashboard/RecentContent";
import NewQuickActions from "@/components/dashboard/NewQuickActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { getUserContentApi } from "@/api/content";

export default function Dashboard() {
  const [content, setContent] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoCodeData, setPromoCodeData, ] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const userContent = await getUserContentApi();
        setContent(userContent || []);

        const derivedStats = {
          totalContent: userContent.length,
          totalEngagement: 0,
          avgEngagement: 0,
          contentThisWeek: userContent.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
        };
        setStats(derivedStats);

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    // Check for promo code after registration
    const storedPromoCode = localStorage.getItem('newlyRegisteredPromoCode');
    if (storedPromoCode) {
      try {
        const parsedPromoCode = JSON.parse(storedPromoCode);
        setPromoCodeData(parsedPromoCode);
        setIsPromoModalOpen(true);
        localStorage.removeItem('newlyRegisteredPromoCode'); // Clear it after showing
      } catch (e) {
        console.error("Failed to parse stored promo code:", e);
        localStorage.removeItem('newlyRegisteredPromoCode'); // Clear invalid data
      }
    }
  }, []); // Run once on mount

  const handleCopyPromoCode = () => {
    if (promoCodeData?.code) {
      navigator.clipboard.writeText(promoCodeData.code);
      toast({ title: "Промокод скопирован!", description: "Вы можете вставить его при оформлении заказа." });
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Impulse AI</title>
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
      <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <NewWelcomeCard />
        
        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
            Быстрые действия
          </h2>
          <NewQuickActions />
        </div>
        
        {/* Stats Grid */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
            Статистика
          </h2>
          <NewStatsGrid stats={stats} isLoading={isLoading} />
        </div>
        
        {/* Recent Content */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
            Недавний контент
          </h2>
          <RecentContent content={content} isLoading={isLoading} />
        </div>

        {/* Promo Code Modal */}
        <Dialog open={isPromoModalOpen} onOpenChange={setIsPromoModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Поздравляем с регистрацией!</DialogTitle>
              <DialogDescription>
                Мы рады приветствовать вас! Вот ваш эксклюзивный промокод.
              </DialogDescription>
            </DialogHeader>
            <div className="text-center text-3xl font-bold text-primary py-4">
              {promoCodeData?.code}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Скидка: {promoCodeData?.discountValue}% ({promoCodeData?.discountType === 'percentage' ? 'процентная' : 'фиксированная'})
              {promoCodeData?.expiresAt && ` до ${new Date(promoCodeData.expiresAt).toLocaleDateString()}`}
            </p>
            <DialogFooter>
              <Button onClick={handleCopyPromoCode}>
                Копировать
              </Button>
              <Button variant="outline" onClick={() => setIsPromoModalOpen(false)}>
                Закрыть
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}