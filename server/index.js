import express from 'express';
import http from 'http';
import { Server as ServerSocket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new ServerSocket(server);

//Conexion al front-end
io.on('connection', socket => {
    console.log(socket.id);

    //Trae el msj del front al back
    socket.on('message', (body) => {
        console.log(body);
        socket.broadcast.emit('message', { //Envia el msj del back al front
            body,
            from: socket.id.slice(4)
        });

    })
})

server.listen(3000);
console.log('Server on port', 3000);
