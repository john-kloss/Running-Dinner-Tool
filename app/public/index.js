const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const { autoUpdater } = require("electron-updater");

let win;
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
}

autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update...");
});
autoUpdater.on("update-available", info => {
  console.log("Update available.");
});
autoUpdater.on("update-not-available", info => {
  console.log("Update not available.");
});
autoUpdater.on("error", err => {
  console.log("Error in auto-updater. " + err);
});
app.on("ready", createWindow);
app.on("ready", function() {
  autoUpdater.checkForUpdatesAndNotify();
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
