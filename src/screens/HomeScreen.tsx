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

// ---------------- Home ----------------
export function HomeScreen({ nav, go }: { nav: Nav; go: (tab: string, catId?: number) => void }) {
  const notes = useQuery(() => DB.listNotes({ limit: 40 }), [nav.rev]);
  const cats = useQuery(DB.listCategories, [nav.rev]);
  const moods = useQuery(DB.listMoods, [nav.rev]);
  const garden = useQuery(DB.garden, [nav.rev]);
  if (notes.loading || cats.loading) return <Loading />;
  if (notes.error) return <ErrorBox msg={notes.error} />;
  const all = notes.data!; const pinned = all.filter((n) => n.is_pinned); const recent = all.filter((n) => !n.is_pinned).slice(0, 4);
  const today = moods.data?.find((m) => m.mood_date === dayKey());
  return (
    <ScrollView contentContainerStyle={st.pad}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {nav.mascot && <Cat state={all.length ? 'idle' : 'curious'} size={52} />}
        <View style={{ flex: 1 }}>
          <Text style={st.title}>Your little thoughts deserve a home.</Text>
          <Muted>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Muted></View>
      </View>
      <Btn label="+ New note" onPress={() => nav.open({ t: 'editor' })} style={{ marginVertical: 16 }} />
      <Card color={C.butter} onPress={() => go('moods')}>
        <Text style={st.sub}>Today's mood</Text>
        <Text style={{ color: C.ink, marginTop: 4 }}>{today ? `${MOOD_ICON[today.mood]} ${today.mood}` : 'Not recorded yet. Tap to check in.'}</Text></Card>
      <Text style={st.section}>Memory Garden</Text>
      <Card color={C.sage}>
        {garden.data?.length ? (<>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {garden.data.map((g) => <Text key={g.d} accessibilityLabel={`${g.d}: ${g.n} notes`} style={{ fontSize: 26, margin: 2 }}>{g.n >= 2 ? '🌷' : '🌱'}</Text>)}</View>
          <Muted>{garden.data.length} writing {garden.data.length === 1 ? 'day' : 'days'} so far. Days with 2+ notes bloom. Breaks never wilt anything.</Muted></>)
          : <Muted>Your garden is empty. Each day you write a note plants a seed.</Muted>}
      </Card>
      <Text style={st.section}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cats.data?.map((c) => <Chip key={c.id} color={c.color} label={`${c.icon} ${c.name} (${c.note_count})`} onPress={() => go('notes', c.id)} />)}</ScrollView>
      {pinned.length > 0 && (<><Text style={st.section}>Pinned</Text>{pinned.map((n) => <NoteCard key={n.id} n={n} nav={nav} go={() => nav.open({ t: 'detail', id: n.id })} />)}</>)}
      <Text style={st.section}>Recent</Text>
      {recent.length ? recent.map((n) => <NoteCard key={n.id} n={n} nav={nav} go={() => nav.open({ t: 'detail', id: n.id })} />)
        : !pinned.length && <Empty text="Your notebook is empty." action="Write your first note" onAction={() => nav.open({ t: 'editor' })} />}
    </ScrollView>
  );
}
