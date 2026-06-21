// MathJax typesetting wrapper
declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: HTMLElement[]) => Promise<void>;
      startup?: { typeset: boolean };
    };
  }
}

export function typeset(el?: HTMLElement): void {
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise(el ? [el] : undefined).then(() => {
      // Inject original TeX into a data-tex attribute so we can recover it later.
      const doc = (window as any).MathJax?.startup?.document;
      if (doc && doc.math) {
        for (const m of doc.math) {
          if (m.typesetRoot && (!el || el.contains(m.typesetRoot))) {
            m.typesetRoot.setAttribute('data-tex', m.math);
          }
        }
      }
    }).catch(() => { /* noop */ });
  }
}
