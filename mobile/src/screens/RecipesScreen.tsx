import { useMemo, useState } from 'react';
import { FlatList, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../nav/RootNavigator';
import { useAppState } from '../state/AppState';
import { useTheme } from '../theme/useTheme';
import { Chip } from '../components/Chip';
import { RecipeCard } from '../components/RecipeCard';
import { ScreenHeader } from '../components/ScreenHeader';
import type { Cuisine } from '../types/models';

const CUISINES: (Cuisine | 'All')[] = ['All', 'Turkish', 'Mediterranean', 'Middle Eastern', 'Italian', 'Asian'];

export function RecipesScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { recipes, favorites, toggleFavorite } = useAppState();
  const { c, spacing, radius } = useTheme();
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState<(Cuisine | 'All')>('All');
  const [favOnly, setFavOnly] = useState(false);

  const filtered = useMemo(() => {
    return recipes.filter(r => {
      if (cuisine !== 'All' && r.cuisine !== cuisine) return false;
      if (favOnly && !favorites.has(r.id)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const inTitle = r.title.toLowerCase().includes(q);
        const inSummary = r.summary.toLowerCase().includes(q);
        const inTag = r.tags.some(t => t.includes(q));
        const inIng = r.ingredients.some(i => i.name.includes(q));
        if (!inTitle && !inSummary && !inTag && !inIng) return false;
      }
      return true;
    });
  }, [recipes, cuisine, favOnly, favorites, query]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScreenHeader eyebrow="AFİYET" title="What are we cooking?" />
      <View style={{ paddingHorizontal: spacing.lg }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search ingredients, tags, dishes…"
          placeholderTextColor={c.textMuted}
          style={{
            backgroundColor: c.surface,
            borderColor: c.border,
            borderWidth: 1,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: 10,
            color: c.text,
          }}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: spacing.sm }}
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
      >
        {CUISINES.map(cz => (
          <Chip key={cz} label={cz} active={cuisine === cz} onPress={() => setCuisine(cz)} />
        ))}
        <Chip label="⭐ Favorites" active={favOnly} onPress={() => setFavOnly(v => !v)} tone="accent" />
      </ScrollView>
      <FlatList
        style={{ flex: 1 }}
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            favorite={favorites.has(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onPress={() => nav.navigate('RecipeDetail', { recipeId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}
