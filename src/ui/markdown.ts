// Minimal, safe Markdown -> HTML renderer for AI responses.
//
// LaTeX ($...$, $$...$$, \(...\), \[...\]) and code spans are pulled out and
// stashed BEFORE any Markdown processing, so underscores/asterisks/backticks
// inside math are never treated as Markdown. MathJax typesets the restored
// math afterward (it reads textContent, so escaped entities decode fine).

const escAll = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Body escape: keep '>' so blockquote markers survive; '<' still neutralized.
const escBody = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function inline(s: string): string {
  // links [text](url)
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // bold then italic (bold first so ** isn't eaten by *)
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  s = s.replace(/(^|[^A-Za-z0-9])_([^_\n]+)_(?=[^A-Za-z0-9]|$)/g, '$1<em>$2</em>');
  return s;
}

export function renderMarkdown(src: string): string {
  const stash: string[] = [];
  const keep = (html: string): string => `${stash.push(html) - 1}`;

  let s = (src || '').replace(/\r\n/g, '\n');

  // 1) Fenced code blocks
  s = s.replace(/```[\w-]*\n?([\s\S]*?)```/g, (_, code) =>
    keep(`<pre class="md-pre"><code>${escAll(String(code).replace(/\n$/, ''))}</code></pre>`));
  // 2) Display math
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => keep(`$$${escAll(m)}$$`));
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => keep(`\\[${escAll(m)}\\]`));
  // 3) Inline math
  s = s.replace(/\$([^\n$]+?)\$/g, (_, m) => keep(`$${escAll(m)}$`));
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => keep(`\\(${escAll(m)}\\)`));
  // 4) Inline code
  s = s.replace(/`([^`\n]+)`/g, (_, c) => keep(`<code class="md-code">${escAll(c)}</code>`));

  // 5) Escape remaining body text
  s = escBody(s);

  // 6) Block-level parse
  const lines = s.split('\n');
  const out: string[] = [];
  let i = 0;
  let listType: 'ul' | 'ol' | null = null;
  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };
  const isSpecial = (l: string) =>
    /^(#{1,6}\s|\s*[-*+]\s|\s*\d+[.)]\s|\s*>\s?|\s*(---|\*\*\*|___)\s*$)/.test(l);

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) { closeList(); out.push('<hr>'); i++; continue; }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { closeList(); const lvl = h[1].length; out.push(`<h${lvl} class="md-h">${inline(h[2])}</h${lvl}>`); i++; continue; }

    if (/^\s*>\s?/.test(line)) {
      closeList();
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) { quote.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
      out.push(`<blockquote class="md-quote">${inline(quote.join(' '))}</blockquote>`);
      continue;
    }

    const ul = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ul) { if (listType !== 'ul') { closeList(); out.push('<ul class="md-ul">'); listType = 'ul'; } out.push(`<li>${inline(ul[1])}</li>`); i++; continue; }

    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ol) { if (listType !== 'ol') { closeList(); out.push('<ol class="md-ol">'); listType = 'ol'; } out.push(`<li>${inline(ol[1])}</li>`); i++; continue; }

    if (/^\s*$/.test(line)) { closeList(); i++; continue; }

    // paragraph: gather consecutive plain lines
    closeList();
    const para: string[] = [line];
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !isSpecial(lines[i])) { para.push(lines[i]); i++; }
    out.push(`<p>${inline(para.join('<br>'))}</p>`);
  }
  closeList();

  // 7) Restore stashed math/code
  return out.join('\n').replace(/(\d+)/g, (_, n) => stash[+n]);
}
