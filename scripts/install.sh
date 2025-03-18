#!/bin/bash

# VanController Installer for Raspberry Pi
set -e

echo "Installing VanController..."

# Update and install dependencies
sudo apt update
sudo apt upgrade -y
sudo apt install -y git nodejs npm chromium-browser xserver-xorg xinit

# Clone the repository
git clone https://github.com/yourusername/VanController.git /home/pi/VanController
cd /home/pi/VanController

# Install Node.js dependencies
npm install

# Build the application
npm run build:pi

# Set up autostart
mkdir -p /home/pi/.config/autostart
cat > /home/pi/.config/autostart/vancontroller.desktop << EOL
[Desktop Entry]
Type=Application
Name=VanController
Exec=chromium-browser --kiosk --app=file:///home/pi/VanController/dist/index.html
X-GNOME-Autostart-enabled=true
EOL

echo "Installation complete! Reboot your Raspberry Pi to start VanController."
echo "To reboot now, run: sudo reboot"