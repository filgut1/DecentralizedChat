const readline = require("readline"); // load readline library
const colors = require('colors'); // load color library
const rl = readline.createInterface(process.stdin, process.stdout);
const io = require ('socket.io-client');
let prefix = '';



// continue read input from repl
function continueRepl(){
    rl.setPrompt(prefix, prefix.length);
    rl.prompt();
}

rl.on('line', line => {
    line = line.trim();

    if (line.startsWith('connect')) {
        line = line.split(' ') 
        if (!line.length) {
            prefix = 'Enter user id after connect';
            continueRepl();
            return;
        } else {
            const userid = line[1];
            const socket = io('http://localhost:3000', {
                query: {
                    'user-id': userid
                    }
            });
        }
    }

    continueRepl();
});