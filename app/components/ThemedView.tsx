import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    lightColor && darkColor ? { light: lightColor, dark: darkColor } : undefined,
    'background'
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
