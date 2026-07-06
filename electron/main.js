const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');
const http = require('node:http');

try { if (require('electron-squirrel-startup')) app.quit(); } catch { /* not on windows */ }

const PORT = 4343;
process.env.PORT = String(PORT);
process.env.PUBLIC_DIR = path.join(__dirname, 'public');

require('./server.bundle.cjs');

function waitForServerReady(timeoutMs = 8000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get(`http://127.0.0.1:${PORT}/api/health`, (res) => {
        res.resume();
        if (res.statusCode === 200) return resolve();
        retry();
      });
      req.on('error', retry);
      req.setTimeout(500, () => req.destroy());
    };
    const retry = () => {
      if (Date.now() - start > timeoutMs) return reject(new Error('Serveur local introuvable'));
      setTimeout(tryOnce, 150);
    };
    tryOnce();
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    title: 'Identity Scanner',
    autoHideMenuBar: true,
    backgroundColor: '#0b0d12',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  try {
    await waitForServerReady();
    await win.loadURL(`http://127.0.0.1:${PORT}/`);
  } catch (err) {
    await win.loadURL(
      'data:text/html;charset=utf-8,' +
        encodeURIComponent(
          `<body style="font-family:sans-serif;background:#0b0d12;color:#e7ecf3;padding:40px">
            <h1>Erreur de démarrage</h1>
            <p>Le serveur local n'a pas répondu : ${String(err).replace(/[<>&]/g, '')}</p>
          </body>`,
        ),
    );
  }
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
