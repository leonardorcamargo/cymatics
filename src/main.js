const { app, BrowserWindow, desktopCapturer, Menu } = require('electron');
const path = require('path');

// Força --no-sandbox no Linux para captura de áudio funcionar
// DEVE ser chamado antes de app.whenReady()
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('no-sandbox');
  app.commandLine.appendSwitch('disable-setuid-sandbox');
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.webContents.session.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen', 'window'] })
      .then((sources) => {
        if (sources.length > 0) {
          callback({ video: sources[0], audio: 'loopback' });
        } else {
          callback({});
        }
      })
      .catch(() => callback({}));
  });

  createMenu();

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

function createMenu() {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        { role: 'quit', label: 'Sair' }
      ]
    },
    {
      label: 'Animações',
      submenu: [
        {
          label: '🌀 Psicodélica',
          click: () => {
            mainWindow.webContents.send('change-animation', 'psychedelic');
          }
        },
        {
          label: '〰️ Onda Linear',
          click: () => {
            mainWindow.webContents.send('change-animation', 'waveform');
          }
        },
        {
          label: '⭕ Circular Simples',
          click: () => {
            mainWindow.webContents.send('change-animation', 'circular');
          }
        },
        {
          label: '📊 Barras de Frequência',
          click: () => {
            mainWindow.webContents.send('change-animation', 'bars');
          }
        },
        {
          label: '✨ Partículas',
          click: () => {
            mainWindow.webContents.send('change-animation', 'particles');
          }
        },
        {
          label: '🖱️ Partículas Interativas',
          click: () => {
            mainWindow.webContents.send('change-animation', 'interactive');
          }
        }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload', label: 'Recarregar' },
        { role: 'toggleDevTools', label: 'Ferramentas do Desenvolvedor' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Tela Cheia' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
