import { StyleSheet } from 'react-native';
import { C, R } from './tokens';

export const st = StyleSheet.create({
  pad: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: C.ink, lineHeight: 30 },
  sub: { fontSize: 16, fontWeight: '700', color: C.ink },
  section: { fontSize: 17, fontWeight: '700', color: C.ink, marginTop: 20, marginBottom: 8 },
  input: { backgroundColor: C.card, borderRadius: R.m, borderWidth: 1.5, borderColor: C.line, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: C.ink, minHeight: 48 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48, marginTop: 8 },
  lbl: { fontSize: 16, color: C.ink },
});
