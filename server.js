import Express from "express";
import Cors from "cors";
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import orders from "./routes/orders.js";
import products from "./routes/products.js";
import productTypes from "./routes/productTypes.js";
import defaults from './routes/default.js';
import temporary from './routes/temporary.js';
import payment from './routes/payment.js';
import config from "config";
import http from "http";
import {Server} from "socket.io";

const app=Express();
app.use(Cors());
const server=http.createServer(app);

const credentials = config.get("Customer.dbConfig");

app.use(Express.json());
app.use(Cors());
app.use("/auth", auth);
app.use("/users", users);
app.use("/orders", orders);
app.use("/products", products);
app.use("/productTypes", productTypes);
app.use("/default", defaults);
app.use("/temporary", temporary);
app.use("/payment", payment);


app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

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

server.listen(credentials.serverPort, () =>
  console.log(`The server is running on ${credentials.serverPort}...`)
);

