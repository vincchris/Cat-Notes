import { useCallback, useState } from 'react';

export function useToast() {
  const [msg, setMsg] = useState('');
  const toast = useCallback((m: string) => { setMsg(m); setTimeout(() => setMsg(''), 2200); }, []);
  return { msg, toast };
}
