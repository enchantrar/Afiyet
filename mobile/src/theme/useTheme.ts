import { useColorScheme } from 'react-native';
import { palette, spacing, radius, typography } from './theme';

export function useTheme() {
  const mode = useColorScheme() === 'dark' ? 'dark' : 'light';
  return {
    mode,
    c: palette[mode],
    brand: palette.brand,
    spacing,
    radius,
    typography,
  };
}
