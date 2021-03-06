const http = require('http').createServer();
const httpDB = require('http').createServer().listen(3001);
const io = require('socket.io')(http);
const Gun = require('gun');

const gunDB = Gun({web: httpDB, peers: ['http://192.168.0.16:3001/gun'] });

const users = gunDB.get('users');
users.once(res => {
    console.log(res);
});

io.on('connection', (socket) => {

    gunDB.get('users')
        .get(socket.handshake.query['user-id'])
        .get('id').put(socket.handshake.query['user-id'])
        .get('socket').put(socket.id);

    socket.on('chatMessage', msg => {
        console.log(`Received message: ${msg}`);
    });

    socket.on('disconnect', () => {
        const s = socket;
        console.log('a user disconnected');
    });
});


http.listen(3000, () => {
    console.log('listening on *:3000');
});