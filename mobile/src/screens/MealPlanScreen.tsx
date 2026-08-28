import { useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../state/AppState';
import { findRecipe } from '../data/recipes';
import { useTheme } from '../theme/useTheme';
import { ScreenHeader } from '../components/ScreenHeader';
import type { MealSlot, PlannedMeal } from '../types/models';

const SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];
const SLOT_EMOJI: Record<MealSlot, string> = { breakfast: '🌅', lunch: '🥗', dinner: '🍽️', snack: '🍎' };

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}
function labelFor(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

export function MealPlanScreen() {
  const { planner, addToPlan, removeFromPlan, clearPlan, recipes } = useAppState();
  const { c, brand, radius, spacing, typography } = useTheme();
  const [pick, setPick] = useState<{ date: string; slot: MealSlot } | null>(null);

  const start = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(start, i)), [start]);

  const byDay = useMemo(() => {
    const m = new Map<string, PlannedMeal[]>();
    for (const p of planner) {
      const list = m.get(p.date) ?? [];
      list.push(p);
      m.set(p.date, list);
    }
    return m;
  }, [planner]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScreenHeader
        eyebrow="THIS WEEK"
        title="Meal plan"
        action={
          <Pressable
            onPress={() =>
              Alert.alert('Clear plan?', 'Remove every planned meal for this week?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: clearPlan },
              ])
            }
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              borderColor: c.border,
              borderWidth: 1,
            }}
          >
            <Text style={[typography.caption, { color: c.textMuted }]}>Clear</Text>
          </Pressable>
        }
      />
      <FlatList
        data={days}
        keyExtractor={d => iso(d)}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}
        renderItem={({ item: d }) => {
          const dateKey = iso(d);
          const meals = byDay.get(dateKey) ?? [];
          return (
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
              <Text style={[typography.heading, { color: c.text, marginBottom: spacing.sm }]}>{labelFor(d)}</Text>
              {SLOTS.map(slot => {
                const items = meals.filter(m => m.slot === slot);
                return (
                  <View key={slot} style={{ marginBottom: spacing.xs + 2 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}
                    >
                      <Text style={[typography.caption, { color: c.textMuted }]}>
                        {SLOT_EMOJI[slot]} {slot.toUpperCase()}
                      </Text>
                      <Pressable onPress={() => setPick({ date: dateKey, slot })} hitSlop={12}>
                        <Text style={{ color: brand.primary, fontWeight: '700' }}>+ add</Text>
                      </Pressable>
                    </View>
                    {items.length === 0 ? (
                      <Text style={[typography.caption, { color: c.textMuted, fontStyle: 'italic' }]}>—</Text>
                    ) : (
                      items.map(m => {
                        const r = findRecipe(m.recipeId);
                        if (!r) return null;
                        return (
                          <Pressable
                            key={m.id}
                            onLongPress={() =>
                              Alert.alert('Remove?', r.title, [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Remove', style: 'destructive', onPress: () => removeFromPlan(m.id) },
                              ])
                            }
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: c.surfaceAlt,
                              borderRadius: radius.md,
                              paddingHorizontal: 10,
                              paddingVertical: 8,
                              marginBottom: 4,
                            }}
                          >
                            <Text style={{ fontSize: 20, marginRight: 8 }}>{r.emoji}</Text>
                            <View style={{ flex: 1 }}>
                              <Text style={{ color: c.text, fontWeight: '600' }}>{r.title}</Text>
                              <Text style={[typography.caption, { color: c.textMuted }]}>
                                {m.servings} servings · {r.prepMinutes + r.cookMinutes} min
                              </Text>
                            </View>
                          </Pressable>
                        );
                      })
                    )}
                  </View>
                );
              })}
            </View>
          );
        }}
      />

      <Modal visible={!!pick} animationType="slide" transparent onRequestClose={() => setPick(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: c.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: spacing.lg,
              maxHeight: '75%',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
              <Text style={[typography.title, { color: c.text }]}>
                Pick a recipe · {pick?.slot}
              </Text>
              <Pressable onPress={() => setPick(null)} hitSlop={12}>
                <Text style={{ color: c.textMuted, fontSize: 18 }}>✕</Text>
              </Pressable>
            </View>
            <ScrollView>
              {recipes.map(r => (
                <Pressable
                  key={r.id}
                  onPress={() => {
                    if (pick) addToPlan(r.id, pick.date, pick.slot);
                    setPick(null);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: spacing.md,
                    borderBottomColor: c.border,
                    borderBottomWidth: 1,
                  }}
                >
                  <Text style={{ fontSize: 26, marginRight: 12 }}>{r.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: c.text, fontWeight: '600' }}>{r.title}</Text>
                    <Text style={[typography.caption, { color: c.textMuted }]}>{r.cuisine}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
