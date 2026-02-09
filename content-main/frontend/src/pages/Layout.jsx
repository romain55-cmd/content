import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home,
  Sparkles,
  Calendar,
  BarChart3,
  Library,
  User,
  Zap,
  Crown,
  Menu,
  CreditCard,
  MessageSquare
} from "lucide-react";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const navigationItems = [
  { title: "Панель управления", url: createPageUrl("Dashboard"), icon: Home, description: "Командный центр" },
  { title: "Генерация", url: createPageUrl("Generate"), icon: Sparkles, description: "AI-студия контента" },
  { title: "Календарь", url: createPageUrl("Calendar"), icon: Calendar, description: "Планирование контента" },
  { title: "Аналитика", url: createPageUrl("Analytics"), icon: BarChart3, description: "Статистика эффективности" },
  { title: "Библиотека", url: createPageUrl("Library"), icon: Library, description: "Архив контента" },
  { title: "Тарифы", url: createPageUrl("Pricing"), icon: CreditCard, description: "Обновить план" },
  { title: "Агенты", url: createPageUrl("Agents"), icon: MessageSquare, description: "Студия агентов" }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, hash } = location;

  useEffect(() => {
    // Scroll to top first on page change
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  useEffect(() => {
    // Handle hash scrolling after a short delay to ensure content is rendered
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [hash]);


  // No layout for auth pages
  if (["Login", "Register", "AuthCallback", "PaymentSuccess"].includes(currentPageName)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </div>
    );
  }

  // Special marketing layout for the public Landing page (header, but no sidebar)
  if (["Landing", "LeadMagnet"].includes(currentPageName)) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 px-6 py-4 border-b border-border bg-background/80 backdrop-blur-xl" role="banner">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Logo />
            <div className="hidden md:flex items-center gap-8">
              <Link to="/#how" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Как это работает</Link>
              <Link to="/lead-magnet" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Ресурсы</Link>
              <button onClick={() => document.dispatchEvent(new CustomEvent('openPricingModal'))} className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Тарифы</button>
              <Link to="/login">
                <button className="px-5 py-2 rounded-xl border border-border hover:border-primary/50 text-sm font-medium transition-all">
                  Войти
                </button>
              </Link>
              <Link to="/register">
                <button className="px-5 py-2 rounded-xl bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 text-sm font-semibold transition-all hover:scale-105">
                  Начать бесплатно
                </button>
              </Link>
            </div>
            <button 
              onClick={() => navigate('/login')} 
              className="md:hidden px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Войти
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="relative" role="main">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    );
  }

  // Default layout with sidebar for the main application
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/5 to-background">
        <Sidebar className="w-72 border-r-0" role="navigation" aria-label="Primary">
          <SidebarHeader className="p-6 pb-4">
            <Link to="/" className="cursor-pointer group">
              <div className="flex items-center gap-3">
                <Logo size="default" />
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-3 py-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest px-3 py-2 mb-1">Навигация</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link 
                            to={item.url} 
                            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                              isActive 
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                                : 'hover:bg-accent/50 text-foreground'
                            }`}
                          >
                            {/* Glow effect for active item */}
                            {isActive && (
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-xl blur-xl" />
                            )}
                            <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              isActive 
                                ? 'bg-white/20' 
                                : 'bg-accent/50 group-hover:bg-accent'
                            }`}>
                              <item.icon className="w-4 h-4 relative z-10" aria-hidden="true" />
                            </div>
                            <div className="flex-1 relative z-10">
                              <div className="font-semibold text-[13px] leading-tight">{item.title}</div>
                              <div className={`text-[11px] leading-tight ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest px-3 py-2 mb-1">Аккаунт</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={createPageUrl("Profile")} 
                        className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-accent/50"
                      >
                        <div className="w-9 h-9 rounded-lg bg-accent/50 group-hover:bg-accent flex items-center justify-center transition-all duration-200">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-[13px] leading-tight">Профиль</div>
                          <div className="text-[11px] text-muted-foreground leading-tight">Настройки</div>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-3 space-y-2">
            <Link to={createPageUrl("Pricing")} className="block" aria-label="Upgrade to Pro plan">
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Crown className="w-5 h-5 text-foreground" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">Обновить до Pro</p>
                    <p className="text-xs text-muted-foreground">Больше возможностей</p>
                  </div>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { localStorage.removeItem('authToken'); navigate('/login'); }} 
                className="flex-1 px-3 py-2.5 rounded-xl border border-border/50 hover:border-border hover:bg-accent/50 text-[13px] font-medium transition-all duration-200 flex items-center justify-center gap-2" 
                aria-label="Выйти"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Выйти
              </button>
              <ThemeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-auto relative" role="main">
          <header className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="p-2 rounded-xl hover:bg-accent transition-all duration-200">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>
                <Logo size="small" />
              </div>
              <ThemeToggle />
            </div>
          </header>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}