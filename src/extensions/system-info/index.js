import React, { useState, useEffect } from 'react';

const SystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState({
    cpuTemp: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    totalMemory: 0,
    uptime: 0,
    diskUsage: 0,
    totalDisk: 0
  });
  
  // Function to fetch system information
  // In a real extension, this would use Node.js APIs to get actual system info
  const fetchSystemInfo = () => {
    // This is a simulation for development purposes
    // On a real device, you would get this data from the OS
    
    // Simulate CPU temperature (between 40-55°C)
    const cpuTemp = (40 + Math.random() * 15).toFixed(1);
    
    // Simulate CPU usage (between 5-30%)
    const cpuUsage = (5 + Math.random() * 25).toFixed(1);
    
    // Simulate memory usage (between 40-80% of 1GB)
    const totalMemory = 1024; // MB
    const memoryUsage = Math.floor(totalMemory * (0.4 + Math.random() * 0.4));
    
    // Simulate uptime in hours (between 1-168 hours / 1 week)
    const uptime = (1 + Math.random() * 167).toFixed(1);
    
    // Simulate disk usage (between 20-60% of 16GB)
    const totalDisk = 16; // GB
    const diskUsage = (totalDisk * (0.2 + Math.random() * 0.4)).toFixed(1);
    
    setSystemInfo({
      cpuTemp,
      cpuUsage,
      memoryUsage,
      totalMemory,
      uptime,
      diskUsage,
      totalDisk
    });
  };
  
  useEffect(() => {
    // Fetch info immediately
    fetchSystemInfo();
    
    // Then update every 5 seconds
    const interval = setInterval(fetchSystemInfo, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get color based on value (green for good, yellow for warning, red for critical)
  const getValueColor = (value, warningThreshold, criticalThreshold) => {
    if (value >= criticalThreshold) return '#FF4D4D';
    if (value >= warningThreshold) return '#FFD700';
    return '#4CAF50';
  };
  
  // CPU temperature color
  const cpuTempColor = getValueColor(systemInfo.cpuTemp, 50, 70);
  
  // CPU usage color
  const cpuUsageColor = getValueColor(systemInfo.cpuUsage, 70, 90);
  
  // Memory usage color
  const memoryPercentage = (systemInfo.memoryUsage / systemInfo.totalMemory) * 100;
  const memoryColor = getValueColor(memoryPercentage, 70, 90);
  
  // Disk usage color
  const diskPercentage = (systemInfo.diskUsage / systemInfo.totalDisk) * 100;
  const diskColor = getValueColor(diskPercentage, 70, 90);
  
  return (
    <div style={{ padding: '10px' }}>
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>CPU Temp</span>
          <span style={{ color: cpuTempColor, fontWeight: 'bold' }}>
            {systemInfo.cpuTemp}°C
          </span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '4px', 
          backgroundColor: '#333',
          borderRadius: '2px',
          marginTop: '5px'
        }}>
          <div style={{ 
            width: `${(systemInfo.cpuTemp - 30) / 70 * 100}%`,
            height: '100%',
            backgroundColor: cpuTempColor,
            borderRadius: '2px',
            transition: 'width 0.5s ease, background-color 0.5s ease'
          }} />
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>CPU Usage</span>
          <span style={{ color: cpuUsageColor, fontWeight: 'bold' }}>
            {systemInfo.cpuUsage}%
          </span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '4px', 
          backgroundColor: '#333',
          borderRadius: '2px',
          marginTop: '5px'
        }}>
          <div style={{ 
            width: `${systemInfo.cpuUsage}%`,
            height: '100%',
            backgroundColor: cpuUsageColor,
            borderRadius: '2px',
            transition: 'width 0.5s ease, background-color 0.5s ease'
          }} />
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Memory</span>
          <span style={{ color: memoryColor, fontWeight: 'bold' }}>
            {systemInfo.memoryUsage} MB / {systemInfo.totalMemory} MB
          </span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '4px', 
          backgroundColor: '#333',
          borderRadius: '2px',
          marginTop: '5px'
        }}>
          <div style={{ 
            width: `${memoryPercentage}%`,
            height: '100%',
            backgroundColor: memoryColor,
            borderRadius: '2px',
            transition: 'width 0.5s ease, background-color 0.5s ease'
          }} />
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Disk Usage</span>
          <span style={{ color: diskColor, fontWeight: 'bold' }}>
            {systemInfo.diskUsage} GB / {systemInfo.totalDisk} GB
          </span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '4px', 
          backgroundColor: '#333',
          borderRadius: '2px',
          marginTop: '5px'
        }}>
          <div style={{ 
            width: `${diskPercentage}%`,
            height: '100%',
            backgroundColor: diskColor,
            borderRadius: '2px',
            transition: 'width 0.5s ease, background-color 0.5s ease'
          }} />
        </div>
      </div>
      
      <div>
        <span>Uptime: {systemInfo.uptime} hours</span>
      </div>
    </div>
  );
};

module.exports = {
  name: 'System Info',
  description: 'Shows Raspberry Pi system information',
  component: SystemInfo,
  version: '1.0.0',
  author: 'VanController Team'
};