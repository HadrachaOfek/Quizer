// const express = require('express')
// const bodyParser = require('body-parser')
// const cors = require('cors')
// const app = express();
// const {default : Test} = require('./testSchema')
// const mongoose = require('mongoose');
// require('events').EventEmitter.prototype._maxListeners = 100;
// const DB_URL = "mongodb+srv://guidnace:<password>@cluster0.pch7bed.mongodb.net/?retryWrites=true&w=majority"

import express  from 'express'
import cors from 'cors';
import pkg from 'mongoose';
import Accounts from './Post.js';
import dbUrl, { PASSWORD, USERNAME } from './ENV.js';


const app = express();
app.use(cors())
app.use(express.json());
pkg.set('strictQuery', false);

const PORT = 2001;
app.listen(PORT, async ()=>{
    try{
        console.log(dbUrl(USERNAME,PASSWORD));
        await pkg.connect(dbUrl(USERNAME,PASSWORD));
        console.log(`Hello I\'m running on port http://localhost:${PORT}/`);
    }catch (error)
    {
        console.log(error);
    }
})

app.get('/',async (req,res)=>
{
    try {
        const temp = new Accounts({
            date : null,
            comments : "dfsfd",
            title : "hello",
            author : "oded vaalany",
            hidden : true,
        })
        await temp.save();
        console.log("hello");
    } catch (error) {
        console.log(error);   
    }
    res.send("<h1>hello</h1>");
})

app.get("/start-test/:pin/:id",(req,res)=>
{
    console.log(req.params);
    res.send("lol")
})

app.get("/exm?",(req,res) =>
{
    res.send("hello")
})

app.post("/create-test/",(req,res)=>
{
    res.json(req.bodym,);
})