const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { Block, Blockchain, Transaction, DSC_chain } = require("../blockchain");
const { createInterface } = require('readline');
const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
const path = require('path');
const p2pPort = 80;
const peers = [];
const replies = [];

// Wesh

ipcMain.on('asynchronous-message', (event, arg) => {
  arg = JSON.parse(arg)
  if (arg.action === "start") {

    // emulateStart()

    function emulateStart() {
      log("Serveur démarré sur le port 80");
      setTimeout(() => {
        log("Mon adresse de peer : ws://176.133.59.194:80/")
      })
      setTimeout(() => {
        log("Tentative de connexion au peer ws://88.126.246.147:8500/");
      }, 500);
      setTimeout(() => {
        log("Connexion établie avec le peer ws://88.126.246.147:8500/");
      }, 1200);
      setTimeout(() => {
        log("Tentative de connexion au peer ws://88.126.246.147:2811/");
      }, 1400);
      setTimeout(() => {
        log("Connexion établie avec le peer ws://88.126.246.147:2811/");
      }, 2100);
      setTimeout(() => {
        receiveMessage("ws://88.126.246.147:8500/", "hello world!")
      }, 5000)
    }

    startServer(p2pPort);
    return event.reply('asynchronous-reply', 'server started successfully')
  }
  if (arg.action === "msg") {
    if (answer.startsWith('addPeer')) {
      let peer = arg.content.split(' ')[1]
      return initConnection(peer);
    }
    if (answer.startsWith('myAddress')) {
      let address = getMyAddress()
      return event.reply('asynchronous-reply', address)
    }
    if (arg.content && arg.content !== "") {
      //code to execute to send msg
      console.log("send message");
      return peers.forEach(peer => () => {
        peer.send(JSON.stringify({ type: "message", content: `${arg.content}` }))
      })
    }

    return event.reply('asynchronous-reply', 'pong')
  }
})

// modify your existing createWindow() function
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'logo.png'),
    width: 1700,
    height: 800,
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('client/index.html')
}
// ...

app.whenReady().then(() => {
  createWindow()
  ipcMain.handle('dialog:openFile', handleFileOpen)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////// my nodejs /////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getPublicIP = () => {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const myAddressLocation = 'blockchain/p2p/my_address'

const createMyAddress = async () => {
  try {
    const ip = await getPublicIP();
    fs.writeFileSync(myAddressLocation, `ws://${ip}:${p2pPort.toString()}/`);
    const buffer = fs.readFileSync(myAddressLocation, 'utf8');
    return buffer.toString();
  } catch (err) {
    console.error(err);
  }
};

createMyAddress().then((myAddress) => {
  if (myAddress) log(`Mon adresse de peer : ${myAddress}`)
})

const getMyAddress = () => {
  const buffer = fs.readFileSync(myAddressLocation, 'utf8');
  return buffer.toString();
}

let peersDataOnBase_File = "./blockchain/p2p/peerBase.json"
const getPeersOnDataBase = () => {
  return JSON.parse(fs.readFileSync(path.resolve(peersDataOnBase_File), 'utf8'))
}
let peersOnDataBase = getPeersOnDataBase();

const addPeerOnDataBase = (peer) => {
  if (!peersOnDataBase.find(p => p === peer)) {
    fs.writeFileSync(path.resolve(peersDataOnBase_File), JSON.stringify(peersOnDataBase.concat(peer)));
    log(`\nNouveau Peer dans la Base de Donnée : ${peer}`);
  }
}

const initMessageHandler = (wSocket) => {
  wSocket.on("message", data => {
    const message = JSON.parse(data);
    if (message.type == "handShakeOn") {
      addPeerOnDataBase(message.content)
      wSocket.send(JSON.stringify({ type: "handShakeOut", content: `${getMyAddress()}` }))
    }
    if (message.type == "handShakeOut") {
      addPeerOnDataBase(message.content)
      console.log(`\nConnexion établi avec le peer : ${message.content}`)
    }
    if (message.type == "message") {
      console.log(`\nMessage recu : ${message.content}`)
    }
  })
}

const initErrorHandler = (wSocket) => {
  wSocket.on('close', () => {
    console.log(`\nFin de connexion avec le peer : ${wSocket.url}`)
  });
  wSocket.on('error', () => {
    console.log(`\nErreur de connexion avec le peer : ${wSocket.url}`)
  });
};

const initConnection = (peer) => {
  console.log(`\nDemande de connexion au peer : ${peer}`);
  let wSocket = new WebSocket(peer);
  peers.push(wSocket)
  initMessageHandler(wSocket)
  initErrorHandler(wSocket)
}

const startServer = (PORT) => {
  const wServer = new WebSocket.Server({ port: PORT });

  wServer.on('connection', (wSocket) => {
    console.log(`\nDemande de Connexion reçue...`)
    wSocket.send(JSON.stringify({ type: "handShakeOn", content: `${getMyAddress()}` }))
    initMessageHandler(wSocket)
    initErrorHandler(wSocket)
  });

  wServer.on('listening', () => {
    console.log(`\nServeur démarré sur le port : ${PORT} !`);
    peersOnDataBase.forEach((peer) => initConnection(peer));
    cli.askToConsole();
  });

  wServer.on('close', () => {
    console.log('\nServeur arrêté !');
  });
}

process.on("uncaughtException", err => console.log(err));