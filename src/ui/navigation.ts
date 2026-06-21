// Navigation - main tabs + sub-tabs
export function setupNavigation(): void {
  // Main nav
  document.querySelectorAll<HTMLButtonElement>('#nav button').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('#nav button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      document.querySelectorAll<HTMLElement>('main > section').forEach(s => s.classList.remove('active'));
      const target = document.getElementById(b.dataset.t!);
      if (target) target.classList.add('active');
      window.scrollTo(0, 0);
    };
  });
}

// Scoped sub-navigation (for Materi and Latihan tabs)
export function setupSubnav(navSelector: string, pageSelector: string): void {
  document.querySelectorAll<HTMLButtonElement>(`${navSelector} button`).forEach(b => {
    b.onclick = () => {
      document.querySelectorAll(`${navSelector} button`).forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      document.querySelectorAll<HTMLElement>(pageSelector).forEach(p => p.classList.remove('active'));
      const id = b.dataset.m || b.dataset.l || b.dataset.k;
      if (id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
      }
    };
  });
}

// Navigate to a specific section programmatically
export function navigateTo(sectionId: string): void {
  document.querySelectorAll('#nav button').forEach(x => x.classList.remove('active'));
  const btn = document.querySelector<HTMLButtonElement>(`#nav button[data-t="${sectionId}"]`);
  if (btn) btn.classList.add('active');
  document.querySelectorAll<HTMLElement>('main > section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(sectionId);
  if (section) section.classList.add('active');
}
