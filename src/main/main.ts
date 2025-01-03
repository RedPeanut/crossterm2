import { app, BrowserWindow, screen, ipcMain } from 'electron';
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const getMaxScreenSize = () => {
  let rect = { x: -1, y: -1, height: -1, width: -1 };
  const _screen = screen.getDisplayMatching(rect);
  return {
    ..._screen.workArea
  }
}

const getWindowSize = () => {

  // todo: if dev maxmize window
  // else if exist last state window size then use
  // else set to default size (width: 1024, height: 728)

  const {
    width: maxWidth,
    height: maxHeight
  } = getMaxScreenSize();

  return {
    x: 0, y: 0,
    width: maxWidth,
    height: maxHeight
  }
}

const installIpc = () => {
  ipcMain.on('new', (event, args: any[]) => {
    console.log('[index.ts/new] args =', args);
  });

  ipcMain.on('data', (event, args: any[]) => {
    console.log('[index.ts/data] args =', args);
  });
}

const createWindow = (): void => {

  const { x, y, width, height } = getWindowSize();
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    // show: false,
    x, y, width, height,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  installIpc();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
