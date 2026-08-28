import { Pressable, Text, View } from 'react-native';
import type { Recipe } from '../types/models';
import { useTheme } from '../theme/useTheme';

type Props = {
  recipe: Recipe;
  onPress: () => void;
  favorite?: boolean;
  onToggleFavorite?: () => void;
};

export function RecipeCard({ recipe, onPress, favorite, onToggleFavorite }: Props) {
  const { c, radius, spacing, typography } = useTheme();
  const totalMin = recipe.prepMinutes + recipe.cookMinutes;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: c.surface,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: c.border,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          height: 110,
          backgroundColor: recipe.color,
          justifyContent: 'flex-end',
          padding: spacing.md,
        }}
      >
        <Text style={{ fontSize: 44 }}>{recipe.emoji}</Text>
      </View>
      <View style={{ padding: spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[typography.heading, { color: c.text, flex: 1 }]}>{recipe.title}</Text>
          {onToggleFavorite && (
            <Pressable onPress={onToggleFavorite} hitSlop={12}>
              <Text style={{ fontSize: 20 }}>{favorite ? '❤️' : '🤍'}</Text>
            </Pressable>
          )}
        </View>
        <Text style={[typography.caption, { color: c.textMuted, marginTop: 4 }]} numberOfLines={2}>
          {recipe.summary}
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm }}>
          <Text style={[typography.micro, { color: c.textMuted }]}>⏱ {totalMin} MIN</Text>
          <Text style={[typography.micro, { color: c.textMuted }]}>🍽 {recipe.servings} SRV</Text>
          <Text style={[typography.micro, { color: c.textMuted }]}>{recipe.cuisine.toUpperCase()}</Text>
        </View>
      </View>
    </Pressable>
  );
}
