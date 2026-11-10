import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useMascot() {
  const [on, setOn] = useState(true);
  useEffect(() => { AsyncStorage.getItem('mascot').then((v) => v === '0' && setOn(false)).catch(() => {}); }, []);
  const set = (v: boolean) => { setOn(v); AsyncStorage.setItem('mascot', v ? '1' : '0').catch(() => {}); };
  return [on, set] as const;
}
