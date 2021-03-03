const readline = require("readline"); // load readline library
const colors = require('colors'); // load color library
const rl = readline.createInterface(process.stdin, process.stdout);
const io = require ('socket.io-client');


const socket = io('http://localhost:3000');

rl.on('line', line => {
    line = line.trim();


});