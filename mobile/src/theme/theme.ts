export const palette = {
  brand: {
    primary: '#C7472C',
    primarySoft: '#E88A6E',
    accent: '#3A8B6A',
    accentSoft: '#B7D8C7',
    warm: '#E8B84D',
  },
  light: {
    background: '#F5EFE6',
    surface: '#FFFFFF',
    surfaceAlt: '#F0E7D7',
    text: '#2A211B',
    textMuted: '#6E5F53',
    border: '#E4D8C4',
  },
  dark: {
    background: '#1B1612',
    surface: '#2A211B',
    surfaceAlt: '#3A2E25',
    text: '#F5EFE6',
    textMuted: '#B8A79A',
    border: '#3A2E25',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.4 },
  title: { fontSize: 20, fontWeight: '700' as const },
  heading: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  micro: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.6 },
} as const;

export type ColorMode = 'light' | 'dark';

export function colorsFor(mode: ColorMode) {
  return palette[mode];
}
