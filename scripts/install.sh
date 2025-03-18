#!/bin/bash

# VanController Installer for Raspberry Pi
set -e

echo "===================================="
echo "   VanController Installer"
echo "===================================="

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

echo "Updating system packages..."
apt update
apt upgrade -y

echo "Installing dependencies..."
apt install -y git nodejs npm chromium-browser xserver-xorg x11-xserver-utils xinit unclutter libcap2-bin wiringpi

# Check if Node.js is installed correctly
NODE_VERSION=$(node -v 2>/dev/null || echo "Node.js not found")
echo "Node.js version: $NODE_VERSION"

if [[ ! $NODE_VERSION =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Installing Node.js from NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
  apt install -y nodejs
fi

# Create installation directory
echo "Creating installation directory..."
INSTALL_DIR="/opt/vancontroller"
mkdir -p "$INSTALL_DIR"

# Clone or download the repository
echo "Downloading VanController..."
if [ -d "/tmp/VanController" ]; then
  rm -rf "/tmp/VanController"
fi

git clone https://github.com/JagoFletch/VanController.git /tmp/VanController
cp -r /tmp/VanController/* "$INSTALL_DIR/"
rm -rf /tmp/VanController

# Set permissions
echo "Setting permissions..."
chown -R pi:pi "$INSTALL_DIR"
chmod +x "$INSTALL_DIR/scripts/"*.sh

# Install dependencies and build
echo "Installing Node.js dependencies..."
cd "$INSTALL_DIR"
su pi -c "npm install"

echo "Building application..."
su pi -c "npm run build:pi"

# Set up autostart for kiosk mode
echo "Setting up autostart..."
mkdir -p /home/pi/.config/autostart
cat > /home/pi/.config/autostart/vancontroller.desktop << EOL
[Desktop Entry]
Type=Application
Name=VanController
Comment=VanController for Raspberry Pi
Exec=/opt/vancontroller/scripts/start.sh
X-GNOME-Autostart-enabled=true
EOL

# Create start script
cat > "$INSTALL_DIR/scripts/start.sh" << EOL
#!/bin/bash
# Start VanController in kiosk mode
export DISPLAY=:0
/usr/bin/electron /opt/vancontroller/src/main.js
EOL
chmod +x "$INSTALL_DIR/scripts/start.sh"

# Allow electron to run without root
setcap cap_net_bind_service=+ep /usr/bin/electron

# Create a desktop shortcut
cat > /home/pi/Desktop/VanController.desktop << EOL
[Desktop Entry]
Type=Application
Name=VanController
Comment=VanController for Raspberry Pi
Exec=/opt/vancontroller/scripts/start.sh
Icon=/opt/vancontroller/assets/icon.svg
Terminal=false
Categories=Utility;
EOL
chmod +x /home/pi/Desktop/VanController.desktop

# Create a service file for automatic startup
cat > /etc/systemd/system/vancontroller.service << EOL
[Unit]
Description=VanController Service
After=network.target

[Service]
Type=simple
User=pi
Environment=DISPLAY=:0
WorkingDirectory=/opt/vancontroller
ExecStart=/opt/vancontroller/scripts/start.sh
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOL

# Enable and start the service
systemctl daemon-reload
systemctl enable vancontroller.service

echo "===================================="
echo "   Installation Complete!"
echo "===================================="
echo "VanController has been installed to: $INSTALL_DIR"
echo "It will automatically start when your Raspberry Pi boots."
echo "To start it manually, run: systemctl start vancontroller"
echo "To see the status, run: systemctl status vancontroller"
echo "To restart it, run: systemctl restart vancontroller"
echo "To stop it, run: systemctl stop vancontroller"

# Ask if user wants to reboot now
read -p "Do you want to reboot now to start VanController? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Rebooting..."
  reboot
fi

exit 0