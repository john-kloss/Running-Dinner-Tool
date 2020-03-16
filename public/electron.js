// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const os = require("os");
const url = require("url");
const { autoUpdater } = require("electron-updater");

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

const isEnvSet = "ELECTRON_IS_DEV" in process.env;
const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
const isDev = isEnvSet ? getFromEnv : !app.isPackaged;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "../assets/icon.png"),
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true
    }
  });

  mainWindow.maximize();

  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
    BrowserWindow.addDevToolsExtension(
      path.join(
        os.homedir(),
        "/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.5.0_0"
      )
    );
  } else {
    // release
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  }
}

app.on("ready", function() {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("will-quit", () => {
  win.webContents.send("saveState");
});

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
