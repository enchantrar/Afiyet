import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { GroceryItem, PlannedMeal, Profile, Recipe } from '../types/models';
import { RECIPES, findRecipe } from '../data/recipes';

type PersistShape = {
  planner: PlannedMeal[];
  grocery: GroceryItem[];
  profile: Profile;
  favorites: string[];
};

const STORAGE_KEY = 'afiyet.state.v1';

const DEFAULT_PROFILE: Profile = {
  name: 'You',
  householdSize: 2,
  dietaryPreferences: [],
  dislikedIngredients: [],
};

type Ctx = {
  recipes: Recipe[];
  planner: PlannedMeal[];
  grocery: GroceryItem[];
  profile: Profile;
  favorites: Set<string>;
  addToPlan: (recipeId: string, date: string, slot: PlannedMeal['slot']) => void;
  removeFromPlan: (id: string) => void;
  clearPlan: () => void;
  regenerateGrocery: () => void;
  toggleGroceryItem: (key: string) => void;
  clearCheckedGrocery: () => void;
  updateProfile: (p: Partial<Profile>) => void;
  toggleFavorite: (recipeId: string) => void;
  ready: boolean;
};

const AppStateCtx = createContext<Ctx | null>(null);

function normalizeKey(name: string, unit: string) {
  return `${name.trim().toLowerCase()}::${unit.trim().toLowerCase()}`;
}

function buildGrocery(planner: PlannedMeal[]): GroceryItem[] {
  const map = new Map<string, GroceryItem>();
  for (const meal of planner) {
    const recipe = findRecipe(meal.recipeId);
    if (!recipe) continue;
    const scale = meal.servings / recipe.servings;
    for (const ing of recipe.ingredients) {
      const key = normalizeKey(ing.name, ing.unit);
      const existing = map.get(key);
      const scaledQty = round(ing.quantity * scale);
      if (existing) {
        existing.quantity = round(existing.quantity + scaledQty);
        if (!existing.sources.includes(recipe.title)) existing.sources.push(recipe.title);
      } else {
        map.set(key, {
          key,
          name: ing.name,
          quantity: scaledQty,
          unit: ing.unit,
          aisle: ing.aisle ?? 'other',
          checked: false,
          sources: [recipe.title],
        });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.aisle.localeCompare(b.aisle) || a.name.localeCompare(b.name));
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function mergeGrocery(prev: GroceryItem[], next: GroceryItem[]): GroceryItem[] {
  const checked = new Map(prev.filter(i => i.checked).map(i => [i.key, true]));
  return next.map(i => (checked.has(i.key) ? { ...i, checked: true } : i));
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [planner, setPlanner] = useState<PlannedMeal[]>([]);
  const [grocery, setGrocery] = useState<GroceryItem[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw) as PersistShape;
          setPlanner(data.planner ?? []);
          setGrocery(data.grocery ?? []);
          setProfile({ ...DEFAULT_PROFILE, ...(data.profile ?? {}) });
          setFavorites(new Set(data.favorites ?? []));
        }
      } catch (err) {
        console.warn('Failed to load state', err);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const shape: PersistShape = { planner, grocery, profile, favorites: [...favorites] };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(shape)).catch(err =>
      console.warn('Failed to save state', err),
    );
  }, [ready, planner, grocery, profile, favorites]);

  const addToPlan = useCallback((recipeId: string, date: string, slot: PlannedMeal['slot']) => {
    const recipe = findRecipe(recipeId);
    if (!recipe) return;
    setPlanner(prev => {
      const id = `${recipeId}-${date}-${slot}-${Date.now()}`;
      return [...prev, { id, recipeId, date, slot, servings: recipe.servings }];
    });
  }, []);

  const removeFromPlan = useCallback((id: string) => {
    setPlanner(prev => prev.filter(m => m.id !== id));
  }, []);

  const clearPlan = useCallback(() => setPlanner([]), []);

  const regenerateGrocery = useCallback(() => {
    setGrocery(prev => mergeGrocery(prev, buildGrocery(planner)));
  }, [planner]);

  useEffect(() => {
    if (!ready) return;
    setGrocery(prev => mergeGrocery(prev, buildGrocery(planner)));
  }, [planner, ready]);

  const toggleGroceryItem = useCallback((key: string) => {
    setGrocery(prev => prev.map(i => (i.key === key ? { ...i, checked: !i.checked } : i)));
  }, []);

  const clearCheckedGrocery = useCallback(() => {
    setGrocery(prev => prev.filter(i => !i.checked));
  }, []);

  const updateProfile = useCallback((p: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...p }));
  }, []);

  const toggleFavorite = useCallback((recipeId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(recipeId)) next.delete(recipeId);
      else next.add(recipeId);
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      recipes: RECIPES,
      planner,
      grocery,
      profile,
      favorites,
      addToPlan,
      removeFromPlan,
      clearPlan,
      regenerateGrocery,
      toggleGroceryItem,
      clearCheckedGrocery,
      updateProfile,
      toggleFavorite,
      ready,
    }),
    [
      planner, grocery, profile, favorites, ready,
      addToPlan, removeFromPlan, clearPlan, regenerateGrocery,
      toggleGroceryItem, clearCheckedGrocery, updateProfile, toggleFavorite,
    ],
  );

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
