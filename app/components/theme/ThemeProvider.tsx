import React, { createContext, useContext } from 'react';
import { ColorSchemeName } from 'react-native';

const ThemeContext = createContext<ColorSchemeName>('light');

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  value: ColorSchemeName;
  children: React.ReactNode;
}

export function ThemeProvider({ value, children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
