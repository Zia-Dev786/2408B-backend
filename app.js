// let exp=require('express')
// let app =exp()
// let mainRoute=require("./src/routes/mainRoute")
// let mongoose=require('mongoose')
// const port=3000

// mongoose.connect('mongodb://localhost:27017/CRUD_APP')
// .then(()=>console.log('mongodb is connected'))
// .catch((e)=>console.log('mongodb not connect :error', e))

// app.use(exp.json())

// app.use('/api',mainRoute)

// app.listen(port,()=>{
//     console.log('server is runing',port)
// })




const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors")
const path=require('path')
require("dotenv").config();

const userRoutes = require("./src/routes/userRoute");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const adminRoutes = require("./src/routes/adminRoute");
const cartRoutes=require('./src/routes/cartRoutes')
const chatbotRoutes=require('./src/routes/chatbot')

const app = express();

app.use(express.json());
// free  cloudinary
// path  server paid storage 
app.use('/tmp/upload', express.static(path.join(__dirname, '/tmp/upload')));
app.use(cors({
   origin: [
    "http://localhost:5000",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],}
))

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

