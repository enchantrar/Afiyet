export type Cuisine =
  | 'Turkish'
  | 'Mediterranean'
  | 'Middle Eastern'
  | 'Italian'
  | 'Asian'
  | 'American'
  | 'Mexican';

export type Diet = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'high-protein';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
  aisle?: 'produce' | 'pantry' | 'dairy' | 'meat' | 'bakery' | 'frozen' | 'other';
};

export type Recipe = {
  id: string;
  title: string;
  summary: string;
  cuisine: Cuisine;
  diets: Diet[];
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  emoji: string;
  color: string;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
};

export type PlannedMeal = {
  id: string;
  recipeId: string;
  date: string;
  slot: MealSlot;
  servings: number;
};

export type GroceryItem = {
  key: string;
  name: string;
  quantity: number;
  unit: string;
  aisle: NonNullable<Ingredient['aisle']>;
  checked: boolean;
  sources: string[];
};

export type Profile = {
  name: string;
  householdSize: number;
  dietaryPreferences: Diet[];
  dislikedIngredients: string[];
};
