"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, Stethoscope, RotateCcw } from "lucide-react";
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

const STORAGE_KEY = "kamba_med_chat";

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

  // Restaura a conversa da sessão (sobrevive a navegação e recargas; expira ao fechar o navegador)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Guarda a conversa na sessão
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const userMsg: Message = { role: "user", content };
    const history = [...messages.filter((m) => m.content !== WELCOME.content), userMsg];
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

  const resetChat = () => {
    setMessages([WELCOME]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      {/* Botão flutuante (escondido quando aberto no telemóvel) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Kamba Med — Assistente de IA"
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-angola-navy to-angola-blue text-white shadow-xl shadow-angola-navy/40 flex items-center justify-center hover:scale-105 transition-transform ring-2 ring-angola-gold/40 ${
          open ? "hidden sm:flex" : "flex"
        }`}
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 text-angola-gold" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-angola-gold rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-5 z-50 w-full sm:w-[26rem] h-full sm:h-[34rem] sm:max-h-[72vh] sm:rounded-2xl shadow-2xl border-0 sm:border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden bg-white dark:bg-angola-navy"
          >
            {/* Cabeçalho com gradiente (igual nos dois modos) */}
            <div className="relative px-4 py-3.5 flex items-center gap-3 shrink-0 bg-gradient-to-r from-angola-navy via-angola-blue to-angola-navy border-b border-angola-gold/20 pt-[max(0.875rem,env(safe-area-inset-top))]">
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
              <button type="button" onClick={resetChat} aria-label="Nova conversa" className="p-1.5 hover:bg-white/10 rounded-lg text-white/70" title="Nova conversa">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar" className="p-1.5 hover:bg-white/10 rounded-lg text-white/80">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mensagens */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-angola-navy">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm ${
                      m.role === "user"
                        ? "bg-angola-gold text-angola-navy font-medium rounded-br-md"
                        : "bg-white text-gray-800 border border-gray-200 dark:bg-white/10 dark:text-gray-100 dark:border-white/10 rounded-bl-md"
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
                      className="block w-full text-left text-sm bg-white border border-gray-200 text-gray-700 dark:bg-white/5 dark:border-white/10 dark:text-gray-200 rounded-xl px-3 py-2 hover:border-angola-gold/50 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 dark:bg-white/10 dark:border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
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
              className="p-3 border-t border-gray-200 dark:border-white/10 flex items-center gap-2 shrink-0 bg-white dark:bg-angola-navy pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva a sua pergunta..."
                className="flex-1 px-3.5 py-2.5 text-sm rounded-full outline-none bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 dark:bg-white/10 dark:border-white/15 dark:text-white dark:placeholder:text-white/40 focus:border-angola-gold"
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
