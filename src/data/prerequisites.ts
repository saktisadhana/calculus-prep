// Bab 1–3 prerequisite data
export interface PrereqRef {
  anchor: string;  // DOM id
  label: string;   // display text
}

export const PRE: Record<string, PrereqRef> = {
  '1-1': { anchor: 'pre-1-1', label: '1.1 Turunan/integral eksponen & logaritma (hlm. 1)' },
  '1-2': { anchor: 'pre-1-2', label: '1.2 Invers Trigonometri (hlm. 33)' },
  '1-3': { anchor: 'pre-1-3', label: '1.3 Fungsi Hiperbolik (hlm. 54)' },
  '2-1': { anchor: 'pre-2-1', label: '2.1 Integrasi Parsial & Trigonometri (hlm. 69)' },
  '2-2': { anchor: 'pre-2-2', label: '2.2 Pecahan Parsial (hlm. 86)' },
  '2-3': { anchor: 'pre-2-3', label: '2.3 Teknik Integrasi Lain (hlm. 97)' },
  '3-1': { anchor: 'pre-3-1', label: '3.1 Integrasi Numerik (hlm. 107)' },
  '3-2': { anchor: 'pre-3-2', label: '3.2 Integral Tak Wajar (hlm. 121)' },
  '3-3': { anchor: 'pre-3-3', label: "3.3 Limit Tak Tentu / L'Hôpital (hlm. 131)" },
};
