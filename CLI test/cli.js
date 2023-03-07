const readline = require('readline')

class commandLine{
    constructor(){

    }
    askToConsole(){
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('> ', (answer) => {
            if(answer.startsWith('addPeer')){
                let peer = answer.split(' ')[1]
                console.log(peer)
                addPeer(peer);
            }
            this.askToConsole();
        });
    }

}
let cl = new commandLine();
setTimeout(()=>{
    cl.askToConsole();
}, 1000)