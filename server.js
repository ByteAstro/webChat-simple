const express = require("express");
const dotenv = require("dotenv");
const { createServer } = require('http');
const http = require('http');
const { Server } = require('socket.io');
const path = require("path");

dotenv.config();
const PORT = process.env.PORT || 4500;

const app = express();
app.use(express.static(path.join(__dirname, 'client')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
const expressServer = app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});

const io = new Server(expressServer);

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        // console.log(`New user joined : ${name}`);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    socket.on('send', message => {
        socket.broadcast.emit('receive',
            { message: message, name: users[socket.id] }
        )
    })
    socket.on('disconnect', () => {
        // console.log(`${users[socket.id]} : left the chat`);
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})

