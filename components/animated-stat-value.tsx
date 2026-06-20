"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Anima a contagem da parte numérica de um valor (ex.: "12.500+", "98%").
 * Preserva o sufixo/prefixo não numérico.
 */
export function AnimatedStatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const prefix = match[1];
    const target = parseInt(match[2].replace(/[.,\s]/g, ""), 10);
    const suffix = match[3];

    if (!inView || isNaN(target)) {
      // Antes de entrar em vista, mostra 0 (ou o valor se não numérico)
      if (!isNaN(target)) setDisplay(`${prefix}0${suffix}`);
      return;
    }

    let current = 0;
    const duration = 1600;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplay(`${prefix}${target.toLocaleString("pt-AO")}${suffix}`);
        clearInterval(timer);
      } else {
        setDisplay(`${prefix}${Math.floor(current).toLocaleString("pt-AO")}${suffix}`);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}
