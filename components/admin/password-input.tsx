"use client";

import { useState } from "react";
import { Eye, EyeOff, Wand2, Copy, Check } from "lucide-react";
import { passwordStrength, generateStrongPassword } from "@/lib/password";

const BAR_COLORS = ["bg-red-500", "bg-red-400", "bg-amber-400", "bg-lime-500", "bg-green-600"];

export function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  showGenerator = true,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  showGenerator?: boolean;
}) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const s = passwordStrength(value);

  const gen = () => {
    const pw = generateStrongPassword(14);
    onChange(pw);
    setShow(true);
  };

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm"
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {value && (
            <button type="button" onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="p-1.5 text-gray-400 hover:text-gray-700" aria-label="Copiar">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
          <button type="button" onClick={() => setShow((v) => !v)} className="p-1.5 text-gray-400 hover:text-gray-700" aria-label="Mostrar/ocultar">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {value && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full transition-all ${BAR_COLORS[s.score]}`} style={{ width: `${(s.score + 1) * 20}%` }} />
          </div>
          <span className="text-xs text-gray-500 w-20 text-right">{s.label}</span>
        </div>
      )}

      {showGenerator && (
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-gray-400">Mín. 8: maiúscula, minúscula, número e símbolo.</p>
          <button type="button" onClick={gen} className="inline-flex items-center gap-1 text-xs text-angola-blue hover:underline">
            <Wand2 className="w-3.5 h-3.5" /> Gerar forte
          </button>
        </div>
      )}
    </div>
  );
}
