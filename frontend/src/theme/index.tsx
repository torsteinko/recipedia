// @mui
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeOptions, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ReactNode, useMemo } from 'react';
import componentsOverride from './overrides';
import palette from './palette';
// hooks
import { useSettings } from './settings';
import shadows, { customShadows } from './shadows';
//
import shape from './shape';
import typography from './typography';

// ----------------------------------------------------------------------

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { themeMode } = useSettings();
  const isLight = themeMode === 'light';

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: isLight ? { ...palette.light, mode: 'light' } : { ...palette.dark, mode: 'dark' },
      shape,
      typography,
      shadows: isLight ? shadows.light : shadows.dark,
      customShadows: isLight ? customShadows.light : customShadows.dark,
    }),
    [isLight]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
