import React from 'react';
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from 'react-native';
import { C } from '../theme/tokens';
import { s } from './componentStyles';

export const Chip = ({ label, on, onPress, color = C.lav }: { label: string; on?: boolean; onPress: () => void; color?: string }) => (
  <Pressable accessibilityRole="button" accessibilityState={{ selected: !!on }} onPress={onPress}
    style={[s.chip, { backgroundColor: on ? color : C.card, borderColor: on ? C.ink : C.line }]}>
    <Text style={{ color: C.ink, fontWeight: on ? '700' : '500' }}>{label}</Text>
  </Pressable>
);
