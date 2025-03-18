import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/global.css';
import './styles/touch.css';
import { ThemeProvider } from './contexts/ThemeContext';

ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
ReactDOM.render(<App />, document.getElementById('root'));

const LightingControl = () => {
  const [lights, setLights] = useState({
    main: { on: false, brightness: 80 },
    reading: { on: false, brightness: 50 },
    outside: { on: false, brightness: 100 },
    mood: { on: false, brightness: 30, color: '#FF00FF' }
  });

  // Toggle light on/off
  const toggleLight = (name) => {
    setLights(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        on: !prev[name].on
      }
    }));
  };

  // Change light brightness
  const changeBrightness = (name, value) => {
    setLights(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        brightness: value
      }
    }));
  };

  // Change mood light color
  const changeColor = (color) => {
    setLights(prev => ({
      ...prev,
      mood: {
        ...prev.mood,
        color
      }
    }));
  };

  return (
    <div style={{ padding: '10px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Lighting Control</h3>
      
      {Object.entries(lights).map(([name, light]) => (
        <div 
          key={name}
          style={{ 
            marginBottom: '15px',
            opacity: light.on ? 1 : 0.6,
            transition: 'opacity 0.3s ease'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <span style={{ textTransform: 'capitalize' }}>{name} Light</span>
            <button 
              onClick={() => toggleLight(name)}
              style={{
                backgroundColor: light.on ? '#4CAF50' : '#555',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                padding: '5px 10px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {light.on ? 'ON' : 'OFF'}
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px', fontSize: '0.8rem' }}>Dim</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={light.brightness}
              onChange={(e) => changeBrightness(name, parseInt(e.target.value))}
              disabled={!light.on}
              style={{ 
                flex: 1,
                margin: '0 5px',
                accentColor: name === 'mood' ? light.color : '#4CAF50'
              }}
            />
            <span style={{ marginLeft: '10px', fontSize: '0.8rem' }}>Bright</span>
          </div>
          
          {name === 'mood' && light.on && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: '10px'
            }}>
              {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'].map(color => (
                <div 
                  key={color}
                  onClick={() => changeColor(color)}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: light.color === color ? '2px solid white' : '1px solid #555',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

module.exports = {
  name: 'Lighting Control',
  description: 'Control the lights in your campervan',
  component: LightingControl,
  version: '1.0.0',
  author: 'VanController Team'
};