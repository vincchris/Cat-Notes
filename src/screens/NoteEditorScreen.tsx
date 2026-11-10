import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import * as DB from '../db';
import { Mood, MOODS, MOOD_ICON, dayKey } from '../db';
import { C, CAT_COLORS, NOTE_COLORS } from '../theme/tokens';
import { st } from '../theme/styles';
import { Alert } from '../lib/alert';
import { confirm, run } from '../lib/actions';
import { fmt } from '../lib/format';
import { useQuery } from '../hooks/useQuery';
import type { Nav } from '../navigation/types';
import { Btn, Card, Cat, Chip, Empty, ErrorBox, H, Loading, Muted, NoteCard } from '../components';

// ---------------- Note editor ----------------
export function NoteEditorScreen({ id, nav }: { id?: number; nav: Nav }) {
  const existing = useQuery(() => (id ? DB.getNote(id) : Promise.resolve(null)), [id]);
  const cats = useQuery(DB.listCategories, [nav.rev]);
  const [f, setF] = useState<any>(null); const init = useRef('');
  const [err, setErr] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (existing.loading) return;
    const n = existing.data;
    const v = { title: n?.title ?? '', content: n?.content ?? '', cat: n?.category_id ?? null, mood: n?.mood ?? null, color: n?.color ?? null, fav: !!n?.is_favorite, pin: !!n?.is_pinned, unlock: n?.unlock_at ? dayKey(new Date(n.unlock_at)) : '' };
    init.current = JSON.stringify(v); setF(v);
  }, [existing.loading]);
  const dirty = f && JSON.stringify(f) !== init.current;
  nav.guard.current = () => {
    if (!dirty || saving) return true;
    Alert.alert('Discard changes?', 'Your edits have not been saved.', [{ text: 'Keep editing', style: 'cancel' }, { text: 'Discard', style: 'destructive', onPress: () => { nav.guard.current = null; nav.back(); } }]);
    return false;
  };
  useEffect(() => () => { nav.guard.current = null; }, []);
  if (!f) return <Loading />;
  const locked = !!existing.data?.locked;
  const set = (k: string, v: any) => { setErr(''); setF({ ...f, [k]: v }); };
  const plusDays = (d: number) => { const x = new Date(); x.setDate(x.getDate() + d); set('unlock', dayKey(x)); };
  const save = async () => {
    if (saving) return;
    let unlock_at: string | null = null;
    if (f.unlock.trim()) {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f.unlock.trim()); const d = m && new Date(+m[1], +m[2] - 1, +m[3]);
      if (!d || isNaN(+d) || dayKey(d) !== f.unlock.trim()) return setErr('Unlock date must look like 2026-12-31.');
      unlock_at = d.toISOString();
    }
    setSaving(true);
    try {
      await DB.saveNote({ id, title: f.title, content: f.content, category_id: f.cat, mood: f.mood, color: f.color, is_favorite: f.fav, is_pinned: f.pin, unlock_at });
      nav.guard.current = null; nav.bump(); nav.toast('Saved. Your cat is purring.'); nav.back();
    } catch (e: any) { setErr(String(e?.message ?? e)); setSaving(false); }
  };
  const words = f.content.trim() ? f.content.trim().split(/\s+/).length : 0;
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={st.pad} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {nav.mascot && <Cat state={err ? 'error' : 'writing'} size={36} />}
          <Text style={{ color: err ? C.danger : C.muted, flex: 1 }} accessibilityLiveRegion="polite">{err || (id ? 'Editing note' : 'New note')}</Text></View>
        <TextInput accessibilityLabel="Title" placeholder="Title" placeholderTextColor={C.muted} value={f.title} onChangeText={(v) => set('title', v)} maxLength={120} style={[st.input, { marginTop: 12, fontSize: 18, fontWeight: '700' }]} />
        {locked ? <Card color={C.lav} style={{ marginTop: 12 }}><Text style={{ color: C.ink }}>🔒 This capsule is sealed, so its text is hidden and can't be changed until it opens. You can still edit the other fields or clear the unlock date below.</Text></Card>
          : <TextInput accessibilityLabel="Content" placeholder="Write something..." placeholderTextColor={C.muted} multiline value={f.content} onChangeText={(v) => set('content', v)} style={[st.input, { marginTop: 12, minHeight: 160, textAlignVertical: 'top' }]} />}
        {!locked && <Muted>{words} {words === 1 ? 'word' : 'words'}, {f.content.length} characters</Muted>}
        <Text style={st.section}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip label="None" on={!f.cat} onPress={() => set('cat', null)} />
          {cats.data?.map((c) => <Chip key={c.id} color={c.color} on={f.cat === c.id} label={`${c.icon} ${c.name}`} onPress={() => set('cat', c.id)} />)}</ScrollView>
        <Text style={st.section}>Mood</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MOODS.map((m) => <Chip key={m} on={f.mood === m} label={`${MOOD_ICON[m]} ${m}`} onPress={() => set('mood', f.mood === m ? null : m)} />)}</ScrollView>
        <Text style={st.section}>Color</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {NOTE_COLORS.map((c: string, i: number) => <Pressable key={c} accessibilityRole="button" accessibilityLabel={`Note color ${i + 1}`} accessibilityState={{ selected: (f.color ?? C.card) === c }}
            onPress={() => set('color', c === C.card ? null : c)} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c, borderWidth: (f.color ?? C.card) === c ? 3 : 1.5, borderColor: (f.color ?? C.card) === c ? C.ink : C.line }} />)}</View>
        <View style={st.row}><Text style={st.lbl}>Favorite</Text><Switch value={f.fav} onValueChange={(v) => set('fav', v)} accessibilityLabel="Favorite" /></View>
        <View style={st.row}><Text style={st.lbl}>Pin to home</Text><Switch value={f.pin} onValueChange={(v) => set('pin', v)} accessibilityLabel="Pin" /></View>
        <Text style={st.section}>Time capsule (optional)</Text>
        <Muted>Hide this note's text until a date. Leave empty for a normal note.</Muted>
        <TextInput accessibilityLabel="Unlock date" placeholder="YYYY-MM-DD" placeholderTextColor={C.muted} value={f.unlock} onChangeText={(v) => set('unlock', v)} style={[st.input, { marginTop: 8 }]} />
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Chip label="+1 week" onPress={() => plusDays(7)} /><Chip label="+1 month" onPress={() => plusDays(30)} /><Chip label="Clear" onPress={() => set('unlock', '')} /></View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
          <Btn kind="soft" label="Cancel" onPress={() => nav.back()} style={{ flex: 1 }} />
          <Btn label={saving ? 'Saving...' : 'Save note'} onPress={save} style={{ flex: 2 }} /></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
