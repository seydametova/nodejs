'use strict';

// node hw6.js

// Подключение библиотеки
const socket = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const console = require('console');


const server = http.createServer((req, res) => {
    const indexPath = path.join(__dirname, 'hw6.html');
    const readStream = fs.createReadStream(indexPath);

    readStream.pipe(res);
});

const io = socket(server);

io.on('connection', client => {
    // console.log('connected');

    client.on('client-msg', (data) => {
        // console.log(data);
        
        const payload = {
            message: data.inverse ? data.message.split('').reverse().join('') :  data.message,
            nick: data.nick
        };

        client.broadcast.emit('server-msg', payload);
        client.emit('server-msg', payload);
    });
});

server.listen(5555);