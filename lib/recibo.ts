// Recibo de pagamento de cotas (com a logo da Ordem) — impressão automática.
export interface ReciboData {
  recibo: string; memberName: string; numeroOrdem?: string;
  meses: string[]; cotaMensal: number; multaMensal: number; total: number;
}

const MESES = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
export function mesLabel(m: string): string {
  const [y, mm] = m.split("-");
  return `${MESES[Number(mm)] ?? mm}/${y}`;
}
export function kz(v: number): string {
  return new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", maximumFractionDigits: 2 }).format(v || 0);
}

export function printRecibo(d: ReciboData) {
  const w = window.open("", "_blank", "width=620,height=760");
  if (!w) return;
  const logo = `${window.location.origin}/images/logo.svg`;
  const esc = (s: string) => (s || "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));
  const linhas = d.meses.map((m) => `<tr><td>${esc(mesLabel(m))}</td><td style="text-align:right">${kz(d.cotaMensal)}</td><td style="text-align:right">${kz(d.multaMensal)}</td><td style="text-align:right">${kz(d.cotaMensal + d.multaMensal)}</td></tr>`).join("");
  w.document.write(`<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Recibo ${esc(d.recibo)}</title>
  <style>body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:28px;max-width:640px}
  .head{display:flex;align-items:center;gap:12px;border-bottom:2px solid #FFD700;padding-bottom:10px}
  .head img{height:54px}.org{font-size:13px;color:#002147;font-weight:bold}
  h1{font-size:18px;margin:14px 0 2px}.sub{color:#555;font-size:12px;margin:0 0 14px}
  .meta{font-size:13px;margin:3px 0}
  table{width:100%;border-collapse:collapse;margin-top:12px;font-size:13px}
  th,td{border:1px solid #ccc;padding:6px 8px}th{background:#002147;color:#fff;text-align:left}
  .total{margin-top:12px;text-align:right;font-size:16px;font-weight:bold;color:#002147}
  .foot{margin-top:30px;font-size:11px;color:#888;text-align:center}</style></head><body>
  <div class="head"><img src="${logo}" alt="ORMED" onerror="this.style.display='none'"/><span class="org">ORDEM DOS MÉDICOS DE ANGOLA</span></div>
  <h1>Recibo de Pagamento de Cotas</h1>
  <p class="sub">Recibo Nº ${esc(d.recibo)} · Emitido em ${new Date().toLocaleString("pt-PT")}</p>
  <p class="meta"><b>Médico:</b> ${esc(d.memberName)}${d.numeroOrdem ? ` &nbsp; <b>Nº de Ordem:</b> ${esc(d.numeroOrdem)}` : ""}</p>
  <p class="meta"><b>Meses pagos:</b> ${d.meses.length}</p>
  <table><thead><tr><th>Mês</th><th style="text-align:right">Cota</th><th style="text-align:right">Multa</th><th style="text-align:right">Subtotal</th></tr></thead>
  <tbody>${linhas}</tbody></table>
  <p class="total">Total pago: ${kz(d.total)}</p>
  <p class="foot">Documento emitido pela Ordem dos Médicos de Angola.</p>
  <script>window.onload=function(){setTimeout(function(){window.print()},400)}</script></body></html>`);
  w.document.close();
}
