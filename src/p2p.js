const { Block, Blockchain, Transaction, DSC_chain } = require("./blockchain");
const WS = require("ws");

const PORT = 3112;
const PEERS = [{ "ip": "88.126.246.147", "port": "3112" }];
const MY_ADDRESS = "ws://176.133.59.194:" + PORT.toString();
const server = new WS.Server({ port: PORT });

let opened = [];
let connected = [];
let check = [];
let checked = [];
let checking = false;


console.log("Listening on PORT", PORT);
server.on("connection", async (socket, req) => {
    socket.on("message", message => {
        const _message = JSON.parse(message);

        console.log("===");
        console.log(_message.type);
        console.log("===");

        switch (_message.type) {
            case "TYPE_MESSAGE":
                const msg = _message.data;
                console.log(msg);
                break;

            case "TYPE_HANDSHAKE":
                const nodes = _message.data;

                nodes.forEach(node => connect(node))
        }
    });
})

async function connect(address) {
    if (!connected.find(peerAddress => peerAddress === address) && address !== MY_ADDRESS) {
        const socket = new WS(address);

        socket.on("open", () => {
            socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE", [MY_ADDRESS, ...connected])));

            opened.forEach(node => node.socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE", [address]))));

            if (!opened.find(peer => peer.address === address) && address !== MY_ADDRESS) {
                opened.push({ socket, address });
            }

            if (!connected.find(peerAddress => peerAddress === address) && address !== MY_ADDRESS) {
                connected.push(address);
            }
        });

        socket.on("close", () => {
            opened.splice(connected.indexOf(address), 1);
            connected.splice(connected.indexOf(address), 1);
        });
    }
}

function produceMessage(type, data) {
    return { type, data };
}

function sendMessage(message) {
    opened.forEach(node => {
        node.socket.send(JSON.stringify(message));
    })
}

process.on("uncaughtException", err => console.log(err));

PEERS.forEach(peer => connect("ws://" + peer.ip + ":" + peer.port.toString() + "/"));

setTimeout(() => {
    console.log("msg 1 envoyé");
    sendMessage(produceMessage("TYPE_MESSAGE", "hello world, sa marche"))
}, 1000)

setTimeout(() => {
    console.log("msg 2 envoyé");
    sendMessage(produceMessage("TYPE_MESSAGE", "2eme msg envoyé 1sec apres"))
}, 2000)