import { View } from 'react-native';
import React from 'react';

// This is a shim for web and Android where the tab bar is generally opaque.
const TabBarBackground: React.FC = () => {
  return <View style={{ backgroundColor: 'transparent' }} />;
};

export default TabBarBackground;

export function useBottomTabOverflow() {
  return 0;
}
