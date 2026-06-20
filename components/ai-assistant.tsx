"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, Bot } from "lucide-react";
import { api } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "O que é a Ordem dos Médicos de Angola?",
  "Como me inscrevo na Ordem?",
  "Quais são os próximos eventos?",
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Olá! 👋 Sou o Assistente de IA da ORMED. Posso responder a perguntas sobre a Ordem, resumir comunicados e artigos, e dar respostas rápidas. Como posso ajudar?",
};

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const userMsg: Message = { role: "user", content };
    const history = [...messages.filter((m) => m !== WELCOME), userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post<{ reply: string }>("/assistant/chat", {
        messages: history.map((m) => ({ role: m.role, content: m.content })),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Desculpe, ocorreu um erro. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Assistente de IA"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-angola-navy text-white shadow-xl shadow-angola-navy/30 flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 text-angola-gold" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-angola-gold rounded-full border-2 border-white" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-96 h-[32rem] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Cabeçalho */}
            <div className="bg-angola-navy text-white px-4 py-3 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-angola-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Assistente ORMED</p>
                <p className="text-xs text-white/60">Inteligência Artificial</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar" className="p-1.5 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mensagens */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-angola-navy text-white rounded-br-md"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Sugestões iniciais */}
              {messages.length === 1 && !loading && (
                <div className="space-y-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="block w-full text-left text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-700 hover:border-angola-gold hover:bg-angola-cream/40 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-angola-gold" />
                  </div>
                </div>
              )}
            </div>

            {/* Entrada */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-gray-200 flex items-center gap-2 shrink-0"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva a sua pergunta..."
                className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-full outline-none focus:border-angola-gold text-gray-900"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Enviar"
                className="w-10 h-10 rounded-full bg-angola-gold text-angola-navy flex items-center justify-center hover:brightness-95 disabled:opacity-50 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
