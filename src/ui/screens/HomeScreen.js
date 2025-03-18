import React from 'react';
import Button from '../components/Button';
import Clock from '../components/Clock';

const HomeScreen = ({ extensions = {}, onSettings }) => {
  return (
    <div style={{ 
      padding: '20px',
      height: '100vh',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Van Controller</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Clock />
          <Button onClick={onSettings}>Settings</Button>
        </div>
      </header>
      
      <main style={{ flex: 1 }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {Object.keys(extensions).length > 0 ? (
            Object.entries(extensions).map(([id, ext]) => {
              const ExtComponent = ext.component;
              return (
                <div key={id} style={{ 
                  backgroundColor: '#1e1e1e',
                  borderRadius: '10px',
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <h3>{ext.name}</h3>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#aaa',
                    marginBottom: '10px'
                  }}>
                    <span>v{ext.version}</span>
                    <span> • </span>
                    <span>{ext.author}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <ExtComponent />
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ 
              gridColumn: '1 / -1',
              backgroundColor: '#1e1e1e',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <p>No extensions installed yet.</p>
              <p style={{ marginBottom: '15px' }}>Extensions provide functionality to control your campervan's systems.</p>
              <Button onClick={onSettings}>Install Extensions</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
