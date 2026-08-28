import { ScrollView, Text, TextInput, View, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../state/AppState';
import { useTheme } from '../theme/useTheme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Chip } from '../components/Chip';
import type { Diet } from '../types/models';

const DIETS: Diet[] = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'high-protein'];

export function ProfileScreen() {
  const { profile, updateProfile, planner, grocery, favorites, clearPlan } = useAppState();
  const { c, radius, spacing, typography, brand } = useTheme();

  const toggleDiet = (d: Diet) => {
    const set = new Set(profile.dietaryPreferences);
    if (set.has(d)) set.delete(d);
    else set.add(d);
    updateProfile({ dietaryPreferences: [...set] });
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScreenHeader eyebrow="YOUR KITCHEN" title="Profile" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
        <Section title="Cook">
          <Field label="Name">
            <TextInput
              value={profile.name}
              onChangeText={n => updateProfile({ name: n })}
              style={{
                backgroundColor: c.surface,
                color: c.text,
                borderRadius: radius.md,
                borderColor: c.border,
                borderWidth: 1,
                paddingHorizontal: spacing.md,
                paddingVertical: 10,
              }}
            />
          </Field>
          <Field label="Household size">
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Pressable
                onPress={() => updateProfile({ householdSize: Math.max(1, profile.householdSize - 1) })}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  backgroundColor: brand.primarySoft,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>−</Text>
              </Pressable>
              <Text style={[typography.title, { color: c.text, minWidth: 24, textAlign: 'center' }]}>
                {profile.householdSize}
              </Text>
              <Pressable
                onPress={() => updateProfile({ householdSize: profile.householdSize + 1 })}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  backgroundColor: brand.primarySoft,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>+</Text>
              </Pressable>
            </View>
          </Field>
        </Section>

        <Section title="Dietary preferences">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs }}>
            {DIETS.map(d => (
              <Chip
                key={d}
                label={d}
                active={profile.dietaryPreferences.includes(d)}
                onPress={() => toggleDiet(d)}
                tone="accent"
              />
            ))}
          </View>
        </Section>

        <Section title="At a glance">
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Stat label="Planned" value={planner.length} />
            <Stat label="Groceries" value={grocery.length} />
            <Stat label="Favorites" value={favorites.size} />
          </View>
        </Section>

        <Pressable
          onPress={() =>
            Alert.alert('Reset meal plan?', 'This clears all planned meals.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: clearPlan },
            ])
          }
          style={{
            marginTop: spacing.xl,
            padding: spacing.md,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: c.border,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: c.textMuted }}>Reset meal plan</Text>
        </Pressable>

        <Text style={[typography.caption, { color: c.textMuted, textAlign: 'center', marginTop: spacing.lg }]}>
          Afiyet · v0.1 — built with 🍅 and 🫒
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { c, spacing, typography } = useTheme();
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[typography.micro, { color: c.textMuted, marginBottom: spacing.sm }]}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { c, spacing, typography } = useTheme();
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={[typography.caption, { color: c.textMuted, marginBottom: 4 }]}>{label}</Text>
      {children}
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
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
        alignItems: 'center',
      }}
    >
      <Text style={[typography.title, { color: c.text }]}>{value}</Text>
      <Text style={[typography.micro, { color: c.textMuted, marginTop: 2 }]}>{label.toUpperCase()}</Text>
    </View>
  );
}
