import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home,
  Sparkles,
  Calendar,
  BarChart3,
  Library,
  CreditCard,
  MessageSquare,
  User,
  BrainCircuit,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/common/Logo";

const navigationItems = [
  { title: "Панель управления", url: createPageUrl("Dashboard"), icon: Home },
  { title: "Генерация", url: createPageUrl("Generate"), icon: Sparkles },
  { title: "Календарь", url: createPageUrl("Calendar"), icon: Calendar },
  { title: "Аналитика", url: createPageUrl("Analytics"), icon: BarChart3 },
  { title: "Библиотека", url: createPageUrl("Library"), icon: Library },
  { title: "Агенты", url: createPageUrl("Agents"), icon: MessageSquare }
];

const accountItems = [
  { title: "Тарифы", url: createPageUrl("Pricing"), icon: CreditCard },
  { title: "Профиль", url: createPageUrl("Profile"), icon: User },
]

const NewSidebar = () => {
  const location = useLocation();

  return (
    <aside className="col-start-1 row-start-2 border-r p-4 flex flex-col justify-between">
      <div className="flex flex-col gap-8">
        <div className="px-2">
          <Logo size="default" />
        </div>
        <nav className="flex flex-col gap-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all
                  ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/50'}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        {accountItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all
                  ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/50'}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
          <Button variant="outline" size="sm" onClick={() => { localStorage.removeItem('authToken'); window.location.href = '/login'; }}>
            Выйти
          </Button>
      </div>
    </aside>
  );
};

export default NewSidebar;
