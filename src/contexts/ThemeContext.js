import React, { createContext, useState } from 'react';

const themes = {
  dark: {
    name: 'Dark Theme',
    colors: {
      primary: '#4CAF50',
      secondary: '#2196F3',
      background: '#121212',
      surface: '#1e1e1e',
      surfaceLight: '#2a2a2a',
      text: '#ffffff',
      textSecondary: '#aaaaaa',
    }
  }
};

// Create context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.dark);
  
  // Change the theme
  const changeTheme = (themeKey) => {
    if (themes[themeKey]) {
      setCurrentTheme(themes[themeKey]);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
