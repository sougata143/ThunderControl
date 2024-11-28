import { ColorSchemeName, useColorScheme as useNativeColorScheme } from 'react-native';

export function useColorScheme(): NonNullable<ColorSchemeName> {
  return useNativeColorScheme() ?? 'light';
}
