const http = require("http").createServer();
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        const s = socket;
        console.log('a user disconnected');
    })
});


http.listen(3000, () => {
    console.log('listening on *:3000');
});