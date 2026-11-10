import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { C } from '../theme/tokens';
import type { TabKey } from '../navigation/types';

const TABS: [TabKey, string, string][] = [['home', '🏡', 'Home'], ['notes', '📝', 'Notes'], ['moods', '🌤', 'Moods'], ['cats', '🗂', 'Categories'], ['settings', '⚙️', 'Settings']];

export const TabBar = ({ tab, onSelect }: { tab: TabKey; onSelect: (k: TabKey) => void }) => (
  <View style={{ flexDirection: 'row', backgroundColor: C.card, borderTopWidth: 1, borderColor: C.line }}>
    {TABS.map(([k, icon, label]) => (
      <Pressable key={k} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: tab === k }} onPress={() => onSelect(k)}
        style={{ flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: tab === k ? C.lav : 'transparent' }}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
        <Text style={{ fontSize: 11, color: C.ink, fontWeight: tab === k ? '700' : '500' }}>{label}</Text>
      </Pressable>))}
  </View>
);
