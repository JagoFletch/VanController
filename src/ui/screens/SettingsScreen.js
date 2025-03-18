import React, { useState } from 'react';
import Button from '../components/Button';

const SettingsScreen = ({ extensions, onBack, onReload }) => {
  const [selectedExtension, setSelectedExtension] = useState(null);

  return (
    <div style={{ 
      padding: '20px',
      height: '100vh',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Settings</h1>
          <Button onClick={onBack}>Back to Dashboard</Button>
        </div>
      </header>
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ 
          backgroundColor: '#1e1e1e',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <h2>Appearance</h2>
          <p style={{ marginTop: '10px' }}>Theme customization coming soon...</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#1e1e1e',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <h2>Extensions</h2>
          
          <div style={{ margin: '20px 0' }}>
            <Button>Install Extension</Button>
          </div>
          
          <div>
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
                      backgroundColor: selectedExtension === id ? '#2a2a2a' : 'transparent',
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
                      color: '#aaa'
                    }}>
                      {ext.description}
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem',
                      color: '#aaa',
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
                style={{ marginTop: '10px' }}
              >
                Uninstall Selected Extension
              </Button>
            )}
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: '#1e1e1e',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <h2>System</h2>
          
          <div style={{ margin: '20px 0' }}>
            <h3>Reset Setup</h3>
            <p style={{ margin: '10px 0' }}>
              This will delete your configuration and restart the setup process.
            </p>
            <Button primary={false}>
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
