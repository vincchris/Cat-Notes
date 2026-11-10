import React from 'react';
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from 'react-native';
import { C } from '../theme/tokens';
import { s } from './componentStyles';

export type CatState = 'idle' | 'writing' | 'happy' | 'curious' | 'error';
const FACE: Record<CatState, string> = { idle: '😴', writing: '😼', happy: '😸', curious: '🙀', error: '😿' };
const LABEL: Record<CatState, string> = { idle: 'sleeping cat', writing: 'focused cat', happy: 'happy cat', curious: 'curious cat', error: 'confused cat' };
export const Cat = ({ state = 'idle', size = 44 }: { state?: CatState; size?: number }) => (
  <Text accessibilityLabel={LABEL[state]} style={{ fontSize: size }}>{FACE[state]}</Text>
);

