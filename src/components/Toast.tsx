import React from 'react';
import { Text, View } from 'react-native';
import { C, R } from '../theme/tokens';

export const Toast = ({ msg }: { msg: string }) => !msg ? null : (
  <View accessibilityLiveRegion="polite" style={{ position: 'absolute', bottom: 88, alignSelf: 'center', backgroundColor: C.ink, borderRadius: R.l, paddingHorizontal: 18, paddingVertical: 12 }}>
    <Text style={{ color: C.bg }}>{msg}</Text>
  </View>
);
