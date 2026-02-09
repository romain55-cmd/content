import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Local API and utils
import { generateAiContent, generateIdeasFromAI } from "@/api/ai";
import { saveContentApi } from "@/api/content";
import { createPageUrl } from "@/utils";
import { getUserMeApi } from "@/api/auth"; // Import user API

// UI Components
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Lightbulb,
  Save
} from "lucide-react";

// Sub-components for Generate page
import PlatformSelector from "../components/generate/PlatformSelector";
import ContentTypeSelector from "../components/generate/ContentTypeSelector";
import GenerationOptions from "../components/generate/GenerationOptions";
import GeneratedContent from "../components/generate/GeneratedContent";
import ContentIdeas from "../components/generate/ContentIdeas";
import SubscriptionRequiredModal from "../components/common/SubscriptionRequiredModal"; // Import subscription modal
import SubscriptionExpiredModal from "../components/common/SubscriptionExpiredModal"; // Import new subscription expired modal

export default function Generate() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contentIdeas, setContentIdeas] = useState([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false); // State for subscription required modal
  const [isSubscriptionExpiredModalOpen, setIsSubscriptionExpiredModalOpen] = useState(false); // New state for subscription expired modal

  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile && savedProfile !== 'undefined') {
      try {
        return JSON.parse(savedProfile);
      } catch (e) {
        console.error("Failed to parse profile from localStorage", e);
      }
    }
    // Default profile, will be updated by API call
    return {
      industry: 'бизнес-коучинг',
      core_message: 'Трансформация жизни через проверенные стратегии',
      brand_voice: { tone: 'professional' },
      content_pillars: ['мышление', 'стратегия', 'советы по успеху'],
      freeGenerationsLeft: 0, // Initialize with 0, will be updated
    };
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getUserMeApi();
        setUserProfile(prevProfile => ({ ...prevProfile, ...user }));
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки профиля",
          description: error.message || "Не удалось загрузить данные пользователя.",
        });
      }
    };
    fetchUserProfile();
  }, []);

  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");
  const [selectedContentType, setSelectedContentType] = useState("post");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");

  const generateContentIdeas = async () => {
    setIsLoadingIdeas(true);
    try {
      const ideasPrompt = `КРИТИЧЕСКИ ВАЖНО: ВСЕ ИДЕИ ДОЛЖНЫ БЫТЬ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ!

      Сгенерируй 5 СВЕЖИХ и НЕОБЫЧНЫХ идей контента для соцсетей на тему "${userProfile?.industry || 'успех в бизнесе и личная продуктивность'}".

      Для каждой идеи предоставь НА РУССКОМ только:
      - "topic" (короткий, броский заголовок)
      - "angle" (описание идеи в одном предложении)
      - "trending_factor" (число от 0 до 100, показывающее, насколько идея в тренде)

      Это всё. Не нужно никаких других полей.`;
      const result = await generateIdeasFromAI(ideasPrompt);
      setContentIdeas(result.ideas || []);
    } catch (error) {
      console.error("Error generating content ideas:", error);
      toast({ variant: "destructive", title: "Ошибка генерации идей", description: error.message });
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  const generateContent = async (prompt = null) => {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      // Re-fetch user profile for the most up-to-date status
      const freshUserProfile = await getUserMeApi();
      setUserProfile(freshUserProfile); // Update state for the whole component

      // Check for expired subscription first
      if (freshUserProfile.subscription_status === 'expired') {
        setIsSubscriptionExpiredModalOpen(true);
        setIsLoading(false);
        return;
      }

      // Then check for depleted free generations / inactive subscription
      if (freshUserProfile.subscription_status !== 'active' && !freshUserProfile.has_unlimited_generations && freshUserProfile.freeGenerationsLeft <= 0) {
        setIsSubscriptionModalOpen(true);
        setIsLoading(false);
        return;
      }

      const finalPrompt = prompt || customPrompt || `Создай контент о ${freshUserProfile?.core_message}`;

      let fullPromptContext = `
      START_USER_PROFILE
      ${JSON.stringify(freshUserProfile, null, 2)}
      END_USER_PROFILE

      START_GENERATION_TASK
      Платформа: ${selectedPlatform}
      Тип контента: ${selectedContentType}
      Целевая аудитория: ${selectedAudience || 'не указана'}
      Тон голоса: ${selectedTone}

      ЗАДАЧА:
      ${finalPrompt}
      END_GENERATION_TASK
      `;

      if (selectedPlatform === 'twitter') {
        fullPromptContext += `\n\nКРИТИЧЕСКИ ВАЖНО: Так как это для Twitter, основной текст (body) должен быть очень коротким, в пределах 280 символов.`;
      }

      const result = await generateAiContent(fullPromptContext);
      setGeneratedContent({ ...result, generation_prompt: finalPrompt });

      // Update freeGenerationsLeft from the response
      if (result.freeGenerationsLeft !== undefined) {
        setUserProfile(prevProfile => ({
          ...prevProfile,
          freeGenerationsLeft: result.freeGenerationsLeft
        }));
        // Also update localStorage
        const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
                  localStorage.setItem('userProfile', JSON.stringify({
                    ...savedProfile,
                    freeGenerationsLeft: result.freeGenerationsLeft,
                    subscription_status: result.subscription_status,
                    has_unlimited_generations: result.has_unlimited_generations,
                  }));      }

    } catch (error) {
      console.error("Error generating content:", error);
      toast({ variant: "destructive", title: "Ошибка генерации", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async () => {
    if (!generatedContent) return;
    setIsSaving(true);
    try {
      const contentToSave = {
        title: generatedContent.title,
        body: generatedContent.body,
        platform: selectedPlatform, // Use state directly
        content_type: selectedContentType, // Use state directly
        hashtags: generatedContent.hashtags,
        status: "draft",
      };
      
      console.log("Data being sent to API:", contentToSave);
      await saveContentApi(contentToSave);

      toast({
        title: "Успешно сохранено",
        description: "Ваш контент добавлен в Библиотеку.",
      });
      navigate('/library');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: error.message || "Не удалось сохранить контент.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
    const copyToClipboard = async () => {
    if (!generatedContent) return;
    const text = `${generatedContent.body}\n\n${generatedContent.hashtags?.map(tag => `#${tag}`).join(' ') || ''}`;
    await navigator.clipboard.writeText(text);
    toast({ title: "Скопировано!", description: "Текст контента скопирован в буфер обмена." });
  };

  return (
    <div className="p-6 lg:p-8">
      <Helmet>
        <title>AI-студия контента - Impulse AI</title>
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
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">AI-студия контента</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Превратите ваше сообщение в убедительный контент, который усиливает ваше влияние на всех платформах
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="relative z-20 pointer-events-auto">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-primary" />
                    Настройки генерации
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PlatformSelector selected={selectedPlatform} onSelect={setSelectedPlatform} />
                  <ContentTypeSelector selected={selectedContentType} onSelect={setSelectedContentType} platform={selectedPlatform} />
                  <GenerationOptions tone={selectedTone} onToneChange={setSelectedTone} audience={selectedAudience} onAudienceChange={setSelectedAudience} userProfile={userProfile} />
                  <div className="space-y-3">
                    <label className="text-foreground font-medium">Пользовательский запрос</label>
                    <Textarea
                      placeholder="Опишите, какой контент вы хотите создать..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="resize-none h-24"
                    />
                  </div>
                  <Button onClick={() => generateContent()} disabled={isLoading} className="w-full">
                    {isLoading ? (<><RefreshCw className="w-5 h-5 mr-2 animate-spin" />Генерация...</>) : (<><Sparkles className="w-5 h-5 mr-2" />Сгенерировать контент</>)}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            <ContentIdeas
              ideas={contentIdeas}
              isLoading={isLoadingIdeas}
              onSelectIdea={generateContent}
              onRefresh={generateContentIdeas}
            />
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {generatedContent ? (
                <GeneratedContent content={generatedContent} onSave={saveContent} onCopy={copyToClipboard} onRegenerate={() => generateContent(generatedContent.generation_prompt)} isLoading={isLoading} isSaving={isSaving} />
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                      <Lightbulb className="w-16 h-16 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Готовы творить магию?</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Выберите платформу, тип контента и нажмите «Сгенерировать», чтобы создать убедительный контент, усиливающий ваше сообщение
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <SubscriptionRequiredModal isOpen={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen} />
      <SubscriptionExpiredModal isOpen={isSubscriptionExpiredModalOpen} onOpenChange={setIsSubscriptionExpiredModalOpen} /> {/* Render new modal */}
    </div>
  );
}

