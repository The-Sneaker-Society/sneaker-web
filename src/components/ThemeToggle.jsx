import { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ColorModeContext } from '../theme/theme';
import { useColors } from '../theme/colors';

const ThemeToggle = () => {
  const colors = useColors();
  const { toggleColorMode } = useContext(ColorModeContext);

  return (
    <Tooltip title={`Switch to ${colors.isDark ? 'light' : 'dark'} mode`}>
      <IconButton onClick={toggleColorMode} sx={{ color: colors.sidebarText }}>
        {colors.isDark ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
