const { Block, Blockchain, Transaction, DSC_chain } = require("../blockchain");
const { createInterface } = require('readline');
const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
const path = require('path');
const p2pPort = 80;
const peers = []

class commandLine {
    constructor() {

    }
    askToConsole() {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('> ', (answer) => {
            if (answer.startsWith('addPeer')) {
                let peer = answer.split(' ')[1]
                return initConnection(peer);
            }
            if (answer.startsWith('myAddress')) {
                let address = getMyAddress()
                return console.log(`Mon adresse de peer est : ${address}`)
            }
            if (answer && answer !== "") {
                //code to execute to send msg
                console.log("send message");
                return peers.forEach(peer => () => {
                    peer.send(JSON.stringify({ type: "message", content: `${answer}` }))
                })
            }
            console.log(`> ! your message seems to be empty`);
            // this.askToConsole();
        });
    }
}

// let cli = new commandLine();

// const oldLog = console.log;
// console.log = function () {
//     console.log = function () {
//         console.log(arguments);
//         if (!arguments[0].startsWith("\n>")) {
//             cli.askToConsole();
//         }
//     }

//     oldLog.apply(console, arguments);
// };

// console.log = function () {
//     console.log(arguments);
//     if (!arguments[0].startsWith("\n>")) {
//         cli.askToConsole();
//     }
// }

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

const myAddressLocation = 'src/p2p/my_address'

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
    if (myAddress) console.log(`Mon adresse de peer : ${myAddress}`)
})

const getMyAddress = () => {
    const buffer = fs.readFileSync(myAddressLocation, 'utf8');
    return buffer.toString();
}

let peersDataOnBase_File = "./src/p2p/peerBase.json"
const getPeersOnDataBase = () => {
    return JSON.parse(fs.readFileSync(path.resolve(peersDataOnBase_File), 'utf8'))
}
let peersOnDataBase = getPeersOnDataBase();

const addPeerOnDataBase = (peer) => {
    if (!peersOnDataBase.find(p => p === peer)) {
        fs.writeFileSync(path.resolve(peersDataOnBase_File), JSON.stringify(peersOnDataBase.concat(peer)));
        console.log(`\nNouveau Peer dans la Base de Donnée : ${peer}`);
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

startServer(p2pPort);

process.on("uncaughtException", err => console.log(err));