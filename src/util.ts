// Shared small helpers used across UI modules.
export function pad2(n: number): string { return String(n).padStart(2, '0'); }

export function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const dfmt = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const tfmt = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' });
