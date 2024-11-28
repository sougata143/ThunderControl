import { View, type ViewProps } from 'react-native';
import { useColorScheme } from '@/hooks/useThemeColor';
import Colors from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const theme = useColorScheme();
  const backgroundColor = (lightColor && darkColor) 
    ? (theme === 'light' ? lightColor : darkColor)
    : Colors[theme].background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
