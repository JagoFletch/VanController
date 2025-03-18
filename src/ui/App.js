import React, { useState, useEffect } from 'react';
import './styles/global.css';
import './styles/touch.css';
import HomeScreen from './screens/HomeScreen';
import SetupScreen from './screens/SetupScreen';
import SettingsScreen from './screens/SettingsScreen';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  const [isFirstUse, setIsFirstUse] = useState(false);
  const [setupQuestions, setSetupQuestions] = useState([]);
  const [userConfig, setUserConfig] = useState({});
  const [extensions, setExtensions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'settings'

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load example extensions (for development)
  useEffect(() => {
    // In a real app, this would load from extensionManager
    const demoExtensions = {
      'system-info': {
        name: 'System Info',
        description: 'Shows Raspberry Pi system information',
        component: () => (
          <div style={{ padding: '10px' }}>
            <h3>System Information</h3>
            <p>CPU Temperature: 45.2°C</p>
            <p>Memory Usage: 512MB / 1024MB</p>
            <p>Uptime: 3.5 hours</p>
          </div>
        ),
        version: '1.0.0',
        author: 'VanController Team'
      },
      'clock': {
        name: 'Digital Clock',
        description: 'Shows a digital clock with date',
        component: () => {
          const [time, setTime] = useState(new Date());
          
          useEffect(() => {
            const timer = setInterval(() => {
              setTime(new Date());
            }, 1000);
            return () => clearInterval(timer);
          }, []);
          
          return (
            <div style={{ textAlign: 'center', padding: '15px' }}>
              <h3>Digital Clock</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {time.toLocaleTimeString()}
              </div>
              <div>{time.toLocaleDateString()}</div>
            </div>
          );
        },
        version: '1.0.0',
        author: 'VanController Team'
      }
    };
    
    setExtensions(demoExtensions);
  }, []);

  const handleSetupComplete = (config) => {
    setUserConfig(config);
    setIsFirstUse(false);
  };

  const handleNavigation = (screen) => {
    setCurrentScreen(screen);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#121212',
        color: 'white'
      }}>
        <h2>Loading Van Controller...</h2>
      </div>
    );
  }

  if (isFirstUse) {
    return (
      <ThemeProvider>
        <SetupScreen 
          questions={setupQuestions} 
          onComplete={handleSetupComplete} 
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {currentScreen === 'settings' ? (
        <SettingsScreen 
          extensions={extensions}
          onBack={() => handleNavigation('home')}
          onReload={() => {
            // In a real app, this would reload the extensions
            console.log('Reloading extensions...');
          }}
        />
      ) : (
        <HomeScreen 
          extensions={extensions}
          onSettings={() => handleNavigation('settings')}
        />
      )}
    </ThemeProvider>
  );
};

export default App;
