import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const toneOptions = [
  { value: "professional", label: "Профессиональный" },
  { value: "conversational", label: "Разговорный" },
  { value: "inspiring", label: "Вдохновляющий" },
  { value: "authoritative", label: "Авторитетный" },
  { value: "friendly", label: "Дружелюбный" },
  { value: "bold", label: "Смелый" }
];

export default function GenerationOptions({ 
  tone, 
  onToneChange, 
  audience, 
  onAudienceChange, 
  userProfile 
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-foreground font-medium">Tone</label>
        <Select value={tone} onValueChange={onToneChange}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите тон" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {toneOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {userProfile?.target_audiences && userProfile.target_audiences.length > 0 && (
        <div className="space-y-2">
          <label className="text-foreground font-medium">Целевая аудитория</label>
          <Select value={audience} onValueChange={onAudienceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите аудиторию" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {userProfile.target_audiences.map((aud) => (
                <SelectItem 
                  key={aud.name} 
                  value={aud.name}
                >
                  {aud.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}