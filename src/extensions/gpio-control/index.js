import React, { useState, useEffect } from 'react';

const { ipcRenderer } = window.require('electron');

// Define available GPIO pins
const availablePins = [
  { pin: 17, name: 'GPIO 17' },
  { pin: 18, name: 'GPIO 18' },
  { pin: 27, name: 'GPIO 27' },
  { pin: 22, name: 'GPIO 22' },
  { pin: 23, name: 'GPIO 23' },
  { pin: 24, name: 'GPIO 24' },
  { pin: 25, name: 'GPIO 25' }
];

const GPIOControl = () => {
  const [pins, setPins] = useState(availablePins.map(p => ({ ...p, state: false })));
  const [selectedPin, setSelectedPin] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [readValue, setReadValue] = useState(null);
  const [isRaspberryPi, setIsRaspberryPi] = useState(false);
  
  useEffect(() => {
    // Check if running on Raspberry Pi (Linux platform)
    const checkPlatform = async () => {
      try {
        const result = await ipcRenderer.invoke('gpio-access', { 
          pin: 17, 
          mode: 'read' 
        });
        
        setIsRaspberryPi(!result.error || !result.error.includes('only available on Raspberry Pi'));
      } catch (error) {
        setIsRaspberryPi(false);
      }
    };
    
    checkPlatform();
  }, []);
  
  // Toggle GPIO pin state
  const togglePin = async (index) => {
    if (!isRaspberryPi) {
      // Just update UI in simulation mode
      const newPins = [...pins];
      newPins[index].state = !newPins[index].state;
      setPins(newPins);
      return;
    }
    
    try {
      const pin = pins[index];
      const newState = !pin.state;
      
      const result = await ipcRenderer.invoke('gpio-access', { 
        pin: pin.pin, 
        mode: 'write',
        value: newState ? 1 : 0
      });
      
      if (result.success) {
        const newPins = [...pins];
        newPins[index].state = newState;
        setPins(newPins);
      } else {
        console.error('Failed to toggle GPIO pin:', result.error);
      }
    } catch (error) {
      console.error('Error toggling GPIO pin:', error);
    }
  };
  
  // Read GPIO pin value
  const readPin = async () => {
    if (!selectedPin) return;
    
    setIsReading(true);
    
    try {
      if (!isRaspberryPi) {
        // Simulate reading in non-Pi environments
        setReadValue(Math.round(Math.random()));
        setIsReading(false);
        return;
      }
      
      const result = await ipcRenderer.invoke('gpio-access', { 
        pin: selectedPin, 
        mode: 'read'
      });
      
      if (result.success) {
        setReadValue(result.value);
      } else {
        console.error('Failed to read GPIO pin:', result.error);
        setReadValue(null);
      }
    } catch (error) {
      console.error('Error reading GPIO pin:', error);
      setReadValue(null);
    } finally {
      setIsReading(false);
    }
  };
  
  return (
    <div style={{ padding: '10px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px' }}>GPIO Control</h3>
      
      {!isRaspberryPi && (
        <div style={{ 
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          borderRadius: '5px',
          fontSize: '0.9rem'
        }}>
          Running in simulation mode. GPIO control is only available on Raspberry Pi.
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Control Outputs</h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '10px',
          marginTop: '10px'
        }}>
          {pins.map((pin, index) => (
            <div 
              key={index}
              style={{
                padding: '10px',
                backgroundColor: pin.state ? 'var(--primary)' : 'var(--surface-light)',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onClick={() => togglePin(index)}
            >
              <div style={{ fontWeight: 'bold' }}>{pin.name}</div>
              <div style={{ 
                fontSize: '0.8rem',
                marginTop: '5px'
              }}>
                State: {pin.state ? 'ON' : 'OFF'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4>Read Input</h4>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <select 
            value={selectedPin || ''}
            onChange={(e) => setSelectedPin(parseInt(e.target.value))}
            style={{ flex: 1 }}
          >
            <option value="">Select a GPIO pin</option>
            {availablePins.map((pin) => (
              <option key={pin.pin} value={pin.pin}>
                {pin.name}
              </option>
            ))}
          </select>
          
          <button 
            onClick={readPin}
            disabled={!selectedPin || isReading}
            style={{ flex: 'none' }}
          >
            {isReading ? 'Reading...' : 'Read'}
          </button>
        </div>
        
        {readValue !== null && (
          <div style={{ 
            marginTop: '10px',
            padding: '10px',
            backgroundColor: 'var(--surface-light)',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <span style={{ fontWeight: 'bold' }}>Value: </span>
            <span>{readValue === 1 ? 'HIGH' : 'LOW'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

module.exports = {
  name: 'GPIO Control',
  description: 'Control and read Raspberry Pi GPIO pins',
  component: GPIOControl,
  version: '1.0.0',
  author: 'VanController Team'
};