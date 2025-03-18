import React, { createContext, useState, useEffect } from 'react';
import themes from '../styles/themes';

const { remote } = window.require('electron');
const path = remote.require('path');
const fs = remote.require('fs');
const app = remote.app;

// Create context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.dark);
  
  useEffect(() => {
    loadTheme();
  }, []);
  
  // Load the saved theme
  const loadTheme = () => {
    try {
      const configDir = path.join(app.getPath('userData'), 'config');
      const themeFilePath = path.join(configDir, 'theme.json');
      
      if (fs.existsSync(themeFilePath)) {
        const themeData = fs.readFileSync(themeFilePath, 'utf8');
        const savedTheme = JSON.parse(themeData);
        const themeKey = savedTheme.theme;
        
        if (themes[themeKey]) {
          setCurrentTheme(themes[themeKey]);
          applyThemeToDocument(themes[themeKey]);
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };
  
  // Save the theme
  const saveTheme = (themeKey) => {
    try {
      const configDir = path.join(app.getPath('userData'), 'config');
      
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      const themeFilePath = path.join(configDir, 'theme.json');
      fs.writeFileSync(themeFilePath, JSON.stringify({ theme: themeKey }, null, 2));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };
  
  // Change the theme
  const changeTheme = (themeKey) => {
    if (themes[themeKey]) {
      setCurrentTheme(themes[themeKey]);
      saveTheme(themeKey);
      applyThemeToDocument(themes[themeKey]);
    }
  };
  
  // Apply the theme to the document using CSS variables
  const applyThemeToDocument = (theme) => {
    const root = document.documentElement;
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVarName}`, value);
    });
  };
  
  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};