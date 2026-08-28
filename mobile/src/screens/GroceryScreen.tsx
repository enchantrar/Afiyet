import { useMemo } from 'react';
import { Alert, Pressable, SectionList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../state/AppState';
import { useTheme } from '../theme/useTheme';
import { ScreenHeader } from '../components/ScreenHeader';
import type { GroceryItem } from '../types/models';

const AISLE_ORDER: GroceryItem['aisle'][] = ['produce', 'meat', 'dairy', 'bakery', 'pantry', 'frozen', 'other'];
const AISLE_LABEL: Record<GroceryItem['aisle'], string> = {
  produce: '🥬 Produce',
  meat: '🥩 Meat',
  dairy: '🧀 Dairy & Eggs',
  bakery: '🥖 Bakery',
  pantry: '🥫 Pantry',
  frozen: '🧊 Frozen',
  other: '🛒 Other',
};

function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

export function GroceryScreen() {
  const { grocery, toggleGroceryItem, clearCheckedGrocery, regenerateGrocery } = useAppState();
  const { c, brand, radius, spacing, typography } = useTheme();

  const sections = useMemo(() => {
    const byAisle = new Map<GroceryItem['aisle'], GroceryItem[]>();
    for (const item of grocery) {
      const list = byAisle.get(item.aisle) ?? [];
      list.push(item);
      byAisle.set(item.aisle, list);
    }
    return AISLE_ORDER
      .filter(a => byAisle.has(a))
      .map(a => ({ title: AISLE_LABEL[a], data: byAisle.get(a)! }));
  }, [grocery]);

  const remaining = grocery.filter(g => !g.checked).length;
  const total = grocery.length;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScreenHeader
        eyebrow={`${remaining}/${total} REMAINING`}
        title="Grocery list"
        action={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={regenerateGrocery}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                borderColor: c.border,
                borderWidth: 1,
              }}
            >
              <Text style={[typography.caption, { color: c.textMuted }]}>Sync</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                Alert.alert('Clear checked?', 'Remove all items you have checked off.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', style: 'destructive', onPress: clearCheckedGrocery },
                ])
              }
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: brand.primary,
              }}
            >
              <Text style={[typography.caption, { color: '#fff', fontWeight: '700' }]}>Clear ✓</Text>
            </Pressable>
          </View>
        }
      />
      {grocery.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Text style={{ fontSize: 48 }}>🧺</Text>
          <Text style={[typography.title, { color: c.text, marginTop: 12 }]}>List is empty</Text>
          <Text style={[typography.caption, { color: c.textMuted, textAlign: 'center', marginTop: 4 }]}>
            Add meals to your plan and the ingredients will roll up here automatically.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.key}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}
          renderSectionHeader={({ section }) => (
            <Text style={[typography.micro, { color: c.textMuted, marginTop: spacing.md, marginBottom: 6 }]}>
              {section.title.toUpperCase()}
            </Text>
          )}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => toggleGroceryItem(item.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: c.surface,
                borderRadius: radius.md,
                borderColor: c.border,
                borderWidth: 1,
                paddingHorizontal: spacing.md,
                paddingVertical: 12,
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: item.checked ? brand.accent : c.border,
                  backgroundColor: item.checked ? brand.accent : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.md,
                }}
              >
                {item.checked && <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: c.text,
                    fontWeight: '600',
                    textDecorationLine: item.checked ? 'line-through' : 'none',
                    opacity: item.checked ? 0.55 : 1,
                  }}
                >
                  {item.name}
                </Text>
                {item.sources.length > 0 && (
                  <Text style={[typography.caption, { color: c.textMuted }]} numberOfLines={1}>
                    for {item.sources.join(', ')}
                  </Text>
                )}
              </View>
              <Text style={{ color: c.textMuted }}>{fmt(item.quantity)} {item.unit}</Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
