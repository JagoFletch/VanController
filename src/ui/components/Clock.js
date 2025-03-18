import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="clock" style={{ textAlign: 'center' }}>
      <div className="time" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        {time.toLocaleTimeString()}
      </div>
      <div className="date">
        {time.toLocaleDateString()}
      </div>
    </div>
  );
};

export default Clock;
