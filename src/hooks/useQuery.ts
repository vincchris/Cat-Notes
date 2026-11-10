import { useEffect, useState } from 'react';

export function useQuery<T>(fn: () => Promise<T>, deps: any[]) {
  const [s, set] = useState<{ data?: T; error?: string; loading: boolean }>({ loading: true });
  useEffect(() => {
    let ok = true;
    fn().then((data) => ok && set({ data, loading: false }), (e) => ok && set({ error: String(e?.message ?? e), loading: false }));
    return () => { ok = false; };
  }, deps);
  return s;
}
