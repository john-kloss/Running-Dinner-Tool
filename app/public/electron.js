const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win;
require('electron-reload')(__dirname + '/js');

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(__dirname, '/assets/1024x1024.png'),
    width: 1500,
    height: 600,
  });
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
  // win.webContents.openDevTools();
  win.maximize();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
