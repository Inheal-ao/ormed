"use client";

import React from "react";

/** Converte **negrito** e `código` num fragmento JSX. */
function inline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      nodes.push(<strong key={key++} className="font-semibold">{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      nodes.push(<code key={key++} className="px-1 py-0.5 rounded bg-black/20 text-xs">{m[3]}</code>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/**
 * Renderizador de markdown leve para as respostas do assistente.
 * Suporta negrito, listas (- ou *), cabeçalhos simples e parágrafos.
 */
export function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let bk = 0;

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`l${bk++}`} className="list-disc pl-5 space-y-1 my-2">
        {list.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    const bullet = line.match(/^[*-]\s+(.*)$/);
    if (bullet) {
      list.push(bullet[1]);
      continue;
    }
    flushList();
    const heading = line.match(/^#{1,4}\s+(.*)$/);
    if (heading) {
      blocks.push(
        <p key={`h${bk++}`} className="font-semibold mt-2">{inline(heading[1])}</p>,
      );
    } else {
      blocks.push(
        <p key={`p${bk++}`} className="my-1 leading-relaxed">{inline(line)}</p>,
      );
    }
  }
  flushList();

  return <div className="space-y-0.5">{blocks}</div>;
}
