const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const { autoUpdater } = require("electron-updater");

let win, modal;
require("electron-reload")(__dirname + "/js");

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(__dirname, "../assets/icon.png"),
    width: 1500,
    height: 600,
    autoHideMenuBar: true
  });
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );
  win.webContents.openDevTools();
  win.maximize();

  win.on("closed", () => {
    win = null;
  });

  // modal if update is available
  modal = new BrowserWindow({ parent: win, modal: true, show: false });
}

autoUpdater.on("update-available", info => {
  // modal.show();
});
autoUpdater.on("error", err => {
  console.log("Error in auto-updater. " + err);
});
app.on("ready", createWindow);
app.on("ready", function() {
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-downloaded", info => {
  autoUpdater.quitAndInstall();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
