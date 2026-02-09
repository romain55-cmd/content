import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Lightbulb, Sparkles, Loader2 } from "lucide-react";

export default function ContentIdeas({ ideas = [], isLoading, onSelectIdea, onRefresh }) {
  const handleUse = (idea) => {
    const prompt = `Напиши полноценный пост для соцсетей на основе следующей идеи:

Тема: ${idea.topic}
Ключевая мысль: ${idea.angle}

Сгенерируй детальный текст, подходящий для публикации, включая заголовок, тело поста и хэштеги.`;
    onSelectIdea(prompt);
  };

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader className="gap-3 sm:flex sm:items-center sm:justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Идеи для контента
        </CardTitle>
        <Button
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Создать новые идеи контента"
          className="w-full sm:w-auto sm:ml-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          {isLoading ? "Генерация..." : "Создать идеи"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {ideas.length === 0 && !isLoading && (
          <div className="p-4 rounded-lg bg-background border border-border text-muted-foreground">
            Идей пока нет. Нажмите «Создать идеи», чтобы получить свежие подсказки для вашего профиля.
          </div>
        )}
        {ideas.map((idea) => (
          <div key={idea.id || idea.topic} className="p-4 rounded-lg bg-background border border-border space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-foreground font-semibold line-clamp-1">{idea.topic}</h4>
              <div className="flex gap-2">
                {idea.target_platform && (
                  <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border">
                    {idea.target_platform}
                  </Badge>
                )}
                {idea.content_type && (
                  <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border">
                    {idea.content_type}
                  </Badge>
                )}
                {typeof idea.trending_factor === "number" && (
                  <Badge className="bg-primary/10 text-primary border-primary/30">
                    Тренд {Math.round(idea.trending_factor)}
                  </Badge>
                )}
              </div>
            </div>
            {idea.hook && <p className="text-muted-foreground text-sm">{idea.hook}</p>}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs line-clamp-2">
                {idea.angle}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUse(idea)}
                aria-label={`Use idea: ${idea.topic}`}
              >
                <Sparkles className="w-4 h-4 mr-2" /> Использовать идею
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}