import Express from "Express";
import Cors from "Cors";
import config from "config";
import http from "http";
import {Server} from "socket.io";
const router = Express.Router();

const io=new Server(server,{
    cors:{
        origin:`http://localhost:${credentials.frontendServer}`,
        methods:["POST","GET"]
    },
})
io.on("connection",(socket)=>{
    console.log(`User connected: ${socket.id}`);
    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`User with Id: ${socket.id} joined room : ${data}`);
    })
    socket.on("send_message",(data)=>{
        socket.to(data.room).emit("receive_message",data)
    })
    socket.on("disconnect",()=>{
        console.log("User Disconnected ",socket.id);
    })
})
export default router;
