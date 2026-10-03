import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const app = express()
const PORT  = 8000;

app.get('/', (req, res)=>{
    res.send('Server is up and running ')
});

app.listen(PORT,(req,res)=>{
    console.log(`Server is listening on ${PORT}`)
})