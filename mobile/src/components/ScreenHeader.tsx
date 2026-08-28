import { Text, View } from 'react-native';
import { useTheme } from '../theme/useTheme';

export function ScreenHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  const { c, spacing, typography } = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1 }}>
        {eyebrow && (
          <Text style={[typography.micro, { color: c.textMuted, marginBottom: 4 }]}>{eyebrow}</Text>
        )}
        <Text style={[typography.display, { color: c.text }]}>{title}</Text>
      </View>
      {action}
    </View>
  );
}
