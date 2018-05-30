const {app, BrowserWindow, shell, ipcMain} = require('electron');
const dialog = require('electron').dialog;
const path = require('path');
const url = require('url');
const os = require('os');
const fs = require('fs');

let win;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(__dirname, 'dinner.png'),
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
  win.webContents.openDevTools();
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

/**
 * User functions
 */

// groups were successfully imported and the plan can be created
ipcMain.on('imported-groups', (event, groups) => {
  win.webContents.send('create-plan', groups);
});

// the plan was created and we can show the results
ipcMain.on('groups-planned', (event, groups) => {
  win.send('show-results', groups);
});

ipcMain.on('open-error-dialog', (event, header, message) => {
  dialog.showErrorBox(header, message);
});

ipcMain.on('open-message-dialog', (event, title, message) => {
  dialog.showMessageBox(null, {
    type: 'info',
    buttons: ['OK'],
    title,
    message,
  });
});

ipcMain.on('export-plan', (event) => {
  const pdfPath = path.join(os.tmpdir(), 'plan.pdf');
  const win = BrowserWindow.fromWebContents(event.sender);
  win.webContents.printToPDF({}, function(error, data) {
    if (error) throw error;
    fs.writeFile(pdfPath, data, function(error) {
      if (error) {
        throw error;
      }
      shell.openExternal('file://' + pdfPath);
    });
  });
});
