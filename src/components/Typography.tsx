import React from 'react';
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from 'react-native';
import { C } from '../theme/tokens';
import { s } from './componentStyles';

export const H = ({ children }: { children: React.ReactNode }) => <Text accessibilityRole="header" style={s.h}>{children}</Text>;
export const Muted = ({ children }: { children: React.ReactNode }) => <Text style={{ color: C.muted, fontSize: 14 }}>{children}</Text>;
