import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../nav/RootNavigator';
import { useAppState } from '../state/AppState';
import { findRecipe } from '../data/recipes';
import { useTheme } from '../theme/useTheme';
import { Chip } from '../components/Chip';
import type { MealSlot } from '../types/models';

const SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

export function RecipeDetailScreen() {
  const nav = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'RecipeDetail'>>();
  const recipe = findRecipe(route.params.recipeId);
  const { addToPlan, favorites, toggleFavorite } = useAppState();
  const { c, brand, spacing, radius, typography } = useTheme();
  const [servings, setServings] = useState(recipe?.servings ?? 2);

  if (!recipe) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: c.text }}>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  const scale = servings / recipe.servings;
  const scaledIngredients = useMemo(
    () => recipe.ingredients.map(i => ({ ...i, quantity: Math.round(i.quantity * scale * 100) / 100 })),
    [recipe, scale],
  );

  function planFor(slot: MealSlot) {
    if (!recipe) return;
    addToPlan(recipe.id, todayISO(), slot);
    Alert.alert('Added to plan', `${recipe.title} scheduled for today's ${slot}.`);
  }

  const total = recipe.prepMinutes + recipe.cookMinutes;

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ backgroundColor: recipe.color, paddingTop: 50, paddingBottom: 24, paddingHorizontal: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable
            onPress={() => nav.goBack()}
            style={{ padding: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.25)' }}
          >
            <Text style={{ fontSize: 18, color: '#fff' }}>‹</Text>
          </Pressable>
          <Pressable onPress={() => toggleFavorite(recipe.id)} hitSlop={12}>
            <Text style={{ fontSize: 22 }}>{favorites.has(recipe.id) ? '❤️' : '🤍'}</Text>
          </Pressable>
        </View>
        <Text style={{ fontSize: 68, marginTop: 8 }}>{recipe.emoji}</Text>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 8 }}>{recipe.title}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>{recipe.summary}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }}>
          <Stat label="Prep" value={`${recipe.prepMinutes} min`} />
          <Stat label="Cook" value={`${recipe.cookMinutes} min`} />
          <Stat label="Total" value={`${total} min`} />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md }}>
          {recipe.diets.map(d => (
            <Chip key={d} label={d} tone="accent" active />
          ))}
          {recipe.tags.map(t => (
            <Chip key={t} label={`#${t}`} />
          ))}
        </View>

        <View
          style={{
            backgroundColor: c.surface,
            borderRadius: radius.lg,
            borderColor: c.border,
            borderWidth: 1,
            padding: spacing.md,
            marginBottom: spacing.md,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[typography.heading, { color: c.text }]}>Servings</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Stepper label="−" onPress={() => setServings(s => Math.max(1, s - 1))} />
              <Text style={[typography.title, { color: c.text, minWidth: 24, textAlign: 'center' }]}>{servings}</Text>
              <Stepper label="+" onPress={() => setServings(s => s + 1)} />
            </View>
          </View>
        </View>

        <Text style={[typography.title, { color: c.text, marginBottom: spacing.sm }]}>Ingredients</Text>
        <View
          style={{
            backgroundColor: c.surface,
            borderRadius: radius.lg,
            borderColor: c.border,
            borderWidth: 1,
            paddingVertical: spacing.xs,
            marginBottom: spacing.lg,
          }}
        >
          {scaledIngredients.map((i, idx) => (
            <View
              key={i.name + idx}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                paddingHorizontal: spacing.md,
                borderBottomColor: c.border,
                borderBottomWidth: idx === scaledIngredients.length - 1 ? 0 : 1,
              }}
            >
              <Text style={{ color: c.text }}>{i.name}</Text>
              <Text style={{ color: c.textMuted }}>{fmt(i.quantity)} {i.unit}</Text>
            </View>
          ))}
        </View>

        <Text style={[typography.title, { color: c.text, marginBottom: spacing.sm }]}>Steps</Text>
        {recipe.steps.map((s, idx) => (
          <View key={idx} style={{ flexDirection: 'row', marginBottom: spacing.md }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                backgroundColor: brand.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>{idx + 1}</Text>
            </View>
            <Text style={{ flex: 1, color: c.text, lineHeight: 22 }}>{s}</Text>
          </View>
        ))}

        <Text style={[typography.title, { color: c.text, marginTop: spacing.md, marginBottom: spacing.sm }]}>
          Add to today's plan
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {SLOTS.map(slot => (
            <Chip key={slot} label={slot} onPress={() => planFor(slot)} tone="accent" />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { c, radius, spacing, typography } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: c.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: c.border,
        padding: spacing.md,
      }}
    >
      <Text style={[typography.micro, { color: c.textMuted }]}>{label.toUpperCase()}</Text>
      <Text style={[typography.heading, { color: c.text, marginTop: 2 }]}>{value}</Text>
    </View>
  );
}

function Stepper({ label, onPress }: { label: string; onPress: () => void }) {
  const { c, brand } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 32,
        height: 32,
        borderRadius: 999,
        backgroundColor: brand.primarySoft,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );
}
