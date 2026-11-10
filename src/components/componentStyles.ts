import { StyleSheet } from 'react-native';
import { C, R, shadow } from '../theme/tokens';

export const s = StyleSheet.create({
  btn: { minHeight: 48, paddingHorizontal: 20, borderRadius: R.l, alignItems: 'center', justifyContent: 'center' },
  btnT: { color: C.ink, fontWeight: '700', fontSize: 16 },
  chip: { minHeight: 40, paddingHorizontal: 14, borderRadius: R.l, borderWidth: 1.5, justifyContent: 'center', marginRight: 8 },
  card: { borderRadius: R.m, padding: 16, ...shadow },
  h: { fontSize: 22, fontWeight: '800', color: C.ink },
});
