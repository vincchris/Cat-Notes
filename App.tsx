import React, { useEffect, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getDb } from './src/db';
import { C } from './src/theme/tokens';
import { ErrorBox, Loading, TabBar, Toast } from './src/components';
import { useAppNavigation } from './src/navigation/useAppNavigation';
import type { Nav } from './src/navigation/types';
import { useMascot } from './src/hooks/useMascot';
import { useToast } from './src/hooks/useToast';
import { HomeScreen } from './src/screens/HomeScreen';
import { NotesScreen } from './src/screens/NotesScreen';
import { NoteDetailScreen } from './src/screens/NoteDetailScreen';
import { NoteEditorScreen } from './src/screens/NoteEditorScreen';
import { CategoriesScreen } from './src/screens/CategoriesScreen';
import { MoodsScreen } from './src/screens/MoodsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

export default function App() {
  const [ready, setReady] = useState(false);
  const [fatal, setFatal] = useState('');
  const [rev, setRev] = useState(0);
  const [mascot, setMascot] = useMascot();
  const { msg, toast } = useToast();
  const { tab, catId, top, guard, back, open, selectTab } = useAppNavigation();

  useEffect(() => { getDb().then(() => setReady(true), (e) => setFatal(String(e?.message ?? e))); }, []);
  if (fatal) return <ErrorBox msg={fatal} />;
  if (!ready) return <Loading />;

  const nav: Nav = { rev, bump: () => setRev((r) => r + 1), toast, mascot, guard, back: () => { back(); }, open };

  let body: React.ReactNode;
  if (top?.t === 'editor') body = <NoteEditorScreen key={`e${top.id}`} id={top.id} nav={nav} />;
  else if (top?.t === 'detail') body = <NoteDetailScreen id={top.id} nav={nav} />;
  else if (tab === 'home') body = <HomeScreen nav={nav} go={(t, c) => selectTab(t as any, c)} />;
  else if (tab === 'notes') body = <NotesScreen key={`n${catId}`} nav={nav} initialCat={catId} />;
  else if (tab === 'moods') body = <MoodsScreen nav={nav} />;
  else if (tab === 'cats') body = <CategoriesScreen nav={nav} />;
  else body = <SettingsScreen nav={nav} setMascot={setMascot} />;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: Platform.OS === 'web' ? C.line : C.bg }}>
        <StatusBar style="dark" />
        {/* On wide web screens the app stays phone-sized and centered. */}
        <View style={{ flex: 1, width: '100%', maxWidth: 560, alignSelf: 'center', backgroundColor: C.bg }}>
          {top && (
            <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={nav.back} style={{ minHeight: 48, justifyContent: 'center', paddingHorizontal: 16 }}>
              <Text style={{ color: C.ink, fontWeight: '700', fontSize: 16 }}>‹ Back</Text>
            </Pressable>)}
          <View style={{ flex: 1 }}>{body}</View>
          <Toast msg={msg} />
          {!top && <TabBar tab={tab} onSelect={(k) => selectTab(k)} />}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
