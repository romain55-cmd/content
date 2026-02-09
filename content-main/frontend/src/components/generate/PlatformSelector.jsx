import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Linkedin,
  Instagram, 
  Music,
  Twitter,
  Users,
  Send
} from "lucide-react";

const platforms = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    description: "Профессиональная сеть"
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    description: "Визуальные истории"
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music,
    description: "Короткие видео"
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: Twitter,
    description: "Разговоры"
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: Send,
    description: "Мессенджер"
  },
  {
    id: "vk",
    name: "ВКонтакте",
    icon: Users,
    description: "Соцсеть"
  }
];

export default function PlatformSelector({ selected, onSelect }) {
  return (
    <div className="space-y-3">
      <label className="text-foreground font-medium">Платформа</label>
      <div className="grid grid-cols-2 gap-3">
        {platforms.map((platform) => {
          const isSelected = selected === platform.id;
          return (
            <motion.div
              key={platform.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(platform.id)}
              className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? `bg-primary/10 border-primary/30 shadow-lg` 
                  : 'bg-background border border-border hover:bg-accent'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-2 rounded-lg ${isSelected ? `bg-primary` : 'bg-muted'}`}>
                  <platform.icon className={`w-5 h-5 ${isSelected ? `text-primary-foreground` : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">{platform.name}</p>
                  <p className="text-muted-foreground text-xs">{platform.description}</p>
                </div>
              </div>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}