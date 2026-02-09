import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Image, 
  Video, 
  MessageSquare,
  BookOpen
} from "lucide-react";

const contentTypes = {
  linkedin: [
    { id: "post", name: "Пост", icon: FileText, description: "Одиночный пост" },
    { id: "carousel", name: "Карусель", icon: Image, description: "Многослайд" },
    { id: "thread", name: "Тред", icon: MessageSquare, description: "Серия" }
  ],
  instagram: [
    { id: "post", name: "Пост", icon: FileText, description: "Пост в ленте" },
    { id: "story", name: "Сторис", icon: BookOpen, description: "Контент для сторис" },
    { id: "carousel", name: "Карусель", icon: Image, description: "Несколько фото" }
  ],
  tiktok: [
    { id: "video_script", name: "Сценарий видео", icon: Video, description: "Сценарий" },
    { id: "post", name: "Подпись", icon: FileText, description: "Подпись к видео" }
  ],
  twitter: [
    { id: "post", name: "Твит", icon: FileText, description: "Один твит" },
    { id: "thread", name: "Тред", icon: MessageSquare, description: "Серия твитов" }
  ],
  telegram: [
    { id: "post", name: "Пост", icon: FileText, description: "Пост в канале" },
    { id: "story", name: "Сторис", icon: BookOpen, description: "История" }
  ],
  vk: [
    { id: "post", name: "Пост", icon: FileText, description: "Пост на стене" },
    { id: "clip", name: "Клип", icon: Video, description: "Короткое видео" } // Changed from story to clip for VK
  ]
};

export default function ContentTypeSelector({ selected, onSelect, platform }) {
  const types = contentTypes[platform] || contentTypes.linkedin;

  return (
    <div className="space-y-3">
      <label className="text-foreground font-medium">Тип контента</label>
      <div className="space-y-2">
        {types.map((type) => {
          const isSelected = selected === type.id;
          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(type.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-300 border ${
                isSelected 
                  ? 'bg-primary/10 border-primary/30 shadow-lg' 
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary' : 'bg-muted'}`}>
                  <type.icon className={`w-4 h-4 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium">{type.name}</p>
                  <p className="text-muted-foreground text-sm">{type.description}</p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full bg-primary"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}