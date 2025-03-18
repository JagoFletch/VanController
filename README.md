# VanController

A Raspberry Pi-based touch screen controller for campervan electronics.

## Features

- Beautiful, high-end GUI with support for complex graphics
- Dynamic loading of extensions for controlling various accessories
- Customizable themes to personalize your experience
- First-use setup screen for vehicle configuration
- Kiosk mode display with time and date
- User-installable extensions
- Hardware access for Raspberry Pi GPIO control

## Installation on Raspberry Pi

Run the following command to install VanController on your Raspberry Pi:

```bash
curl -sSL https://raw.githubusercontent.com/JagoFletch/VanController/main/scripts/install.sh | sudo bash
Development
Prerequisites

Node.js 14 or higher
npm 6 or higher

Setup

Clone the repository:
bashCopygit clone https://github.com/JagoFletch/VanController.git
cd VanController

Install dependencies:
bashCopynpm install

Start the development server:
bashCopynpm run dev


Building for Raspberry Pi
bashCopynpm run build:pi
Creating Extensions
Extensions are JavaScript modules that can be loaded dynamically by the VanController.
Each extension should include:

A name and description
A React component to render
Version information
Author information

Example extension structure:
Copy/extensions/my-extension/
  index.js        # Main extension entry point
  [other files]   # Additional files needed by the extension
Example index.js:
javascriptCopyimport React from 'react';

const MyExtension = () => {
  return (
    <div>
      <h2>My Extension</h2>
      <p>This is a custom extension for VanController.</p>
      {/* Extension UI elements */}
    </div>
  );
};

module.exports = {
  name: 'My Extension',
  description: 'A custom extension for VanController',
  component: MyExtension,
  version: '1.0.0',
  author: 'Your Name'
};
See the Extension Development Guide for more details.
Hardware Support
VanController supports interfacing with the Raspberry Pi hardware:

GPIO control for digital inputs and outputs
I2C, SPI, and UART for connected sensors and devices

Theme Customization
VanController comes with multiple themes that can be selected in the Settings page:

Dark Theme (default)
Blue Theme
Sunset Theme

License
This project is licensed under the MIT License - see the LICENSE file for details.
Copy
Now let's commit all of these changes to GitHub:

```bash
git add .
git commit -m "Add themes, hardware access, and system information"
git push origin master
With these enhancements, your VanController now supports:

Multiple themes with a theme switcher
Hardware access through GPIO pins
System information monitoring
Touch-optimized UI
Detailed extension documentation

These features make the VanController a more complete solution for campervan control systems, with the ability to extend its functionality through custom extensions.