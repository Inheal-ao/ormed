"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

/** Se o CAPTCHA está ativo (chave configurada). */
export const captchaEnabled = !!SITE_KEY;

/** Cabeçalho a juntar aos pedidos quando há token. */
export function captchaHeaders(token: string): Record<string, string> {
  return token ? { "x-captcha-token": token } : {};
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

/** Widget Cloudflare Turnstile. Não renderiza nada se a chave não estiver definida. */
export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onToken);
  cb.current = onToken;

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !ref.current || ref.current.dataset.rendered || !window.turnstile) return;
      ref.current.dataset.rendered = "1";
      window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        callback: (t: string) => cb.current(t),
        "expired-callback": () => cb.current(""),
        "error-callback": () => cb.current(""),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      const id = "cf-turnstile-script";
      if (!document.getElementById(id)) {
        const s = document.createElement("script");
        s.id = id;
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.defer = true;
        s.onload = render;
        document.head.appendChild(s);
      } else {
        const t = setInterval(() => {
          if (window.turnstile) {
            clearInterval(t);
            render();
          }
        }, 200);
        return () => {
          cancelled = true;
          clearInterval(t);
        };
      }
    }
    return () => {
      cancelled = true;
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={ref} className="my-3" />;
}
