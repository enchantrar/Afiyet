import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/nav/RootNavigator';
import { AppStateProvider } from './src/state/AppState';
import { palette } from './src/theme/theme';

export default function App() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: isDark ? palette.dark.background : palette.light.background,
      card: isDark ? palette.dark.surface : palette.light.surface,
      text: isDark ? palette.dark.text : palette.light.text,
      primary: palette.brand.primary,
      border: isDark ? palette.dark.border : palette.light.border,
    },
  };

  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <NavigationContainer theme={navTheme}>
          <RootNavigator />
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </NavigationContainer>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
