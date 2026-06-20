"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, Stethoscope } from "lucide-react";
import { api } from "@/lib/api";
import { SimpleMarkdown } from "@/components/simple-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "O que é a Ordem dos Médicos de Angola?",
  "Onde fica a sede e como vos contacto?",
  "Resume a página que estou a ver",
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Olá! 👋 Sou o **Kamba Med**, o assistente de IA da ORMED. Posso responder às suas perguntas, dar informações sobre a Ordem e **resumir** o que está a ler no site. Em que posso ajudar?",
};

/** Captura o texto principal da página atual (para o assistente resumir/responder). */
function getPageContext(): string {
  if (typeof document === "undefined") return "";
  const main = document.querySelector("main");
  const text = (main?.innerText || "").replace(/\s+\n/g, "\n").trim();
  return text.slice(0, 14000);
}

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
        pageContext: getPageContext(),
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
        aria-label="Kamba Med — Assistente de IA"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-angola-navy to-angola-blue text-white shadow-xl shadow-angola-navy/40 flex items-center justify-center hover:scale-105 transition-transform ring-2 ring-angola-gold/40"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 text-angola-gold" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-angola-gold rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[26rem] h-[34rem] max-h-[72vh] rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden bg-gradient-to-b from-angola-navy to-[#000d1f]"
          >
            {/* Cabeçalho com gradiente */}
            <div className="relative px-4 py-3.5 flex items-center gap-3 shrink-0 bg-gradient-to-r from-angola-navy via-angola-blue to-angola-navy border-b border-angola-gold/20">
              <div className="w-10 h-10 rounded-full bg-angola-gold flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 text-angola-navy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm flex items-center gap-1.5">
                  Kamba Med
                  <Sparkles className="w-3.5 h-3.5 text-angola-gold" />
                </p>
                <p className="text-xs text-white/60">Assistente de IA · ORMED</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar" className="p-1.5 hover:bg-white/10 rounded-lg text-white/80">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mensagens */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm ${
                      m.role === "user"
                        ? "bg-angola-gold text-angola-navy font-medium rounded-br-md"
                        : "bg-white/10 text-gray-100 border border-white/10 rounded-bl-md"
                    }`}
                  >
                    {m.role === "assistant" ? <SimpleMarkdown text={m.content} /> : m.content}
                  </div>
                </div>
              ))}

              {messages.length === 1 && !loading && (
                <div className="space-y-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="block w-full text-left text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-gray-200 hover:bg-white/10 hover:border-angola-gold/40 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
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
              className="p-3 border-t border-white/10 flex items-center gap-2 shrink-0 bg-black/20"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva a sua pergunta..."
                className="flex-1 px-3.5 py-2.5 text-sm bg-white/10 border border-white/15 rounded-full outline-none focus:border-angola-gold text-white placeholder:text-white/40"
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
