const { app, BrowserWindow } = require('electron')
const AutoLaunch = require('auto-launch');
const autoLauncher = new AutoLaunch({
    name: "MyApp"
});
// Checking if autoLaunch is enabled, if not then enabling it.
autoLauncher.isEnabled().then(function(isEnabled) {
  if (isEnabled) return;
   autoLauncher.enable();
}).catch(function (err) {
  throw err;
});
const createWindow = () => {
  const win = new BrowserWindow({
    autoHideMenuBar: true, 
    skipTaskbar: true
  })

  win.maximize()
  win.setFullScreen(true);
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})