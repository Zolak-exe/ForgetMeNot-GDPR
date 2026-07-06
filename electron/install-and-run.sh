#!/bin/bash

echo "🛠️  Setting up Identity Scanner Electron..."

# 1. Vérifier que le serveur backend est présent
if [ ! -f "/home/zolak/Projets/identity-scanner/package.json" ]; then
  echo "❌ Backend non trouvé. Place ce dossier dans /home/zolak/Projets/identity-scanner/"
  exit 1
fi

# 2. Démarrer le serveur backend en arrière-plan (s'il ne tourne pas déjà)
if ! pgrep -f "npm run dev" > /dev/null; then
  echo "▶️  Démarrage du serveur backend..."
  cd /home/zolak/Projets/identity-scanner && npm run dev > /dev/null 2>&1 &
  sleep 3
fi

# 3. Aller dans le dossier Electron
cd /home/zolak/Projets/identity-scanner/electron

# 4. Installer les dépendances si besoin
if [ ! -d "node_modules" ]; then
  echo "▶️  Installation des dépendances Node.js..."
  npm install
fi

# 5. Créer le raccourci sur le bureau (chemin absolu)
DESKTOP_DIR="/home/zolak/Desktop"
DESKTOP_FILE="$DESKTOP_DIR/Identity-Scanner.desktop"

if [ ! -d "$DESKTOP_DIR" ]; then
  mkdir -p "$DESKTOP_DIR"
fi

echo "▶️  Création du raccourci sur le bureau..."
cat > "$DESKTOP_FILE" << 'EOF'
[Desktop Entry]
Version=1.0
Type=Application
Name=Identity Scanner
Comment=Tool for GDPR data deletion via SMTP
Exec=/home/zolak/Projets/identity-scanner/electron/node_modules/.bin/electron-forge start
Icon=/home/zolak/Projets/identity-scanner/electron/build/icon.ico
Terminal=false
Categories=Network;Security;
StartupNotify=true
EOF

# 6. Rendre le raccourci exécutable
chmod +x "$DESKTOP_FILE"

# 7. Lancer l'application en utilisant le chemin absolu vers electron-forge
echo "▶️  Lancement de l'application..."
/home/zolak/Projets/identity-scanner/electron/node_modules/.bin/electron-forge start

# 8. Message final
echo "\n✅ Identity Scanner est lancé."
echo "🔹 Raccourci créé sur le bureau : /home/zolak/Desktop/Identity-Scanner.desktop"
echo "🔹 Serveur backend démarré en arrière-plan."
echo "🔹 N'oublie pas de remplir ton .env avec tes identifiants SMTP."