const http = require('http').createServer().listen(3000);
const httpDB = require('http').createServer().listen(3001);
const io = require('socket.io')(http);
const Gun = require('gun');

const gunDB = Gun({web: server});

io.on('connection', (socket) => {
    console.log(`User ${socket.handshake.query['user-id']} connected`);

    socket.on('chatMessage', msg => {

    });

    socket.on('disconnect', () => {
        const s = socket;
        console.log('a user disconnected');
    });
});


http.listen(3000, () => {
    console.log('listening on *:3000');
});