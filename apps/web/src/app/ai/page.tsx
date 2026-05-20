"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { SiteLogo } from "@/components/layout/site-logo";
import { PageShell } from "@/components/layout/section-background";
import { api } from "@/lib/api-client";

type Message = { role: "user" | "assistant"; content: string };

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Namaste! Ask me anything about Pawan Kalyan — his journey, his impact, his legacy." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const data = await api.chat(userMsg, messages.slice(-6));
      setMessages((m) => [...m, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I'm having trouble right now." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell background="home" overlay="dark">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <FadeIn className="text-center mb-8">
          <SiteLogo size={56} className="mx-auto mb-3" />
          <h1 className="font-display text-4xl tracking-wide drop-shadow-lg">Ask</h1>
          <p className="mt-2 text-white/70 text-sm">Chat about Pawan Kalyan</p>
        </FadeIn>
        <Card className="min-h-[60vh] flex flex-col glass-card border-white/15">
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[60vh]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${msg.role === "user" ? "bg-brand-red text-white" : "bg-secondary/80 backdrop-blur-sm"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </CardContent>
          <form onSubmit={sendMessage} className="flex gap-2 p-4 border-t border-white/10">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." className="flex-1 bg-black/30 border-white/15" />
            <Button type="submit" disabled={loading}><Send className="h-4 w-4" /></Button>
          </form>
        </Card>
      </div>
    </PageShell>
  );
}
