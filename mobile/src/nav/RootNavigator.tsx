import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { RecipesScreen } from '../screens/RecipesScreen';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';
import { MealPlanScreen } from '../screens/MealPlanScreen';
import { GroceryScreen } from '../screens/GroceryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useTheme } from '../theme/useTheme';

export type RootStackParamList = {
  Tabs: undefined;
  RecipeDetail: { recipeId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const { c, brand } = useTheme();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22 }}>{label}</Text>
      <View
        style={{
          marginTop: 2,
          height: 3,
          width: focused ? 18 : 0,
          borderRadius: 2,
          backgroundColor: brand.primary,
        }}
      />
    </View>
  );
}

function TabsNavigator() {
  const { c } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          borderTopColor: c.border,
          backgroundColor: c.surface,
          height: 66,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="Recipes"
        component={RecipesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="🍽️" focused={focused} /> }}
      />
      <Tabs.Screen
        name="Plan"
        component={MealPlanScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="🗓️" focused={focused} /> }}
      />
      <Tabs.Screen
        name="Grocery"
        component={GroceryScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="🛒" focused={focused} /> }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="👤" focused={focused} /> }}
      />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
