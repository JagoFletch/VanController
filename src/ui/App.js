import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import HomeScreen from '../screens/HomeScreen';
import SetupScreen from '../screens/SetupScreen';
import SettingsScreen from '../screens/SettingsScreen';

const { remote, ipcRenderer } = window.require('electron');

const App = () => {
  const [isFirstUse, setIsFirstUse] = useState(false);
  const [setupQuestions, setSetupQuestions] = useState([]);
  const [userConfig, setUserConfig] = useState({});
  const [extensions, setExtensions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'settings'

  // Load application data
  const loadAppData = async () => {
    setIsLoading(true);

    try {
      // Check if this is the first use
      const setupCompleted = await ipcRenderer.invoke('is-setup-completed');
      setIsFirstUse(!setupCompleted);

      // Load setup questions
      const questions = await ipcRenderer.invoke('get-setup-questions');
      setSetupQuestions(questions);

      // If setup is completed, load user config
      if (setupCompleted) {
        const config = await ipcRenderer.invoke('get-user-config');
        setUserConfig(config || {});
      }

      // Load all extensions
      const loadedExtensions = await ipcRenderer.invoke('get-extensions');
      setExtensions(loadedExtensions || {});
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppData();
  }, []);

  const handleSetupComplete = async (config) => {
    const success = await ipcRenderer.invoke('save-user-config', config);
    
    if (success) {
      setUserConfig(config);
      setIsFirstUse(false);
    } else {
      alert('Failed to save configuration. Please try again.');
    }
  };

  const handleNavigation = (screen) => {
    setCurrentScreen(screen);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <h2>Loading Van Controller...</h2>
      </div>
    );
  }

  if (isFirstUse) {
    return <SetupScreen 
      questions={setupQuestions} 
      onComplete={handleSetupComplete} 
    />;
  }

  switch (currentScreen) {
    case 'settings':
      return (
        <SettingsScreen 
          extensions={extensions}
          onBack={() => handleNavigation('home')}
          onReload={loadAppData}
        />
      );
    case 'home':
    default:
      return (
        <HomeScreen 
          extensions={extensions}
          onSettings={() => handleNavigation('settings')}
        />
      );
  }
};

export default App;