import React from 'react';
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from 'react-native';
import { C } from '../theme/tokens';
import { s } from './componentStyles';
import { Btn } from './Btn';
import { Cat, CatState } from './Cat';

export const Empty = ({ cat = 'curious', text, action, onAction }: { cat?: CatState; text: string; action?: string; onAction?: () => void }) => (
  <View style={{ alignItems: 'center', padding: 28, gap: 10 }}><Cat state={cat} size={56} /><Text style={{ color: C.muted, textAlign: 'center', fontSize: 16 }}>{text}</Text>{action && onAction && <Btn label={action} onPress={onAction} />}</View>
);
export const Loading = () => <ActivityIndicator color={C.ink} style={{ margin: 32 }} accessibilityLabel="Loading" />;
export const ErrorBox = ({ msg }: { msg: string }) => <Empty cat="error" text={`Something went wrong: ${msg}`} />;

