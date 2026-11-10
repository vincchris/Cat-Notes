import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import type { Route, TabKey } from './types';

export function useAppNavigation() {
  const [tab, setTab] = useState<TabKey>('home');
  const [catId, setCatId] = useState<number | undefined>();
  const [stack, setStack] = useState<Route[]>([]);
  const guard = useRef<(() => boolean) | null>(null); // lets the editor veto "back" when there are unsaved changes
  const back = useCallback(() => {
    if (guard.current && !guard.current()) return true;
    if (stack.length) { setStack((s) => s.slice(0, -1)); return true; }
    return false;
  }, [stack.length]);
  useEffect(() => { const h = BackHandler.addEventListener('hardwareBackPress', back); return () => h.remove(); }, [back]);
  return {
    tab, catId, top: stack[stack.length - 1], guard, back,
    open: (r: Route) => setStack((s) => [...s, r]),
    selectTab: (k: TabKey, cat?: number) => { setCatId(cat); setTab(k); },
  };
}
