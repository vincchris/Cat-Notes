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

// ---------------- Daily mood journal ----------------
export function MoodsScreen({ nav }: { nav: Nav }) {
  const r = useQuery(DB.listMoods, [nav.rev]);
  const [sel, setSel] = useState<{ id?: number; mood: Mood | null; reflection: string; date: string } | null>(null);
  const today = r.data?.find((m) => m.mood_date === dayKey());
  const save = async () => {
    if (!sel?.mood) return Alert.alert('Pick a mood', 'Choose how you feel first. The reflection is optional.');
    if (await run(nav, () => DB.saveMood({ id: sel.id, mood: sel.mood!, reflection: sel.reflection, mood_date: sel.date }), 'Mood saved')) setSel(null);
  };
  return (
    <ScrollView contentContainerStyle={st.pad} keyboardShouldPersistTaps="handled">
      <H>Daily mood</H>
      {!sel && <Btn label={today ? "Edit today's mood" : 'Check in for today'} onPress={() => setSel(today ? { id: today.id, mood: today.mood, reflection: today.reflection ?? '', date: today.mood_date } : { mood: null, reflection: '', date: dayKey() })} style={{ marginVertical: 12 }} />}
      {sel && (
        <Card style={{ marginVertical: 12 }}>
          <Text style={st.sub}>How are you feeling on {sel.date}?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, rowGap: 8 }}>
            {MOODS.map((m) => <Chip key={m} on={sel.mood === m} label={`${MOOD_ICON[m]} ${m}`} onPress={() => setSel({ ...sel, mood: m })} />)}</View>
          <TextInput accessibilityLabel="Reflection (optional)" placeholder="A few words, if you like (optional)" placeholderTextColor={C.muted} multiline value={sel.reflection} onChangeText={(v) => setSel({ ...sel, reflection: v })} style={[st.input, { marginTop: 8, minHeight: 80, textAlignVertical: 'top' }]} />
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}><Btn kind="soft" label="Cancel" onPress={() => setSel(null)} style={{ flex: 1 }} /><Btn label="Save mood" onPress={save} style={{ flex: 2 }} /></View>
        </Card>)}
      {r.loading ? <Loading /> : r.error ? <ErrorBox msg={r.error} /> : r.data!.length === 0 ? <Empty text="No moods recorded yet. Your history will show up here." /> :
        r.data!.map((m) => (
          <Card key={m.id} style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: '700', color: C.ink, fontSize: 16 }}>{MOOD_ICON[m.mood]} {m.mood}</Text>
            <Muted>{fmt(m.mood_date + 'T12:00:00')}</Muted>
            {!!m.reflection && <Text style={{ color: C.ink, marginTop: 6 }}>{m.reflection}</Text>}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <Btn kind="soft" label="Edit" onPress={() => setSel({ id: m.id, mood: m.mood, reflection: m.reflection ?? '', date: m.mood_date })} />
              <Btn kind="danger" label="Delete" onPress={() => confirm('Delete this entry?', 'This cannot be undone.', 'Delete', () => run(nav, () => DB.deleteMood(m.id), 'Entry deleted'))} /></View>
          </Card>))}
    </ScrollView>
  );
}
