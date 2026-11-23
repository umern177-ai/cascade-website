// Server-side sanitizer for admin-written HTML (blog content). The writers
// need real HTML (headings, paragraphs, links, images inside the text) but
// nothing that can run scripts. Strips scripts/styles/frames and every
// inline event handler / javascript: URL, keeps the formatting tags.
import "server-only";

const ALLOWED = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "a", "img",
  "h2", "h3", "h4", "blockquote", "figure", "figcaption", "hr", "span", "table",
  "thead", "tbody", "tr", "th", "td",
]);

export function sanitizeHtml(html: string): string {
  let out = html
    .replace(/<\s*(script|style|iframe|object|embed|form|input|button|link|meta)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|form|input|button|link|meta)([^>]*)>/gi, "")
    .replace(/<\s*\/\s*(script|style|iframe|object|embed|form|input|button|link|meta)\s*>/gi, "");

  // remove inline event handlers + disallowed attribute URLs
  out = out.replace(/<([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^<>]*?)?)\/?>/g, (match, tagName, attrs) => {
    const tag = tagName.toLowerCase();
    if (!ALLOWED.has(tag)) return "";
    let clean = (attrs || "")
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, "")
      .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"')
      .replace(/(href|src)\s*=\s*("|')\s*data:[^"']*\2/gi, '$1="#"');
    // target=_blank links must never hand the referrer to another origin
    if (/target\s*=\s*("|')_blank("|')/i.test(clean)) clean += ' rel="noopener noreferrer"';
    return `<${tag}${clean}>`;
  });
  return out;
}
