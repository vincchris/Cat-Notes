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

// ---------------- Settings ----------------
export function SettingsScreen({ nav, setMascot }: { nav: Nav; setMascot: (v: boolean) => void }) {
  return (
    <ScrollView contentContainerStyle={st.pad}>
      <H>Settings</H>
      <View style={st.row}><Text style={st.lbl}>Show cat mascot</Text><Switch value={nav.mascot} onValueChange={setMascot} accessibilityLabel="Show cat mascot" /></View>
      <Card color={C.lav} style={{ marginTop: 16 }}>
        <Text style={st.sub}>About MellowNotes</Text>
        <Text style={{ color: C.ink, marginTop: 6 }}>Your little corner of thoughts. Version 1.0.{'\n\n'}Everything is stored only on this device in a local SQLite database. Nothing syncs to other devices or the cloud, so uninstalling the app removes your notes.</Text>
      </Card>
    </ScrollView>
  );
}
