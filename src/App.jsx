import { Route, Routes } from 'react-router-dom';
import './App.css';
import { useContext, useEffect } from 'react';
import { AuthContext } from './context/authContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useMode, ColorModeContext } from './theme/theme';
import HomePage from './pages/HomePage/HomePage';

function App() {
  const { status } = useContext(AuthContext);
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <div className="content-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
