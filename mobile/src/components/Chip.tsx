import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  tone?: 'default' | 'accent';
};

export function Chip({ label, active, onPress, tone = 'default' }: Props) {
  const { c, brand, radius, spacing, typography } = useTheme();
  const activeBg = tone === 'accent' ? brand.accent : brand.primary;
  const activeFg = '#FFFFFF';
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: radius.pill,
        backgroundColor: active ? activeBg : c.surfaceAlt,
        borderWidth: 1,
        borderColor: active ? activeBg : c.border,
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
      }}
    >
      <Text
        style={[
          typography.caption,
          { color: active ? activeFg : c.text, fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
