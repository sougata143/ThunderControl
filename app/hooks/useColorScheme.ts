import { ColorSchemeName, useColorScheme as useNativeColorScheme } from 'react-native';

const useColorScheme = (): NonNullable<ColorSchemeName> => {
  return useNativeColorScheme() ?? 'light';
};

export default useColorScheme;
