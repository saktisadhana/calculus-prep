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
    window.MathJax.typesetPromise(el ? [el] : undefined).catch(() => { /* noop */ });
  }
}
