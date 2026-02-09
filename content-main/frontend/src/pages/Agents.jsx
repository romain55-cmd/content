import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AgentPicker from "@/components/agents/AgentPicker";
import MessageBubble from "@/components/agents/MessageBubble";
import { AlertCircle, Send, Sparkles } from "lucide-react";
import apiClient from "@/api/apiClient"; // Using the main apiClient
import PromptChips from "@/components/agents/PromptChips";

// This is the new, simplified agent page.
const agentNamesMap = {
  content_strategist: "Контент-стратег",
  calendar_planner: "Планировщик календаря",
  analytics_researcher: "Аналитик-исследователь",
  qa_tester: "Тестировщик качества",
};

export default function Agents() {
  const [agentName, setAgentName] = useState("content_strategist");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // Set an initial welcome message when the agent changes
  useEffect(() => {
    const translatedAgentName = agentNamesMap[agentName] || agentName.replace('_', ' ');
    setMessages([
      { role: 'assistant', content: `Привет! Я ваш AI-агент "${translatedAgentName}". Чем могу помочь?` }
    ]);
  }, [agentName]);

const handleInsertAndSend = (text) => {
    setInput(text);
    // Use a short timeout to allow the input to render before sending
    setTimeout(() => handleSend(text), 0);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || busy) return;

    setBusy(true);
    setError(null);

    // Optimistically display user's message
    const userMessage = { role: "user", content: text };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput("");

    try {
      // Send the current conversation history (excluding the system prompt)
      // and the new prompt to the backend.
      const history = currentMessages.filter(m => m.role !== 'system');
      
      const { data } = await apiClient.post('/ai/chat', {
        prompt: text,
        history: history,
        agentName: agentName
      });

      // Add the AI's response to the message list
      const aiMessage = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, aiMessage]);

    } catch (e) {
      console.error("Agent send error:", e);
      setError(`Не удалось отправить сообщение. ${e?.message || "Пожалуйста, попробуйте снова."}`);
      // Optional: remove the optimistic user message on failure
      setMessages(messages);
    } finally {
      setBusy(false);
    }
  };

  const starterPrompt = useMemo(() => {
    switch (agentName) {
      case "content_strategist":
        return "Помоги мне спланировать контент на эту неделю.";
      case "calendar_planner":
        return "Создай график публикаций на следующие 2 недели.";
      case "analytics_researcher":
        return "Проанализируй мои последние посты.";
      default:
        return "Привет!";
    }
  }, [agentName]);

  return (
    <div className="p-6 lg:p-8">
      <Helmet>
        <title>AI Агенты - Impulse AI</title>
        {/* Top.Mail.Ru counter */}
        <script type="text/javascript">
          {`
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "3724112", type: "pageView", start: (new Date()).getTime()});
            (function (d, w, id) {
              if (d.getElementById(id)) return;
              var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
              ts.src = "https://top-fwz1.mail.ru/js/code.js";
              var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
              if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
            })(document, window, "tmr-code");
          `}
        </script>
        <noscript>
          {`
            <div><img src="https://top-fwz1.mail.ru/counter?id=3724112;js=na" style="position:absolute;left:-9999px;" alt="Top.Mail.Ru" /></div>
          `}
        </noscript>
        {/* /Top.Mail.Ru counter */}
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Студия агентов</h1>
        </div>

        <Card className="bg-card border-border backdrop-blur-xl">
          <CardHeader className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <CardTitle className="text-foreground">Чат с агентом</CardTitle>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <AgentPicker value={agentName} onChange={setAgentName} />
              <Button onClick={() => setMessages([])} variant="outline" className="bg-card border-border text-foreground">
                Новый разговор
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <PromptChips onInsertAndSend={handleInsertAndSend} />

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-foreground">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="rounded-xl border border-border bg-accent/50 p-3 h-[420px] overflow-auto">
              {messages.length === 0 ? (
                <div className="text-foreground/70 text-sm">
                  Попробуйте спросить: “{starterPrompt}”
                </div>
              ) : (
                messages.map((m, idx) => <MessageBubble key={idx} message={m} />)
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Напишите ваше сообщение..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSend(); } }}
                autoFocus
                className="flex-1"
                aria-label="Message input"
              />
              <Button
                onClick={handleSend}
                disabled={busy || !input.trim()}
                aria-label="Отправить сообщение"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <Send className="w-4 h-4 mr-2" /> {busy ? "Отправка..." : "Отправить"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
