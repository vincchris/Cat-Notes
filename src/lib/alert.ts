import { Alert as RNAlert, AlertButton, Platform } from 'react-native';

/** Same API as react-native's Alert, but also works on web (where RN's Alert does nothing). */
export const Alert = {
  alert(title: string, message?: string, buttons?: AlertButton[]) {
    if (Platform.OS !== 'web') return RNAlert.alert(title, message, buttons);
    const text = message ? `${title}\n\n${message}` : title;
    const action = buttons?.find((b) => b.style !== 'cancel');
    if (buttons && buttons.length > 1) { if (window.confirm(text)) action?.onPress?.(); }
    else { window.alert(text); action?.onPress?.(); }
  },
};
