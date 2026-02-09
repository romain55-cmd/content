import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Hash } from "lucide-react";

const platformColors = {
  linkedin: "bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-400/30",
  instagram: "bg-pink-500/20 text-pink-600 dark:text-pink-300 border-pink-400/30",
  tiktok: "bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-400/30",
  twitter: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-400/30",
  telegram: "bg-blue-400/20 text-blue-600 dark:text-blue-300 border-blue-400/30",
  vk: "bg-blue-600/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
};

const statusColors = {
  draft: "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-400/30",
  scheduled: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-400/30",
  published: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-400/30",
  archived: "bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-400/30",
};

export default function ContentViewModal({ content, open, onOpenChange }) {
  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto z-50">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">{content.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${platformColors[content.platform]} border`}>
              {content.platform}
            </Badge>
            <Badge className={`${statusColors[content.status]} border`}>
              {content.status}
            </Badge>
            <Badge variant="outline" className="bg-card border-border text-foreground/80">
              {content.content_type}
            </Badge>
            {content.scheduled_date && (
              <Badge variant="outline" className="bg-card border-border text-foreground/80 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(
                  typeof content.scheduled_date === "string" 
                    ? new Date(content.scheduled_date) 
                    : content.scheduled_date, 
                  "d MMM yyyy"
                )}
              </Badge>
            )}
          </div>

          {/* Content Body */}
          <div className="p-4 rounded-lg bg-accent/50 border border-border">
            <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {content.body}
            </p>
          </div>

          {/* Hashtags */}
          {content.hashtags && content.hashtags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-foreground/70 text-sm font-medium">
                <Hash className="w-4 h-4" />
                Хештеги
              </div>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-400/30 text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Target Audience */}
          {content.target_audience && (
            <div className="space-y-2">
              <div className="text-foreground/70 text-sm font-medium">Целевая аудитория</div>
              <div className="text-foreground/90">{content.target_audience}</div>
            </div>
          )}

          {/* Created Date */}
          <div className="text-foreground/50 text-sm">
            Создано: {format(new Date(content.createdAt), "d MMMM yyyy, HH:mm", { locale: ru })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}