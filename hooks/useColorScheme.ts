import { ColorSchemeName, useColorScheme as useNativeColorScheme } from 'react-native';

export function useColorScheme(): NonNullable<ColorSchemeName> {
  const colorScheme = useNativeColorScheme();
  return colorScheme ?? 'light';
}
