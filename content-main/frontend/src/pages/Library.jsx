import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Library as LibraryIcon, RefreshCw, Plus, Search, CalendarPlus, Trash2 } from "lucide-react";
import { getUserContentApi, updateContentApi, deleteContentApi } from "@/api/content";
import ContentViewModal from "../components/common/ContentViewModal";
import ConfirmationDialog from "../components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";
import { ru } from 'date-fns/locale';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const platforms = ["instagram", "linkedin", "telegram", "twitter", "tiktok", "vk"];
const statuses = ["draft", "published", "scheduled", "archived"];
const statusTranslations = {
  draft: "Черновик",
  published: "Опубликован",
  scheduled: "Запланирован",
  archived: "В архиве",
};

// Consistent styling for Select components - updated to new theme
const selectTriggerClass = ""; // Using default Input styles
const selectContentClass = "bg-popover border-border text-popover-foreground";
const selectItemClass = ""; // Using default SelectItem styles


export default function Library() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({ search: "", platform: "all", status: "all" });
  const debouncedSearch = useDebounce(filters.search, 300);

  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiFilters = {
        search: debouncedSearch,
        platform: filters.platform === 'all' ? '' : filters.platform,
        status: filters.status === 'all' ? '' : filters.status,
      };
      const userContent = await getUserContentApi(apiFilters);
      setContent(userContent);
    } catch (error) {
      setError(error.message || "Не удалось загрузить контент.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, filters.platform, filters.status]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await updateContentApi(itemId, { status: newStatus });
      setContent(prevContent => prevContent.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      ));
      toast({ title: "Статус обновлен" });
    } catch (error) {
      toast({ variant: "destructive", title: "Ошибка", description: "Не удалось обновить статус." });
    }
  };
  
  const handleSchedule = async (item, date) => {
    if (!date) return;
    try {
      await updateContentApi(item.id, {
        status: 'scheduled',
        scheduled_date: date.toISOString(),
      });
      toast({ title: "Успешно запланировано!", description: `Пост "${item.title}" запланирован на ${date.toLocaleDateString()}.` });
      navigate('/calendar'); // Navigate to calendar page
    } catch (error) {
      toast({ variant: "destructive", title: "Ошибка", description: "Не удалось запланировать пост." });
    }
  };
  
  const handleDelete = (itemId) => {
    setItemToDelete(itemId);
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteContentApi(itemToDelete);
        toast({ title: "Контент удален" });
        fetchContent(); // Re-fetch content to update the list
      } catch (error) {
        toast({ variant: "destructive", title: "Ошибка", description: "Не удалось удалить контент." });
      } finally {
        setIsDeleteConfirmationOpen(false);
        setItemToDelete(null);
      }
    }
  };

  const handleContentClick = (item) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3"><LibraryIcon className="w-12 h-12 text-primary" /><h1 className="text-4xl lg:text-5xl font-bold text-foreground">Библиотека контента</h1></div>
            <div className="flex items-center gap-2"><Button onClick={fetchContent} disabled={isLoading} variant="outline"><RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />Обновить</Button><Link to={createPageUrl("Generate")}><Button><Plus className="w-4 h-4 mr-2" />Создать контент</Button></Link></div>
        </div>
        <Card className="bg-card border-border shadow-lg"><CardHeader><CardTitle className="text-foreground">Фильтры</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input placeholder="Поиск контента..." value={filters.search} onChange={(e) => setFilters(f => ({...f, search: e.target.value}))} className="pl-10"/></div>
            <Select value={filters.platform} onValueChange={(v) => setFilters(f => ({...f, platform: v}))}><SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Все платформы" /></SelectTrigger>
                <SelectContent className={selectContentClass}><SelectItem value="all" className={selectItemClass}>Все платформы</SelectItem>{platforms.map(p => <SelectItem key={p} value={p} className={selectItemClass}>{p}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(v) => setFilters(f => ({...f, status: v}))}><SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Все статусы" /></SelectTrigger>
                <SelectContent className={selectContentClass}><SelectItem value="all" className={selectItemClass}>Все статусы</SelectItem>{statuses.map(s => <SelectItem key={s} value={s} className={selectItemClass}>{statusTranslations[s] || s}</SelectItem>)}</SelectContent>
            </Select>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {isLoading && <p className="text-muted-foreground text-center">Загрузка...</p>}
          {error && <p className="text-destructive text-center">{error}</p>}
          {!isLoading && !error && content.length === 0 && (<p className="text-muted-foreground text-center">Контент не найден.</p>)}
          {!isLoading && !error && content.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.map((item) => (
                <Card key={item.id} className="bg-card border-border text-foreground flex flex-col hover:bg-accent transition-colors">
                  <div className="p-6 flex-grow space-y-3">
                    <h3 className="font-bold text-lg line-clamp-2 cursor-pointer" onClick={() => handleContentClick(item)}>{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 cursor-pointer" onClick={() => handleContentClick(item)}>{item.body}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <Badge className="bg-secondary text-secondary-foreground">{item.platform}</Badge>
                        <Badge className="bg-primary/10 text-primary">{statusTranslations[item.status] || item.status}</Badge>
                        <Badge className="bg-secondary text-secondary-foreground">{item.content_type}</Badge>
                    </div>
                     <div className="text-xs text-muted-foreground pt-1">
                        {format(new Date(item.createdAt), "MMM d, yyyy", { locale: ru })}
                    </div>
                  </div>
                  <div className="p-4 mt-auto border-t border-border flex flex-wrap items-center justify-between gap-2">
                    <Select value={item.status} onValueChange={(newStatus) => handleStatusChange(item.id, newStatus)}>
                        <SelectTrigger className={`w-[140px] ${selectTriggerClass}`}><SelectValue placeholder="Статус" /></SelectTrigger>
                        <SelectContent className={selectContentClass}>
                            {statuses.map(s => <SelectItem key={s} value={s} className={selectItemClass}>{statusTranslations[s] || s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="sm" variant="outline">
                          <CalendarPlus className="w-4 h-4 mr-2" />
                          Запланировать
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover border-border text-popover-foreground">
                        <Calendar
                          mode="single"
                          selected={item.scheduled_date ? parseISO(item.scheduled_date) : undefined}
                          onSelect={(date) => handleSchedule(item, date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <ContentViewModal content={selectedContent} open={isModalOpen} onOpenChange={setIsModalOpen} />
      <ConfirmationDialog
        isOpen={isDeleteConfirmationOpen}
        onOpenChange={setIsDeleteConfirmationOpen}
        onConfirm={confirmDelete}
        title="Вы уверены, что хотите удалить этот контент?"
        description="Это действие не может быть отменено. Это навсегда удалит этот контент."
        confirmText="Удалить"
      />
    </div>
  );
}