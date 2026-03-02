'use client';

import type { CSSProperties } from 'react';

function decodeSummaryHtml(text: string): { isHtml: boolean; html: string } {
  let t = text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, '\u00A0');
  const isHtml = /<[a-z\/][^>]*>/i.test(t);
  return { isHtml, html: t };
}

export function SummaryText({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const { isHtml, html } = decodeSummaryHtml(text || '');
  if (isHtml) {
    return <div className={`summary-content ${className || ''}`} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <p className={className} style={style}>{text}</p>;
}
