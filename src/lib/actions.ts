import type { Nav } from '../navigation/types';
import { Alert } from './alert';

export const confirm = (title: string, msg: string, ok: string, onOk: () => void) =>
  Alert.alert(title, msg, [{ text: 'Keep it', style: 'cancel' }, { text: ok, style: 'destructive', onPress: onOk }]);

/** Runs a DB action, refreshes data, shows a toast; shows an alert on failure. */
export const run = async (n: Nav, fn: () => Promise<any>, done?: string) => {
  try { await fn(); n.bump(); if (done) n.toast(done); return true; }
  catch (e: any) { Alert.alert('Could not save', String(e?.message ?? e)); return false; }
};
