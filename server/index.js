require('dotenv').config();

const fs = require('fs');
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
// const rest = require('feathers-rest');
const NeDB = require('nedb');
const service = require('feathers-nedb');
const cors = require('cors');
const _ = require('lodash');

const { PORT } = process.env;

const app = express(feathers());



const roomsDb = new NeDB({
    filename: './data/rooms',
    autoload: true
});

const usersDb = new NeDB({
    filename: './data/users',
    autoload: true
});

const messagesDb = new NeDB({
    filename: './data/messages',
    autoload: true
});

// app.configure(rest());
// Turn on JSON parser for REST services
app.use(express.json());
app.use(cors());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({extended: true}));
// Enable REST services
app.configure(express.rest());
app.configure(socketio((io) => {
    io.on('connection', async socket => {
        // app.channel('everybody').join(connection);
        console.log('a user connected');
    
        // connection.on()
    
        socket.on('room', (room) => {
            console.log("joined room", room);
            socket.join(room);
        });
    
        socket.on('message', async (data) => {
            console.log('Incoming message:', data);

            const messageObj = data;
            // messageObj.date = (new Date()).getTime();

            const message = await app.service('messages').create(messageObj);

            console.log("socket on message message", message);

            io.sockets.in(message.roomId).emit('message', message);
        });
    
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}));

app.use('/rooms', service({
    Model: roomsDb,
}));
app.use('/users', service({
    Model: usersDb,
}));
app.use('/messages', service({
    Model: messagesDb,
}));

app.use('/finduser/:username', async (req, res) => {
    const username = req.params.username;

    // console.log("#1 username", username);

    const users = await app.service('users').find({
        query: {
            username
        }
    });

    // console.log("#2 users", users);

    if (users.length === 0) {
        const user = await app.service('users').create({
            username
        });

        res.json(user);
        return;
    }
    res.json(users[0]);
});

app.use(express.errorHandler());

app.listen(PORT, () => {
    console.log(`Feathers server listening on port ${PORT}`);
});
