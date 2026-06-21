// Theme toggle - dark/light
const TKEY = 'kalk2_theme';

export function applyTheme(t: string): void {
  document.documentElement.dataset.theme = t;
  localStorage.setItem(TKEY, t);
}

export function getTheme(): string {
  return localStorage.getItem(TKEY) || 'dark';
}

export function setupTheme(): void {
  const theme = getTheme();
  applyTheme(theme);
  const sel = document.getElementById('themeSel') as HTMLSelectElement | null;
  if (sel) {
    sel.value = theme;
    sel.onchange = () => applyTheme(sel.value);
  }
}
