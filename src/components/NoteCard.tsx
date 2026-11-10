import React from 'react';
import { Pressable, Text, View } from 'react-native';
import * as DB from '../db';
import { MOOD_ICON, Note } from '../db';
import { C } from '../theme/tokens';
import { fmt } from '../lib/format';
import { run } from '../lib/actions';
import type { Nav } from '../navigation/types';
import { Card } from './Card';

export const NoteCard = ({ n, go, nav }: { n: Note; go: () => void; nav: Nav }) => (
  <Card color={n.color || C.card} onPress={go} style={{ marginBottom: 12 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {!!n.is_pinned && <Text accessibilityLabel="Pinned">📌</Text>}
      <Text numberOfLines={1} style={{ flex: 1, fontSize: 17, fontWeight: '700', color: C.ink }}>{n.title}</Text>
      <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel={n.is_favorite ? 'Remove favorite' : 'Mark favorite'}
        onPress={() => run(nav, () => DB.toggleNote(n.id, 'is_favorite'))} style={{ minWidth: 40, minHeight: 40, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20 }}>{n.is_favorite ? '💖' : '🤍'}</Text></Pressable>
    </View>
    <Text numberOfLines={2} style={{ color: C.ink, marginTop: 4 }}>{n.locked ? `🔒 Time capsule, opens ${fmt(n.unlock_at!)}` : n.content || 'No text yet'}</Text>
    <Text style={{ color: C.muted, marginTop: 8, fontSize: 13 }}>
      {[n.category_icon && `${n.category_icon} ${n.category_name}`, n.mood && `${MOOD_ICON[n.mood]} ${n.mood}`, fmt(n.created_at)].filter(Boolean).join('   ')}</Text>
  </Card>
);

