import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async'; // Import Helmet
import Hero from "@/components/landing/Hero";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import PricingModal from "@/components/landing/PricingModal";
import Footer from "@/components/landing/Footer";

export default function Landing() {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on mount and clear hash to prevent auto-scroll on refresh
    window.scrollTo(0, 0);
    
    // If there's a hash, scroll to it after content loads, then clear it
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Clear hash after scrolling
        navigate(location.pathname, { replace: true });
      }, 100);
    }
    
    const handleOpenModal = () => setIsPricingModalOpen(true);
    document.addEventListener('openPricingModal', handleOpenModal);
    return () => {
      document.removeEventListener('openPricingModal', handleOpenModal);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Импульс AI - AI-Driven Content Amplification</title>
        <meta name="description" content="Импульс AI helps businesses create engaging and high-converting content using AI, streamlining SMM and marketing efforts." />
        <meta name="keywords" content="AI content, SMM automation, marketing AI, content creation, social media marketing, SEO, digital marketing" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.impulse-ai.ru/" /> {/* Replace with actual domain */}
        <meta property="og:title" content="Импульс AI - AI-Driven Content Amplification" />
        <meta property="og:description" content="Импульс AI helps businesses create engaging and high-converting content using AI, streamlining SMM and marketing efforts." />
        <meta property="og:image" content="https://www.momentumamplify.com/og-image.jpg" /> {/* Replace with actual image URL */}
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.momentumamplify.com/" /> {/* Replace with actual domain */}
        <meta property="twitter:title" content="Импульс AI - AI-Driven Content Amplification" />
        <meta property="twitter:description" content="Импульс AI helps businesses create engaging and high-converting content using AI, streamlining SMM and marketing efforts." />
        <meta property="twitter:image" content="https://www.momentumamplify.com/og-image.jpg" /> {/* Replace with actual image URL */}
        
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
      <Hero onOpenPricingModal={() => setIsPricingModalOpen(true)} />
      <FeatureGrid />
      <HowItWorks />
      <CTA onOpenPricingModal={() => setIsPricingModalOpen(true)} />
      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
      <Footer />
    </div>
  );
}