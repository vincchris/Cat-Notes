import React from 'react';
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from 'react-native';
import { C } from '../theme/tokens';
import { s } from './componentStyles';

export const Card = ({ children, color = C.card, onPress, style }: { children: React.ReactNode; color?: string; onPress?: () => void; style?: ViewStyle }) =>
  onPress ? <Pressable onPress={onPress} style={[s.card, { backgroundColor: color }, style]}>{children}</Pressable>
          : <View style={[s.card, { backgroundColor: color }, style]}>{children}</View>;
