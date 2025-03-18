import React from 'react';
import Clock from '../components/Clock';
import ExtensionCard from '../components/ExtensionCard';
import Button from '../components/Button';

const HomeScreen = ({ extensions = {}, onSettings }) => {
  return (
    <div className="container">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Van Controller</h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Clock />
            <Button 
              onClick={onSettings}
              style={{ marginLeft: '15px' }}
            >
              Settings
            </Button>
          </div>
        </div>
      </header>
      
      <main className="main">
        <div className="grid">
          {Object.keys(extensions).length > 0 ? (
            Object.values(extensions).map((extension, index) => (
              <ExtensionCard key={index} extension={extension} />
            ))
          ) : (
            <div className="card empty-state">
              <p>No extensions installed yet.</p>
              <p>Extensions provide functionality to control your campervan's systems.</p>
              <Button 
                onClick={onSettings}
                style={{ marginTop: '15px' }}
              >
                Install Extensions
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;