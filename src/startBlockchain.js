const crypto = require("crypto"); SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");
const EC = require("elliptic").ec, ec = new EC("secp256k1");
const { Block, Blockchain, Transaction, DSC_chain } = require("./blockchain");

const MINT_PRIVATE_ADDRESS = "0700a1ad28a20e5b2a517c00242d3e25a88d84bf54dce9e1733e6096e6d6495e";
const MINT_KEY_PAIR = ec.keyFromPrivate(MINT_PRIVATE_ADDRESS, "hex");
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");

const privateKey = "62d101759086c306848a0c1020922a78e8402e1330981afe9404d0ecc0a4be3d";
const keyPair = ec.keyFromPrivate(privateKey, "hex");
const publicKey = keyPair.getPublic("hex");

const keyPair_ = ec.genKeyPair("hex")
const privateKey_ = keyPair_.getPrivate("hex");
const publicKey_ = keyPair_.getPublic("hex");

console.log("============");
console.log(publicKey, privateKey);
console.log("============");
console.log(publicKey_, privateKey_);
console.log("============");

const WS = require("ws");

const PORT = 80;
const PEERS = ["ws://88.126.246.147/"];
const MY_ADDRESS = "ws://176.133.59.194:" + PORT.toString();
const server = new WS.Server({ port: PORT });

let [opened, connected, check, checked] = [];
let checking = false;
let tempChain = new Blockchain();

console.log("Listening on PORT", PORT);

server.on("connection", async (socket, req) => {
    socket.on("message", message => {
        const _message = JSON.parse(message);

        console.log("===");
        console.log(_message.type);
        console.log("===");

        switch (_message.type) {
            case "TYPE_REPLACE_CHAIN":
                const [newBlock, newDiff] = _message.data;

                const ourTx = [...DSC_chain.transactions.map(tx => JSON.stringify(tx))];
                const theirTx = [...newBlock.data.filter(tx => tx.from !== MINT_PUBLIC_ADDRESS).map(tx => JSON.stringify(tx))];
                const n = theirTx.length;

                if (newBlock.prevHash !== DSC_chain.getLastBlock().prevHash) {
                    for (let i = 0; i < n; i++) {
                        const index = ourTx.indexOf(theirTx[0]);

                        if (index === -1) break;

                        ourTx.splice(index, 1);
                        theirTx.splice(0, 1);
                    }

                    if (
                        theirTx.length === 0 &&
                        SHA256(DSC_chain.getLastBlock().hash + newBlock.timestamp + JSON.stringify(newBlock.data) + newBlock.nonce) === newBlock.hash &&
                        newBlock.hash.startsWith("000" + Array(Math.round(Math.log(DSC_chain.difficulty) / Math.log(16) + 1)).join("0")) &&
                        Block.hasValidTransactions(newBlock, DSC_chain) &&
                        (parseInt(newBlock.timestamp) > parseInt(DSC_chain.getLastBlock().timestamp) || DSC_chain.getLastBlock().timestamp === "") &&
                        parseInt(newBlock.timestamp) < Date.now() &&
                        DSC_chain.getLastBlock().hash === newBlock.prevHash &&
                        (newDiff + 1 === DSC_chain.difficulty || newDiff - 1 === DSC_chain.difficulty)
                    ) {
                        DSC_chain.chain.push(newBlock);
                        DSC_chain.difficulty = newDiff;
                        DSC_chain.transactions = [...ourTx.map(tx => JSON.parse(tx))];
                    }
                } else if (!checked.includes(JSON.stringify([newBlock.prevHash, DSC_chain.chain[DSC_chain.chain.length - 2].timestamp || ""]))) {
                    checked.push(JSON.stringify([DSC_chain.getLastBlock().prevHash, DSC_chain.chain[DSC_chain.chain.length - 2].timestamp || ""]));

                    const position = DSC_chain.chain.length - 1;

                    checking = true;

                    sendMessage(produceMessage("TYPE_REQUEST_CHECK", MY_ADDRESS));

                    setTimeout(() => {
                        checking = false;

                        let mostAppeared = check[0];

                        check.forEach(group => {
                            if (check.filter(_group => _group === group).length > check.filter(_group => _group === mostAppeared).length) {
                                mostAppeared = group;
                            }
                        })

                        const group = JSON.parse(mostAppeared)

                        DSC_chain.chain[position] = group[0];
                        DSC_chain.transactions = [...group[1]];
                        DSC_chain.difficulty = group[2];

                        check.splice(0, check.length);
                    }, 5000);
                }

                break;

            case "TYPE_REQUEST_CHECK":
                opened.filter(node => node.address === _message.data)[0].socket.send(
                    JSON.stringify(produceMessage(
                        "TYPE_SEND_CHECK",
                        JSON.stringify([DSC_chain.getLastBlock(), DSC_chain.transactions, DSC_chain.difficulty])
                    ))
                );

                break;

            case "TYPE_SEND_CHECK":
                if (checking) check.push(_message.data);

                break;

            case "TYPE_CREATE_TRANSACTION":
                const transaction = _message.data;

                DSC_chain.addTransaction(transaction);

                break;

            case "TYPE_SEND_CHAIN":
                const { block, finished } = _message.data;

                if (!finished) {
                    tempChain.chain.push(block);
                } else {
                    tempChain.chain.push(block);
                    if (Blockchain.isValid(tempChain)) {
                        DSC_chain.chain = tempChain.chain;
                    }
                    tempChain = new Blockchain();
                }

                break;

            case "TYPE_REQUEST_CHAIN":
                const socket = opened.filter(node => node.address === _message.data)[0].socket;

                for (let i = 1; i < DSC_chain.chain.length; i++) {
                    socket.send(JSON.stringify(produceMessage(
                        "TYPE_SEND_CHAIN",
                        {
                            block: DSC_chain.chain[i],
                            finished: i === DSC_chain.chain.length - 1
                        }
                    )));
                }

                break;

            case "TYPE_REQUEST_INFO":
                opened.filter(node => node.address === _message.data)[0].socket.send(JSON.stringify(produceMessage(
                    "TYPE_SEND_INFO",
                    [DSC_chain.difficulty, DSC_chain.transactions]
                )));

                break;

            case "TYPE_SEND_INFO":
                [DSC_chain.difficulty, DSC_chain.transactions] = _message.data;

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

PEERS.forEach(peer => connect(peer));

setTimeout(() => {
    const transaction = new Transaction(publicKey, "046856ec283a5ecbd040cd71383a5e6f6ed90ed2d7e8e599dbb5891c13dff26f2941229d9b7301edf19c5aec052177fac4231bb2515cb59b1b34aea5c06acdef43", 200, 10);

    transaction.sign(keyPair);

    sendMessage(produceMessage("TYPE_CREATE_TRANSACTION", transaction));

    DSC_chain.addTransaction(transaction);

}, 1000);

setTimeout(() => {
    const transaction = new Transaction(publicKey, "046856ec283a5ecbd040cd71383a5e6f6ed90ed2d7e8e599dbb5891c13dff26f2941229d9b7301edf19c5aec052177fac4231bb2515cb59b1b34aea5c06acdef43", 200, 10);

    transaction.sign(keyPair);

    sendMessage(produceMessage("TYPE_CREATE_TRANSACTION", transaction));

    DSC_chain.addTransaction(transaction);

}, 1500);


setTimeout(() => {
    console.log(DSC_chain);
    console.log(DSC_chain.chain[0].data);
}, 1600);