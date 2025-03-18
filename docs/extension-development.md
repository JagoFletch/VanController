# VanController Extension Development Guide

This guide explains how to create custom extensions for VanController. Extensions allow you to add new functionality to the VanController system without modifying the core application.

## Extension Structure

Each extension should be in its own directory with the following structure:

```
my-extension/
├── index.js        # Main extension entry point (required)
├── components/     # React components (optional)
├── utils/          # Utility functions (optional)
├── assets/         # Images, icons, etc. (optional)
└── README.md       # Documentation (optional but recommended)
```

## Creating an Extension

### Step 1: Create the Extension Directory

Create a new directory for your extension:

```bash
mkdir -p my-extension
```

### Step 2: Create the Extension Entry Point

Create an index.js file in your extension directory:

```javascript
import React from 'react';

// This is your main extension component
const MyExtension = () => {
  return (
    <div>
      <h2>My Extension</h2>
      <p>This is a custom extension for VanController.</p>
      
      {/* Add your extension UI elements here */}
    </div>
  );
};

// Export the extension properties
module.exports = {
  name: 'My Extension',           // Display name of your extension
  description: 'Description of what your extension does',
  component: MyExtension,         // The React component to render
  version: '1.0.0',               // Version string
  author: 'Your Name'             // Author name
};
```

### Step 3: Testing Your Extension

During development, you can test your extension by placing it in the src/extensions directory of the VanController project.

### Step 4: Packaging Your Extension

To distribute your extension, simply zip the entire extension directory. Users can install your extension through the VanController settings panel.

## Extension API

### React Props

Your extension component will not receive any props by default. If your extension needs to interact with the system, you can use the provided APIs.

### System APIs

VanController provides APIs for extensions to interact with the system:

#### Hardware Communication

To interact with hardware (GPIO, I2C, etc.), you can use the Node.js modules provided by Electron:

```javascript
const { remote } = window.require('electron');
const fs = remote.require('fs');
const { exec } = remote.require('child_process');

// Example: Read CPU temperature
const readCpuTemp = () => {
  return new Promise((resolve, reject) => {
    exec('cat /sys/class/thermal/thermal_zone0/temp', (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      const temp = parseInt(stdout) / 1000;
      resolve(temp);
    });
  });
};
```

#### Persistent Storage

For saving extension settings or data:

```javascript
const { remote } = window.require('electron');
const path = remote.require('path');
const fs = remote.require('fs');
const app = remote.app;

// Example: Save extension settings
const saveSettings = (settings) => {
  const dataDir = path.join(app.getPath('userData'), 'extensions', 'my-extension');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filePath = path.join(dataDir, 'settings.json');
  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
};

// Example: Load extension settings
const loadSettings = () => {
  const filePath = path.join(app.getPath('userData'), 'extensions', 'my-extension', 'settings.json');
  
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  
  return {}; // Default empty settings
};
```

## User Interface Guidelines

To maintain a consistent user experience, please follow these guidelines:

1. **Use the built-in styles**: Utilize the VanController's color scheme and styling.
2. **Support touch interfaces**: Make interactive elements at least 44×44 pixels in size.
3. **Responsive design**: Your extension should adapt to different screen sizes.
4. **Dark theme**: Design your extension with a dark theme that matches the VanController UI.
5. **Error handling**: Handle errors gracefully and provide user feedback.

## Example Extensions

Check out the following extensions for reference:

- Temperature Monitor
- Battery Monitor
- Lighting Control
- System Info

These examples demonstrate best practices for extension development.

## Submitting Extensions

To share your extension with the VanController community, you can:

1. Host it on your own GitHub repository
2. Submit a pull request to the VanController extensions repository

Make sure to include a detailed README.md file explaining what your extension does and how to use it.
