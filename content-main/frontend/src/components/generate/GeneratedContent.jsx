import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Copy, 
  Save, 
  RefreshCw, 
  Edit, 
  Eye,
  CheckCircle,
  Sparkles
} from "lucide-react";

export default function GeneratedContent({ 
  content, 
  onSave, 
  onCopy, 
  onRegenerate,
  isLoading,
  isSaving // Add isSaving prop
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content.body);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const updatedContent = { ...content, body: editedContent };
    onSave(updatedContent);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Performance Prediction */}
      <Card className="bg-card border-border shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-semibold">Прогноз эффективности</p>
                <p className="text-muted-foreground text-sm">
                  {content.estimated_performance || "Ожидается высокое вовлечение"}
                </p>
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/30">
              AI оптимизирован
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      <Card className="bg-card border-border shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Сгенерированный контент
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground border-border">
              {content.platform}
            </Badge>
            <Badge className="bg-secondary text-secondary-foreground border-border">
              {content.content_type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Preview */}
          <div className="relative">
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-40 resize-none"
              />
            ) : (
              <div className="p-4 rounded-lg bg-background border border-border min-h-40">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {content.body}
                </p>
              </div>
            )}
          </div>

          {/* Hashtags */}
          {content.hashtags && content.hashtags.length > 0 && (
            <div className="space-y-2">
              <label className="text-foreground font-medium">Hashtags</label>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((hashtag, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="bg-secondary text-secondary-foreground border-border"
                  >
                    #{hashtag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          {(content.hook_analysis || content.value_proposition) && (
            <div className="grid md:grid-cols-2 gap-4">
              {content.hook_analysis && (
                <div className="p-4 rounded-lg bg-accent/20 border border-accent/30">
                  <h4 className="text-foreground font-medium mb-2">Анализ хука</h4>
                  <p className="text-muted-foreground text-sm">{content.hook_analysis}</p>
                </div>
              )}
              {content.value_proposition && (
                <div className="p-4 rounded-lg bg-accent/20 border border-accent/30">
                  <h4 className="text-foreground font-medium mb-2">Ценностное предложение</h4>
                  <p className="text-muted-foreground text-sm">{content.value_proposition}</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving} // Disable when saving
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить и запланировать
                </>
              )}
            </Button>

            <Button
              onClick={handleCopy}
              variant="outline"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                  Скопировано!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать
                </>
              )}
            </Button>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Превью" : "Редактировать"}
            </Button>

            <Button
              onClick={onRegenerate}
              disabled={isLoading}
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Перегенерировать
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}