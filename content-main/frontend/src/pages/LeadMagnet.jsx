import React, { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import LeadMagnetHero from "@/components/landing/LeadMagnetHero";
import LeadMagnetProblems from "@/components/landing/LeadMagnetProblems";
import LeadMagnetBenefit from "@/components/landing/LeadMagnetBenefit";
import LeadMagnetSteps from "@/components/landing/LeadMagnetSteps";
import LeadMagnetCTA from "@/components/landing/LeadMagnetCTA";
import Footer from "@/components/landing/Footer";

export default function LeadMagnet() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Скидка 30% на AI Контент - Импульс AI</title>
        <meta name="description" content="Получите эксклюзивный промокод на скидку 30% на первый месяц использования Импульс AI. Начните создавать конверсионный контент уже сегодня." />
        <meta name="keywords" content="AI контент, SMM автоматизация, промокод, скидка, маркетинг AI" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Скидка 30% на AI Контент - Импульс AI" />
        <meta property="og:description" content="Получите эксклюзивный промокод на скидку 30% на первый месяц использования Импульс AI." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Скидка 30% на AI Контент - Импульс AI" />
        <meta property="twitter:description" content="Получите эксклюзивный промокод на скидку 30% на первый месяц использования Импульс AI." />
        
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

        {/* Yandex.Metrika counter */}
        <script type="text/javascript">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105689095', 'ym');

            ym(105689095, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
          `}
        </script>
        <noscript>
          {`
            <div><img src="https://mc.yandex.ru/watch/105689095" style="position:absolute; left:-9999px;" alt="" /></div>
          `}
        </noscript>
        {/* /Yandex.Metrika counter */}
      </Helmet>
      
      <LeadMagnetHero />
      <LeadMagnetProblems />
      <LeadMagnetBenefit />
      <LeadMagnetSteps />
      <LeadMagnetCTA />
      <Footer />
    </div>
  );
}
