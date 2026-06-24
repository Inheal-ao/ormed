"use client";

import { Printer, Download } from "lucide-react";

/** Constrói o URL público de verificação do médico (destino do QR). */
export function verifyUrl(numeroOrdem: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/medico/${encodeURIComponent(numeroOrdem)}`;
}
/** QR gerado por API gratuita (qrserver). */
export function qrSrc(numeroOrdem: string, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(verifyUrl(numeroOrdem))}`;
}

/** Cartão com o QR do médico para receitas eletrónicas. */
export function MedicoQr({ numeroOrdem, name, especialidade, size = 200 }: {
  numeroOrdem: string; name: string; especialidade?: string; size?: number;
}) {
  const url = verifyUrl(numeroOrdem);
  const print = () => {
    const w = window.open("", "_blank", "width=480,height=620");
    if (!w) return;
    const logo = `${window.location.origin}/images/logo.svg`;
    w.document.write(`<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>QR — ${name}</title>
    <style>body{font-family:Arial,Helvetica,sans-serif;text-align:center;color:#111;margin:24px}
    img.logo{height:48px;margin-bottom:6px}.org{font-size:12px;color:#002147;font-weight:bold}
    .name{font-size:16px;font-weight:bold;margin-top:10px}.esp{font-size:13px;color:#555}
    .ordem{font-family:monospace;font-size:12px;color:#888;margin-top:2px}
    img.qr{margin:14px auto;display:block}.url{font-size:10px;color:#999;word-break:break-all}</style></head><body>
    <img class="logo" src="${logo}" alt="ORMED" onerror="this.style.display='none'"/>
    <div class="org">ORDEM DOS MÉDICOS DE ANGOLA</div>
    <div class="name">${name}</div>${especialidade ? `<div class="esp">${especialidade}</div>` : ""}
    <div class="ordem">Nº de Ordem: ${numeroOrdem}</div>
    <img class="qr" src="${qrSrc(numeroOrdem, 240)}" width="240" height="240" alt="QR"/>
    <div class="url">${url}</div>
    <script>window.onload=function(){setTimeout(function(){window.print()},400)}</script></body></html>`);
    w.document.close();
  };

  return (
    <div className="text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrSrc(numeroOrdem, size)} width={size} height={size} alt={`QR de ${name}`} className="mx-auto rounded-lg border border-gray-200" />
      <p className="text-[11px] text-gray-400 mt-2 break-all">{url}</p>
      <div className="flex justify-center gap-2 mt-3">
        <button type="button" onClick={print} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-angola-navy text-white rounded-lg hover:brightness-110"><Printer className="w-3.5 h-3.5" /> Imprimir</button>
        <a href={qrSrc(numeroOrdem, 600)} download={`qr-${numeroOrdem}.png`} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"><Download className="w-3.5 h-3.5" /> Baixar PNG</a>
      </div>
    </div>
  );
}
