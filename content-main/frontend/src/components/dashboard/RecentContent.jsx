import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Heart, 
  MessageSquare, 
  ExternalLink,
  Clock,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ContentViewModal from "../common/ContentViewModal";

const platformColors = {
  linkedin: "bg-primary/10 text-primary border-primary/30",
  instagram: "bg-primary/10 text-primary border-primary/30",
  tiktok: "bg-primary/10 text-primary border-primary/30",
  twitter: "bg-primary/10 text-primary border-primary/30"
};

const statusColors = {
  draft: "bg-muted text-muted-foreground border-border",
  scheduled: "bg-primary/10 text-primary border-primary/30",
  published: "bg-primary/10 text-primary border-primary/30"
};

const statusTranslations = {
  draft: "Черновик",
  scheduled: "Запланирован",
  published: "Опубликован",
};

export default function RecentContent({ content }) {
  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContentClick = (item) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };

  if (content.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-card border-border shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Контента пока нет</h3>
            <p className="text-muted-foreground mb-6">Начните создавать потрясающий контент для усиления вашего сообщения</p>
            <Link to={createPageUrl("Generate")}>
              <Button>
                Создать первый контент
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-card border-border shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Недавний контент
          </CardTitle>
          <Link to={createPageUrl("Library")}>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Показать все
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.slice(0, 5).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleContentClick(item)}
              className="p-4 rounded-xl bg-background border border-border hover:bg-accent transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${platformColors[item.platform] || "bg-muted text-muted-foreground border-border"} font-medium`}>
                      {item.platform}
                    </Badge>
                    <Badge className={`${statusColors[item.status] || "bg-muted text-muted-foreground border-border"} font-medium`}>
                      {statusTranslations[item.status] || item.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-foreground line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.body}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(item.createdAt), "MMM d, yyyy", { locale: ru })}
                    </div>
                    {item.performance_data && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {item.performance_data.impressions || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {item.performance_data.likes || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {item.performance_data.comments || 0}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <ContentViewModal
        content={selectedContent}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </motion.div>
  );
}