import type { MutableRefObject } from 'react';

export type Route = { t: 'editor'; id?: number } | { t: 'detail'; id: number };
export type TabKey = 'home' | 'notes' | 'moods' | 'cats' | 'settings';
export type Nav = {
  rev: number; bump: () => void; toast: (m: string) => void; open: (r: Route) => void; back: () => void;
  mascot: boolean; guard: MutableRefObject<(() => boolean) | null>;
};
