import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const ThemeSelector = () => {
  const { currentTheme, changeTheme, themes } = useContext(ThemeContext);
  
  return (
    <div>
      <h3>Select Theme</h3>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '15px'
      }}>
        {Object.entries(themes).map(([key, theme]) => (
          <div
            key={key}
            onClick={() => changeTheme(key)}
            style={{
              width: '100px',
              height: '70px',
              backgroundColor: theme.colors.background,
              borderRadius: '8px',
              padding: '8px',
              border: currentTheme.name === theme.name ? `2px solid ${theme.colors.primary}` : '1px solid #555',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
          >
            <div style={{
              width: '100%',
              height: '20px',
              backgroundColor: theme.colors.primary,
              borderRadius: '4px',
              marginBottom: '8px'
            }} />
            <div style={{
              width: '80%',
              height: '15px',
              backgroundColor: theme.colors.surface,
              borderRadius: '4px'
            }} />
            <div style={{
              color: theme.colors.text,
              fontSize: '10px',
              marginTop: '5px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {theme.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;