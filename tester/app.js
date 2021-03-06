const readline = require("readline"); // load readline library
const colors = require('colors'); // load color library
const rl = readline.createInterface(process.stdin, process.stdout);
const io = require ('socket.io-client');
let prefix = '';
let clients = {};
let currentUser = undefined;


// continue read input from repl
function continueRepl(){
    rl.setPrompt(prefix, prefix.length);
    rl.prompt();
}

rl.on('line', line => {
    line = line.trim();

    if (line.startsWith('connect')) {
        line = line.split(' ');
        if (!line.length) {
            prefix = 'Enter user id after connect';
            continueRepl();
            return;
        } else {
            const userid = line[1];
            clients[userid] = { 
                socket: io('http://localhost:3000', {
                    query: {
                        'user-id': userid,
                    }
                })
            };
        }
    } else if (line.startsWith('message')) {
        if (!currentUser) {
            prefix = 'Set user first';
            continueRepl();
        } else {
            line = line.split(' ');
            currentUser.socket.emit('chatMessage', line[1]);
        }
    } else if (line.startsWith('list')) {
        Object.keys(clients).forEach(e => console.log(e));
    } else if (line.startsWith('set')) {
        line = line.split(' ');
        currentUser = clients[line[1]];
    }
    

    continueRepl();
});