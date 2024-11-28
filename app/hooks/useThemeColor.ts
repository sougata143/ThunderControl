/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import Colors from '../constants/Colors';
import useColorScheme from './useColorScheme';

export type Theme = 'light' | 'dark';
export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

const useThemeColor = (
  props: { light?: string; dark?: string },
  colorName: ColorName
) => {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[theme][colorName];
};

export default useThemeColor;
