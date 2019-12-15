import express from 'express';
import routes from './routes';
import mongoose from 'mongoose';
import mongoConfig from './config/mongodb';
import cors from 'cors';



const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers ={};

// Conectando ao frontend via websockets
io.on('connection', socket => {
    console.log('Nova conexão',socket.id);

    /** //Ouvindo mesagem do frontend
        socket.on('hello', message => {
        console.log(message);
     });
    
    // Enviando mensagem ao backend
    setTimeout(() => {
        socket.emit('world', {
            message: 'Hi front !'
        })
    }, 5000); */
    const { user } = socket.handshake.query;

    console.log(user, socket.id);

    connectedUsers[user] = socket.id;
})

mongoose.connect(mongoConfig.uri, { useNewUrlParser: true, useUnifiedTopology: true } );

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);


server.listen(3000);

