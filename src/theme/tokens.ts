// Design tokens: never hardcode colors in components.
export const C = {
  bg: '#FFF7EE', pink: '#F6C9D4', lav: '#DCD3F7', sage: '#D8E8D2', butter: '#F7DDB2',
  ink: '#514653', muted: '#74697A', card: '#FFFFFF', danger: '#B4474F', line: '#EADFD2',
};
export const NOTE_COLORS = [C.card, C.pink, C.lav, C.sage, C.butter];
export const CAT_COLORS = [C.pink, C.lav, C.sage, C.butter];
export const R = { s: 10, m: 18, l: 26 };
export const shadow = { shadowColor: C.ink, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 };
