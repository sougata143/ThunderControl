import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export default function ThemedView(props: ThemedViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const backgroundColor = theme === 'light' ? lightColor ?? colors.background : darkColor ?? colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
