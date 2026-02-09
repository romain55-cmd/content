import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO } from "date-fns";
import { ru } from 'date-fns/locale'; // Import Russian locale
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, Trash2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useToast } from "@/components/ui/use-toast";
import { getUserContentApi, updateContentApi, deleteContentApi } from "@/api/content";
import ConfirmationDialog from "../components/common/ConfirmationDialog";

export default function Calendar() {
  const [items, setItems] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isCancelConfirmationOpen, setIsCancelConfirmationOpen] = useState(false);
  const [itemToCancel, setItemToCancel] = useState(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all content, without any filters for the calendar view
      const allContent = await getUserContentApi(); 
      setItems(allContent);
    } catch (error) {
      toast({ variant: "destructive", title: "Ошибка", description: "Не удалось загрузить контент для календаря." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const scheduleItem = async (item, date) => {
    if (!date) return;
    try {
      await updateContentApi(item.id, {
        scheduled_date: date.toISOString(),
        status: "scheduled"
      });
      toast({ title: "Запланировано", description: `"${item.title}" запланирован на ${date.toLocaleDateString()}.` });
      await loadContent(); // Refresh the calendar
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
        loadContent(); // Re-fetch content to update the view
      } catch (error) {
        toast({ variant: "destructive", title: "Ошибка", description: "Не удалось удалить контент." });
      } finally {
        setIsDeleteConfirmationOpen(false);
        setItemToDelete(null);
      }
    }
  };

  const handleCancelSchedule = (itemId) => {
    setItemToCancel(itemId);
    setIsCancelConfirmationOpen(true);
  };

  const confirmCancel = async () => {
    if (itemToCancel) {
      try {
        await updateContentApi(itemToCancel, {
          status: 'draft',
          scheduled_date: null,
        });
        toast({ title: "Планирование отменено" });
        loadContent(); // Re-fetch content to update the view
      } catch (error) {
        toast({ variant: "destructive", title: "Ошибка", description: "Не удалось отменить планирование." });
      } finally {
        setIsCancelConfirmationOpen(false);
        setItemToCancel(null);
      }
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button aria-label="Previous month" variant="outline" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold text-foreground">{format(currentMonth, "MMMM yyyy", { locale: ru })}</h2>
        <Button aria-label="Next month" variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <Link to={createPageUrl("Generate")}>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Plus className="w-4 h-4 mr-2" /> Создать контент
        </Button>
      </Link>
    </div>
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const rows = [];
  let day = calendarStart;

  while (day <= calendarEnd) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const dayItems = items.filter((it) => {
        if (!it.scheduled_date) return false;
        const d = typeof it.scheduled_date === "string" ? parseISO(it.scheduled_date) : new Date(it.scheduled_date);
        return isSameDay(d, cloneDay);
      });

      days.push(
        <div
          key={cloneDay.toISOString()}
          className={`p-2 rounded-lg border h-36 overflow-auto ${
            isSameMonth(cloneDay, monthStart) ? "bg-accent/50 border-border" : "bg-transparent border-border/50 opacity-60"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">{format(cloneDay, "d")}</span>
          </div>
          <div className="space-y-1">
            {dayItems.map((it) => (
              <div key={it.id} className="text-xs p-2 rounded-md bg-card border border-border group relative">
                <div> {/* No flex-grow here */}
                  <span className="text-foreground font-medium line-clamp-1">{it.title}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-amber-500/30 text-amber-700 dark:text-amber-200 border-amber-400/30">{it.platform}</Badge>
                    <div className="text-muted-foreground">{it.content_type}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 w-6 h-6 hover:bg-red-500/20" onClick={() => handleCancelSchedule(it.id)}>
                  <XCircle className="w-4 h-4 text-red-400" />
                </Button>
              </div>

            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toISOString()} className="grid grid-cols-7 gap-2">
        {days}
      </div>
    );
  }

  const drafts = items.filter((i) => i.status === "draft");

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {renderHeader()}

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Календарь контента</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground mb-1">
                {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((d) => (
                  <div key={d} className="text-center">{d}</div>
                ))}
              </div>
              <div className="space-y-2">
                {rows}
              </div>
              {isLoading && <div className="text-muted-foreground text-sm mt-2">Loading...</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" /> Незапланированные черновики
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {drafts.length === 0 ? (
                <div className="text-muted-foreground text-sm">
                  Черновиков пока нет. Создайте контент и запланируйте его здесь.
                </div>
              ) : drafts.map((d) => (
                <div key={d.id} className="p-3 rounded-lg bg-accent/50 border border-border">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-foreground font-medium line-clamp-1">{d.title}</div>
                      <div className="text-muted-foreground text-xs">{d.platform} • {d.content_type}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" aria-label={`Запланировать ${d.title}`}>
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Запланировать
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto rounded-lg z-50">
                          <CalendarPicker
                            mode="single"
                            selected={d.scheduled_date ? parseISO(d.scheduled_date) : undefined}
                            onSelect={(date) => scheduleItem(d, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(d.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={isDeleteConfirmationOpen}
        onOpenChange={setIsDeleteConfirmationOpen}
        onConfirm={confirmDelete}
        title="Вы уверены, что хотите удалить этот контент?"
        description="Это действие не может быть отменено. Это навсегда удалит этот контент."
        confirmText="Удалить"
      />
      <ConfirmationDialog
        isOpen={isCancelConfirmationOpen}
        onOpenChange={setIsCancelConfirmationOpen}
        onConfirm={confirmCancel}
        title="Вы уверены, что хотите отменить планирование?"
        description="Этот контент будет перемещен в черновики."
        confirmText="Отменить планирование"
      />
    </div>
  );
}