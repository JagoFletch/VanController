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
    <div className="clock">
      <div className="time">{time.toLocaleTimeString()}</div>
      <div className="date">{time.toLocaleDateString()}</div>
    </div>
  );
};

export default Clock;