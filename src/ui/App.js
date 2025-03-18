import React, { useState, useEffect } from 'react';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFirstUse, setIsFirstUse] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Check if this is the first use
    // In a real app, we would check local storage or a config file
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsFirstUse(false);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (isFirstUse) {
    return <FirstUseSetup onComplete={() => setIsFirstUse(false)} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Van Controller</h1>
      <div>
        <h2>Current Time</h2>
        <p>{currentTime.toLocaleTimeString()}</p>
        <p>{currentTime.toLocaleDateString()}</p>
      </div>
      <div>
        <h2>Extensions</h2>
        <p>No extensions installed yet.</p>
      </div>
    </div>
  );
};

// First-use setup component
const FirstUseSetup = ({ onComplete }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Van Controller</h1>
      <p>Let's set up your system.</p>
      <div style={{ marginTop: '20px' }}>
        <h2>Vehicle Information</h2>
        <div>
          <label>Vehicle Make: </label>
          <input type="text" />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Vehicle Model: </label>
          <input type="text" />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Year: </label>
          <input type="number" />
        </div>
      </div>
      <button 
        style={{ 
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={onComplete}
      >
        Complete Setup
      </button>
    </div>
  );
};

export default App;