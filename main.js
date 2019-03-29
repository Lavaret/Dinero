const electron = require('electron');
const path = require('path');
const url = require('url');

// SET ENV
process.env.NODE_ENV = 'production';

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;


// Listen for app to be ready
app.on('ready', function(){
  // Create new window
  mainWindow = new BrowserWindow({});
  // Load html in window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle edit cost window
function createEditWindow(){
  addWindow = new BrowserWindow({
    width: 400,
    height: 450,
    title:'Edit cost',
  });
  addWindow.setMenu(null);
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'editWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Handle add item window
function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 400,
    height: 450,
    title:'Add a new cost',
  });
  addWindow.setMenu(null);
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Handle 'add category' window
function addCategory(){
  addWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title:'Add a new category'
  });
  addWindow.setMenu(null);
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addCategory.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Handle 'new date' window
function setDate(){
  addWindow = new BrowserWindow({
    width: 400,
    height: 400,
    title:'set Date'
  });
  addWindow.setMenu(null);
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'newDate.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Handle 'edit category' window
function editCategory(){
  addWindow = new BrowserWindow({
    width: 500,
    height: 500,
    title:'Edit Category'
  });
  addWindow.setMenu(null);
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'editCategory.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Handle 'set main sum' window
function setMainSum(){
  addWindow = new BrowserWindow({
    width: 400,
    height: 350,
    title:'Main sum'
  });
  addWindow.setMenu(null);
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'setMainSum.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Catch data from form
ipcMain.on('submitForm', function(e, value){
    mainWindow.reload();
    addWindow.close(); 
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  addWindow = null;
});

// ipc listeners

// Handle 'add a new cost' button
ipcMain.on('add_new_cost', function(e, value){
    createAddWindow();
});

ipcMain.on('edit_cost', function(e){
  createEditWindow();
});

ipcMain.on('add_new_main_sum', function(e){
  setMainSum();
});

ipcMain.on('add_category', function(e){
  addCategory();
});

ipcMain.on('set_timer', function(e){
  setDate();
});


// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'Ustawienia',
    submenu:[
      {
        label:'Edycja kategorii',
        accelerator:process.platform == 'darwin' ? 'Command+E' : 'Ctrl+E',
        click(){
          editCategory();
        }
      },
      {
        label: 'Ustaw datę początkową',
        accelerator:process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',
        click(){
          setDate();
        }
      },
      {
        label: "Ustaw główną kwotę",
        click(){
          setMainSum();
        }
      }
    ]
  },
  {
    label:'Dodaj kategorię',
    accelerator:process.platform == 'darwin' ? 'Command+K' : 'Ctrl+K',
    click(){
      addCategory();
    }
  },
  {
    label:'Dodaj koszt',
    accelerator:process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
    click(){
      createAddWindow();
    }
  }
];

// If OSX, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}