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

// ---------------- Categories ----------------
export function CategoriesScreen({ nav }: { nav: Nav }) {
  const r = useQuery(DB.listCategories, [nav.rev]);
  const [edit, setEdit] = useState<{ id?: number; name: string; icon: string; color: string } | null>(null);
  const [err, setErr] = useState('');
  const del = (c: DB.Category) => {
    if (!c.note_count) return confirm('Delete category?', `Remove "${c.name}"?`, 'Delete', () => run(nav, () => DB.deleteCategory(c.id), 'Category deleted'));
    Alert.alert(`"${c.name}" has ${c.note_count} ${c.note_count === 1 ? 'note' : 'notes'}`, 'Your notes will not be deleted. They will move to "No category".',
      [{ text: 'Keep category', style: 'cancel' }, { text: 'Delete and move notes', style: 'destructive', onPress: () => run(nav, () => DB.deleteCategory(c.id, true), 'Category deleted') }]);
  };
  const save = async () => {
    try { await DB.saveCategory(edit!); setEdit(null); setErr(''); nav.bump(); nav.toast('Category saved'); } catch (e: any) { setErr(String(e.message)); }
  };
  return (
    <ScrollView contentContainerStyle={st.pad} keyboardShouldPersistTaps="handled">
      <H>Categories</H>
      {edit ? (
        <Card style={{ marginVertical: 12 }}>
          <TextInput accessibilityLabel="Category name" placeholder="Name" placeholderTextColor={C.muted} value={edit.name} onChangeText={(v) => { setErr(''); setEdit({ ...edit, name: v }); }} style={st.input} maxLength={40} />
          <TextInput accessibilityLabel="Category icon (an emoji)" placeholder="Icon (an emoji)" placeholderTextColor={C.muted} value={edit.icon} onChangeText={(v) => setEdit({ ...edit, icon: v })} style={[st.input, { marginTop: 8 }]} maxLength={4} />
          <View style={{ flexDirection: 'row', gap: 12, marginVertical: 12 }}>
            {CAT_COLORS.map((c: string, i: number) => <Pressable key={c} accessibilityRole="button" accessibilityLabel={`Color ${i + 1}`} onPress={() => setEdit({ ...edit, color: c })}
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c, borderWidth: edit.color === c ? 3 : 1.5, borderColor: edit.color === c ? C.ink : C.line }} />)}</View>
          {!!err && <Text style={{ color: C.danger, marginBottom: 8 }} accessibilityLiveRegion="polite">{err}</Text>}
          <View style={{ flexDirection: 'row', gap: 10 }}><Btn kind="soft" label="Cancel" onPress={() => { setEdit(null); setErr(''); }} style={{ flex: 1 }} /><Btn label="Save category" onPress={save} style={{ flex: 2 }} /></View>
        </Card>
      ) : <Btn label="+ New category" onPress={() => setEdit({ name: '', icon: '📒', color: CAT_COLORS[0] })} style={{ marginVertical: 12 }} />}
      {r.loading ? <Loading /> : r.error ? <ErrorBox msg={r.error} /> : r.data!.length === 0 ? <Empty text="No categories yet. Create one to group your notes." /> :
        r.data!.map((c) => (
          <Card key={c.id} color={c.color} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: C.ink }}>{c.icon} {c.name}</Text>
            <Text style={{ color: C.ink }}>{c.note_count} {c.note_count === 1 ? 'note' : 'notes'}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <Btn kind="soft" label="Edit" onPress={() => setEdit({ id: c.id, name: c.name, icon: c.icon, color: c.color })} style={{ backgroundColor: C.card }} />
              <Btn kind="danger" label="Delete" onPress={() => del(c)} /></View>
          </Card>))}
    </ScrollView>
  );
}
