const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const url = require("url");
const { autoUpdater } = require("electron-updater");

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

let win;
require("electron-reload")(__dirname + "/js");

/**
 * Create the browser window
 */

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(__dirname, "../assets/icon.png"),
    width: 1500,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );
  win.maximize();
  win.webContents.openDevTools();
  win.on("closed", () => {
    win = null;
  });
}

/**
 * Auto updater
 */

autoUpdater.on("update-available", () => {
  dialog.showMessageBox(
    {
      type: "info",
      title: "Update vorhanden",
      isVisible: true,
      message:
        "Es ist ein Update vorhanden, möchtest du jetzt die aktuelle Version herunterladen?",
      buttons: ["Ja", "Nein"]
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        autoUpdater.downloadUpdate();
      }
    }
  );
});

autoUpdater.on("download-progress", progressObj => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  console.log(log_message);
});

autoUpdater.on("error", err => {
  console.log("Error in auto-updater. " + err);
});

autoUpdater.on("update-downloaded", () => {
  dialog.showMessageBox(
    {
      title: "Updates installieren",
      message:
        "Update wurde heruntergeladen, die Anwendung wird geschlossen, um das Update zu installieren...",
      buttons: ["OK"]
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        autoUpdater.quitAndInstall();
      }
    }
  );
});

/**
 * App functions
 */

app.on("ready", function() {
  createWindow();
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

app.on("will-quit", () => {
  win.webContents.send("saveState");
});
