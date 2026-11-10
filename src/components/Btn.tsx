import React from 'react';
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from 'react-native';
import { C } from '../theme/tokens';
import { s } from './componentStyles';

export const Btn = ({ label, onPress, kind = 'primary', style }: { label: string; onPress: () => void; kind?: 'primary' | 'soft' | 'danger'; style?: ViewStyle }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
    style={[s.btn, kind === 'primary' && { backgroundColor: C.ink }, kind === 'soft' && { backgroundColor: C.lav }, kind === 'danger' && { backgroundColor: C.card, borderWidth: 1.5, borderColor: C.danger }, style]}>
    <Text style={[s.btnT, kind === 'primary' && { color: C.bg }, kind === 'danger' && { color: C.danger }]}>{label}</Text>
  </Pressable>
);
