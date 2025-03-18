import React, { useState } from 'react';
import Button from '../components/Button';
import ThemeSelector from '../components/ThemeSelector';

const { remote, ipcRenderer } = window.require('electron');
const { dialog } = remote;

const SettingsScreen = ({ extensions, onBack, onReload }) => {
  const [selectedExtension, setSelectedExtension] = useState(null);

  const handleInstallExtension = async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Extension Directory'
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const success = await ipcRenderer.invoke('install-extension', result.filePaths[0]);
      
      if (success) {
        alert('Extension installed successfully! Reloading extensions...');
        if (onReload) onReload();
      } else {
        alert('Failed to install extension. Check the logs for more information.');
      }
    }
  };

  const handleUninstallExtension = async () => {
    if (!selectedExtension) return;
    
    if (window.confirm(`Are you sure you want to uninstall the "${extensions[selectedExtension].name}" extension?`)) {
      const success = await ipcRenderer.invoke('uninstall-extension', selectedExtension);
      
      if (success) {
        alert('Extension uninstalled successfully! Reloading extensions...');
        setSelectedExtension(null);
        if (onReload) onReload();
      } else {
        alert('Failed to uninstall extension. Check the logs for more information.');
      }
    }
  };

  const handleResetSetup = async () => {
    if (window.confirm('Are you sure you want to reset the setup? This will delete your configuration and restart the setup process.')) {
      const success = await ipcRenderer.invoke('reset-setup');
      
      if (success) {
        alert('Setup reset successfully! The application will now restart.');
        remote.app.relaunch();
        remote.app.exit(0);
      } else {
        alert('Failed to reset setup. Check the logs for more information.');
      }
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Settings</h1>
          <Button onClick={onBack}>Back to Dashboard</Button>
        </div>
      </header>
      
      <main className="main" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card">
          <h2>Appearance</h2>
          <ThemeSelector />
        </div>
        
        <div className="card">
          <h2>Extensions</h2>
          
          <div style={{ margin: '20px 0' }}>
            <Button onClick={handleInstallExtension}>Install Extension</Button>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Installed Extensions</h3>
            <ul style={{ 
              listStyle: 'none',
              padding: 0,
              margin: '10px 0',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {Object.keys(extensions).length > 0 ? (
                Object.entries(extensions).map(([id, ext]) => (
                  <li 
                    key={id}
                    onClick={() => setSelectedExtension(id)}
                    style={{ 
                      padding: '10px',
                      marginBottom: '5px',
                      backgroundColor: selectedExtension === id ? 'var(--surface-light)' : 'var(--surface)',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{ext.name}</span>
                      <span>v{ext.version}</span>
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}>
                      {ext.description}
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic'
                    }}>
                      by {ext.author}
                    </div>
                  </li>
                ))
              ) : (
                <li style={{ padding: '10px' }}>
                  No extensions installed
                </li>
              )}
            </ul>
            
            {selectedExtension && (
              <Button 
                primary={false} 
                onClick={handleUninstallExtension}
              >
                Uninstall Selected Extension
              </Button>
            )}
          </div>
        </div>
        
        <div className="card">
          <h2>System</h2>
          
          <div style={{ margin: '20px 0' }}>
            <h3>Reset Setup</h3>
            <p style={{ margin: '10px 0' }}>
              This will delete your configuration and restart the setup process.
            </p>
            <Button 
              primary={false}
              onClick={handleResetSetup}
            >
              Reset Setup
            </Button>
          </div>
          
          <div style={{ margin: '20px 0' }}>
            <h3>About</h3>
            <p style={{ margin: '10px 0' }}>
              VanController v0.1.0
            </p>
            <p style={{ margin: '10px 0' }}>
              A Raspberry Pi-based touch screen controller for campervan electronics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsScreen;