import { useTheme } from '@mui/material';
import { tokens } from './theme';

export const getColors = (mode) => {
  const palette = tokens(mode);
  const isDark = mode === 'dark';

  return {
    mode,
    isDark,

    sidebarBg: isDark ? '#fff' : '#000',
    widgetBg: isDark ? '#000' : '#fff',

    textPrimary: isDark ? '#fff' : '#000',
    textSecondary: isDark ? '#aaa' : '#666',
    textInverse: isDark ? '#000' : '#fff',
    sidebarText: isDark ? '#000' : '#fff',

    border: isDark ? '#fff' : '#000',
    borderSecondary: isDark ? '#666' : '#999',

    status: {
      notStarted: '#E67E22',
      inProgress: '#D4AC0D',
      completed: '#2ECC71',
      pending: '#3498DB',
      error: '#e74c3c',
    },

    accent: palette,
    primary: palette.yellowAccent[500],
    secondary: palette.greenAccent[500],
    warning: '#ffc31c',
  };
};

export const useColors = () => {
  const theme = useTheme();
  return getColors(theme.palette.mode);
};
