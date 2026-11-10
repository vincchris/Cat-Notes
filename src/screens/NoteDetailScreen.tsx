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

// ---------------- Note details ----------------
export function NoteDetailScreen({ id, nav }: { id: number; nav: Nav }) {
  const r = useQuery(() => DB.getNote(id), [id, nav.rev]);
  if (r.loading) return <Loading />;
  if (r.error || !r.data) return <ErrorBox msg={r.error ?? 'This note no longer exists.'} />;
  const n = r.data;
  return (
    <ScrollView contentContainerStyle={st.pad}>
      <Card color={n.color || C.card}>
        <Text accessibilityRole="header" style={st.title}>{n.title}</Text>
        <Text style={{ color: C.muted, marginTop: 6 }}>
          {[n.category_icon && `${n.category_icon} ${n.category_name}`, n.mood && `${MOOD_ICON[n.mood]} ${n.mood}`].filter(Boolean).join('   ') || 'No category'}</Text>
        <Text style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>Created {fmt(n.created_at)}   Updated {fmt(n.updated_at)}</Text>
        {n.locked ? (
          <View style={{ marginVertical: 24, alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 44 }}>🔒</Text>
            <Text style={{ color: C.ink, textAlign: 'center' }}>This time capsule opens on {fmt(n.unlock_at!)}. Open it early or edit the date any time.</Text>
            <Btn kind="soft" label="Open it now" onPress={() => confirm('Open early?', 'The note will unlock immediately.', 'Open now', () => run(nav, () => DB.openCapsuleNow(n.id), 'Capsule opened'))} />
          </View>
        ) : <Text style={{ color: C.ink, fontSize: 17, lineHeight: 26, marginTop: 16 }}>{n.content || 'No text in this note.'}</Text>}
      </Card>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <Btn kind="soft" label="Edit" onPress={() => nav.open({ t: 'editor', id: n.id })} />
        <Btn kind="soft" label={n.is_favorite ? 'Unfavorite' : 'Favorite'} onPress={() => run(nav, () => DB.toggleNote(n.id, 'is_favorite'))} />
        <Btn kind="soft" label={n.is_pinned ? 'Unpin' : 'Pin'} onPress={() => run(nav, () => DB.toggleNote(n.id, 'is_pinned'))} />
        <Btn kind="danger" label="Delete" onPress={() => confirm('Delete this note?', 'This cannot be undone.', 'Delete', async () => { if (await run(nav, () => DB.deleteNote(n.id), 'Note deleted')) nav.back(); })} />
      </View>
    </ScrollView>
  );
}
