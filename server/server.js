import express from 'express';
import cors from 'cors';
import "dotenv/config";
import http from 'http';

import { connectDB } from './lib/db.js'; // Adjust the path as necessary
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

//Create express app and http server

const app = express();
const server = http.createServer(app);

//insitialize socket.io
export const io = new Server(server, {
    cors:{
        origin: "*"
    }
});

//Store online users
export const userSocketMap = {};

//Socket.io connection
io.on("connection", (socket) =>{
    const {userId} = socket.handshake.query.userId;
    console.log(`User connected: ${userId}`);

    if(userId){
        userSocketMap[userId] = socket.id;
    }

    //emit online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect",() =>{
        console.log(`User disconnected: ${userId}`);
        delete userSocketMap[userId];
        //emit online users to all clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

//middleware

app.use(express.json({limit:"4mb"}));
app.use(cors());


//Routes setup
app.use("/api/status", (req,res)=> res.send("Server is running"));
app.use("/api/auth", userRouter)
app.use("api/messages",messageRouter)
//Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});