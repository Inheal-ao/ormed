// Abre uma janela com uma tabela formatada e aciona a impressão.
export function printTable(title: string, subtitle: string, columns: string[], rows: (string | number)[][]) {
  const esc = (v: unknown) => String(v ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] || c));
  const head = columns.map((c) => `<th>${esc(c)}</th>`).join("");
  const body = rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("");
  const html = `<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>${esc(title)}</title>
  <style>
    *{font-family:Arial,Helvetica,sans-serif;}
    body{padding:24px;color:#111;}
    h1{font-size:18px;margin:0 0 2px;}
    p.sub{margin:0 0 16px;color:#555;font-size:13px;}
    table{width:100%;border-collapse:collapse;font-size:12px;}
    th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;}
    th{background:#002147;color:#fff;}
    tr:nth-child(even) td{background:#f5f5f5;}
    .meta{margin-top:14px;font-size:11px;color:#888;}
    @media print{body{padding:0;}}
  </style></head><body>
    <h1>${esc(title)}</h1>
    <p class="sub">${esc(subtitle)}</p>
    <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
    <p class="meta">Total: ${rows.length} · Impresso em ${new Date().toLocaleString("pt-PT")} · Ordem dos Médicos de Angola</p>
  </body></html>`;
  const w = window.open("", "_blank", "width=900,height=650");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}
