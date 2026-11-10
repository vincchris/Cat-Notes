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

// ---------------- All notes ----------------
export function NotesScreen({ nav, initialCat }: { nav: Nav; initialCat?: number }) {
  const [q, setQ] = useState(''); const [cat, setCat] = useState<number | null>(initialCat ?? null);
  const [mood, setMood] = useState<Mood | null>(null); const [sort, setSort] = useState<DB.Sort>('newest');
  const cats = useQuery(DB.listCategories, [nav.rev]);
  const r = useQuery(() => DB.listNotes({ q, categoryId: cat, mood, sort }), [nav.rev, q, cat, mood, sort]);
  const filtered = !!(q || cat || mood);
  return (
    <View style={{ flex: 1 }}>
      <View style={st.pad}>
        <TextInput accessibilityLabel="Search notes" placeholder="Search notes" placeholderTextColor={C.muted} value={q} onChangeText={setQ} style={st.input} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          <Chip label="All" on={!cat} onPress={() => setCat(null)} />
          {cats.data?.map((c) => <Chip key={c.id} color={c.color} on={cat === c.id} label={`${c.icon} ${c.name}`} onPress={() => setCat(cat === c.id ? null : c.id)} />)}</ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {MOODS.map((m) => <Chip key={m} on={mood === m} label={`${MOOD_ICON[m]} ${m}`} onPress={() => setMood(mood === m ? null : m)} />)}</ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {(['newest', 'oldest', 'updated', 'title'] as DB.Sort[]).map((x) => <Chip key={x} color={C.sage} on={sort === x} label={`Sort: ${x}`} onPress={() => setSort(x)} />)}</ScrollView>
      </View>
      {r.loading ? <Loading /> : r.error ? <ErrorBox msg={r.error} /> : (
        <FlatList data={r.data} keyExtractor={(n) => String(n.id)} contentContainerStyle={{ padding: 16, paddingTop: 0 }}
          renderItem={({ item }) => <NoteCard n={item} nav={nav} go={() => nav.open({ t: 'detail', id: item.id })} />}
          ListEmptyComponent={filtered ? <Empty text="No notes match. Try a different word or clear a filter." />
            : <Empty text="Nothing here yet." action="Create a note" onAction={() => nav.open({ t: 'editor' })} />} />)}
    </View>
  );
}
