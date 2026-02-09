import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
// Removed incorrect entity imports: import { UserProfile } from "@/entities/all"; import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  User as UserIcon, 
  Sparkles, 
  Target, 
  MessageSquare,
  Save,
  Plus,
  X,
  Crown
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useToast } from "@/components/ui/use-toast";
import { getUserMeApi, updateUserMeApi } from "@/api/auth"; // Import user API functions
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const industries = [
  { value: "business_coaching", label: "Бизнес-коучинг" },
  { value: "life_coaching", label: "Лайф-коучинг" },
  { value: "fitness_coaching", label: "Фитнес-коучинг" },
  { value: "career_coaching", label: "Карьерный коучинг" },
  { value: "relationship_coaching", label: "Коучинг отношений" },
  { value: "financial_coaching", label: "Финансовый коучинг" },
  { value: "marketing_consulting", label: "Маркетинговый консалтинг" },
  { value: "leadership_coaching", label: "Коучинг лидерства" },
  { value: "mindset_coaching", label: "Коучинг мышления" },
  { value: "other", label: "Другое" }
];

const toneOptions = [
  { value: "professional", label: "Профессиональный" },
  { value: "conversational", label: "Разговорный" },
  { value: "inspiring", label: "Вдохновляющий" },
  { value: "authoritative", label: "Авторитетный" },
  { value: "friendly", label: "Дружелюбный" },
  { value: "bold", label: "Смелый" }
];

const goalOptions = [
  { value: "brand_awareness", label: "Узнаваемость бренда" },
  { value: "lead_generation", label: "Генерация лидов" },
  { value: "thought_leadership", label: "Экспертность" },
  { value: "community_building", label: "Построение сообщества" },
  { value: "sales_conversion", label: "Продажи" }
];

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    core_message: "",
    industry: "",
    target_audiences: [],
    brand_voice: {
      tone: "professional",
      personality_traits: [],
      writing_style: ""
    },
    preferred_platforms: [],
    content_pillars: [],
    goals: {
      primary_goal: "",
      monthly_content_target: 12,
      growth_targets: {}
    },
    onboarding_completed: false,
    subscription_tier: "starter"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newAudience, setNewAudience] = useState({ name: "", description: "", demographics: "" });
  const [newPillar, setNewPillar] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const profiles = await UserProfile.filter({ created_by: currentUser.email });
      if (profiles.length > 0) {
        setUserProfile(prevProfile => {
          const fetchedProfile = profiles[0];
          return {
            ...prevProfile, // Start with current default/initial state
            ...fetchedProfile, // Overlay with fetched data
            brand_voice: {
              ...prevProfile.brand_voice,
              ...(fetchedProfile.brand_voice || {}) // Ensure brand_voice is an object
            },
            goals: {
              ...prevProfile.goals,
              ...(fetchedProfile.goals || {}) // Ensure goals is an object
            }
          };
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!userProfile.core_message || userProfile.core_message.trim().length < 10) {
      e.core_message = "Please enter your core message (at least 10 characters).";
    }
    const m = Number(userProfile.goals?.monthly_content_target ?? 0);
    if (Number.isNaN(m) || m < 0) {
      e.monthly_content_target = "Monthly content target must be 0 or more.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast({ title: "Исправьте обязательные поля", description: "Пожалуйста, исправьте выделенные поля.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const profileData = {
        core_message: userProfile.core_message,
        industry: userProfile.industry,
        brand_voice_tone: userProfile.brand_voice.tone,
        writing_style_description: userProfile.brand_voice.writing_style,
        monthly_content_goal: Number(userProfile.goals?.monthly_content_target || 0),
        target_audiences: userProfile.target_audiences,
        content_pillars: userProfile.content_pillars,
        goals_primary_goal: userProfile.goals.primary_goal,
        preferred_platforms: userProfile.preferred_platforms,
        onboarding_completed: true,
      };

      await updateUserMeApi(profileData); // Use the new API to update the profile

      toast({ title: "Профиль сохранен", description: "Ваши настройки профиля успешно обновлены." });
      navigate(createPageUrl("Dashboard")); // Redirect to dashboard after saving
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({ title: "Ошибка сохранения", description: error.message || "Пожалуйста, попробуйте еще раз.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  const addAudience = () => {
    if (newAudience.name) {
      setUserProfile(prev => ({
        ...prev,
        target_audiences: [...prev.target_audiences, newAudience]
      }));
      setNewAudience({ name: "", description: "", demographics: "" });
    }
  };

  const removeAudience = (index) => {
    setUserProfile(prev => ({
      ...prev,
      target_audiences: prev.target_audiences.filter((_, i) => i !== index)
    }));
  };

  const addPillar = () => {
    if (newPillar) {
      setUserProfile(prev => ({
        ...prev,
        content_pillars: [...prev.content_pillars, newPillar]
      }));
      setNewPillar("");
    }
  };

  const removePillar = (index) => {
    setUserProfile(prev => ({
      ...prev,
      content_pillars: prev.content_pillars.filter((_, i) => i !== index)
    }));
  };

  const togglePlatform = (platform) => {
    setUserProfile(prev => ({
      ...prev,
      preferred_platforms: prev.preferred_platforms.includes(platform)
        ? prev.preferred_platforms.filter(p => p !== platform)
        : [...prev.preferred_platforms, platform]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/70">Загружаем ваш профиль...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <Helmet>
        <title>Профиль - Impulse AI</title>
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center relative">
              <UserIcon className="w-7 h-7 text-primary-foreground" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <Crown className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Настройка профиля</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Помогите нам понять ваше уникальное сообщение и цели, чтобы мы могли создавать контент, который действительно усиливает ваше влияние
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Core Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Ваше ключевое сообщение
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-foreground font-medium mb-2 block">
                    Какая одна трансформационная идея движет всем, что вы делаете?
                  </label>
                  <Textarea
                    placeholder="Например: 'Я верю, что каждый предприниматель обладает силой создать бизнес своей мечты, если у него правильный настрой и системы...'"
                    value={userProfile.core_message}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, core_message: e.target.value }))}
                    className="resize-none h-24"
                  />
                  {errors.core_message && <p className="text-destructive text-sm mt-1">{errors.core_message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-foreground font-medium mb-2 block">Отрасль</label>
                    <Select 
                      value={userProfile.industry} 
                      onValueChange={(value) => setUserProfile(prev => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите вашу отрасль" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {industries.map((industry) => (
                          <SelectItem 
                            key={industry.value} 
                            value={industry.value}
                          >
                            {industry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-foreground font-medium mb-2 block">Основная цель</label>
                    <Select 
                      value={userProfile.goals.primary_goal} 
                      onValueChange={(value) => setUserProfile(prev => ({ 
                        ...prev, 
                        goals: { ...prev.goals, primary_goal: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите основную цель" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {goalOptions.map((goal) => (
                          <SelectItem 
                            key={goal.value} 
                            value={goal.value}
                          >
                            {goal.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Brand Voice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Голос и тон бренда
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-foreground font-medium mb-2 block">Тон</label>
                    <Select 
                      value={userProfile.brand_voice.tone} 
                      onValueChange={(value) => setUserProfile(prev => ({ 
                        ...prev, 
                        brand_voice: { ...prev.brand_voice, tone: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {toneOptions.map((tone) => (
                          <SelectItem 
                            key={tone.value} 
                            value={tone.value}
                          >
                            {tone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-foreground font-medium mb-2 block">Месячная цель по контенту</label>
                    <Input
                      type="number"
                      value={userProfile.goals.monthly_content_target}
                      onChange={(e) => setUserProfile(prev => ({
                        ...prev, 
                        goals: { ...prev.goals, monthly_content_target: parseInt(e.target.value) || 0 }
                      }))}
                    />
                    {errors.monthly_content_target && <p className="text-destructive text-sm mt-1">{errors.monthly_content_target}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-foreground font-medium mb-2 block">Описание стиля письма</label>
                  <Textarea
                    placeholder="Опишите ваш уникальный стиль письма и индивидуальность..."
                    value={userProfile.brand_voice.writing_style}
                    onChange={(e) => setUserProfile(prev => ({ 
                      ...prev, 
                      brand_voice: { ...prev.brand_voice, writing_style: e.target.value }
                    }))}
                    className="resize-none h-20"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Target Audiences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Целевые аудитории
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Название аудитории"
                    value={newAudience.name}
                    onChange={(e) => setNewAudience(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Описание"
                    value={newAudience.description}
                    onChange={(e) => setNewAudience(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Демография"
                      value={newAudience.demographics}
                      onChange={(e) => setNewAudience(prev => ({ ...prev, demographics: e.target.value }))}
                    />
                    <Button 
                      onClick={addAudience}
                      variant="outline"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {userProfile.target_audiences.map((audience, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                      <div>
                        <p className="text-foreground font-medium">{audience.name}</p>
                        <p className="text-muted-foreground text-sm">{audience.description}</p>
                        {audience.demographics && (
                          <p className="text-muted-foreground text-xs">{audience.demographics}</p>
                        )}
                      </div>
                      <Button 
                        onClick={() => removeAudience(index)}
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Pillars & Platforms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Content Pillars */}
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Контентные столпы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Добавить контентный столп"
                    value={newPillar}
                    onChange={(e) => setNewPillar(e.target.value)} // Corrected onChange
                    className=""
                    onKeyPress={(e) => e.key === 'Enter' && addPillar()}
                  />
                  <Button 
                    onClick={addPillar}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {userProfile.content_pillars.map((pillar, index) => (
                    <Badge 
                      key={index}
                      className="bg-secondary text-secondary-foreground border-border flex items-center gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => removePillar(index)}
                    >
                      {pillar}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preferred Platforms */}
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Предпочитаемые платформы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {["linkedin", "instagram", "tiktok", "twitter", "telegram", "vk"].map((platform) => (
                    <div 
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                        userProfile.preferred_platforms.includes(platform)
                          ? 'bg-primary/10 border-primary/30 text-primary'
                          : 'bg-background border-border text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      <p className="font-medium text-center capitalize">{platform}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Button
              onClick={handleSave}
              disabled={isSaving || !userProfile.core_message}
              className="px-12 py-4 text-lg"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-3" />
                  Сохранение профиля...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-3" />
                  Завершить настройку и продолжить
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}