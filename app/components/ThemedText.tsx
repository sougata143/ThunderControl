import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface ThemedTextProps extends TextProps {
  type?: 'default' | 'defaultSemiBold' | 'defaultBold' | 'title' | 'subtitle' | 'label';
  lightColor?: string;
  darkColor?: string;
}

export default function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, type = 'default', ...otherProps } = props;
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const color = theme === 'light' ? lightColor ?? colors.text : darkColor ?? colors.text;

  let textStyle = {};
  switch (type) {
    case 'defaultBold':
      textStyle = { fontSize: 16, fontWeight: 'bold' };
      break;
    case 'defaultSemiBold':
      textStyle = { fontSize: 16, fontWeight: '600' };
      break;
    case 'title':
      textStyle = { fontSize: 24, fontWeight: 'bold' };
      break;
    case 'subtitle':
      textStyle = { fontSize: 20, fontWeight: '600' };
      break;
    case 'label':
      textStyle = { fontSize: 14, fontWeight: '500' };
      break;
    default:
      textStyle = { fontSize: 16 };
  }

  return <Text style={[{ color }, textStyle, style]} {...otherProps} />;
}
