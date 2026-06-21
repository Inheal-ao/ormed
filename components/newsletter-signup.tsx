"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api";
import { Turnstile, captchaEnabled, captchaHeaders } from "@/components/turnstile";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (captchaEnabled && !captchaToken) {
      setError("Complete a verificação anti-spam.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...captchaHeaders(captchaToken) },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(Array.isArray(err.message) ? err.message.join(", ") : err.message || "Falha ao subscrever.");
      }
      setDone(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao subscrever.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 text-angola-gold font-medium">
        <Check className="w-5 h-5" />
        Subscrição confirmada. Obrigado!
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col w-full lg:w-auto gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="O seu email"
          className="flex-1 lg:w-80 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-angola-gold"
        />
        <Button type="submit" disabled={loading} className="bg-angola-gold text-angola-navy hover:bg-angola-gold/90 font-semibold px-6">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscrever"}
        </Button>
      </div>
      <Turnstile onToken={setCaptchaToken} />
      {error && <p className="text-xs text-red-300">{error}</p>}
    </form>
  );
}
