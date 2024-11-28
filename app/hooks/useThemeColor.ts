/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

export type Theme = 'light' | 'dark';
export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemeColor(
  props: { light?: string; dark?: string } | undefined,
  colorName: ColorName
): string {
  const theme = useColorScheme();
  
  if (props?.light && props?.dark) {
    return theme === 'light' ? props.light : props.dark;
  }
  
  return Colors[theme][colorName];
}
