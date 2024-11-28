/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { createContext, useContext } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export type Theme = 'light' | 'dark';

const ThemeContext = createContext<Theme>('light');

export function useColorScheme(): Theme {
  return useNativeColorScheme() ?? 'light';
}

export function useThemeColor(
  props: { light?: string; dark?: string } | undefined,
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
): string {
  const theme = useColorScheme();
  
  if (props?.light && props?.dark) {
    return theme === 'light' ? props.light : props.dark;
  }
  
  return Colors[theme][colorName];
}

export { ThemeContext };
