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
import Test from './Patterns/Test.js';
import Question from './Patterns/Question.js';
import dbUrl, { ADMIN, PASSWORD, USERNAME } from './ENV.js';

const GeneratePasscode = async() => {
    var passcode = "";
    for (let i = 0; i < 8; i++) {
        passcode += String.fromCharCode(65 + Math.floor(Math.random() * 26))
    }
    const res = (await Test.findOne({Password : passcode}));
    if(res == null){
        return passcode;
    }
    GeneratePasscode();
}


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
    try{
        console.log(await  GeneratePasscode() );
    } catch (error) {
        
    }
    res.send("hello");
})

app.post("/test/create/:id",async(req,res)=>
{
    if(req.params.id != 0 && req.body.Title != null){
        const passcode = await GeneratePasscode();
        const body = {
            Admin : [req.params.id],
            Password : passcode,
            Title : req.body.Title,
            Insturctions : req.body.Insturctions,
            Logo : req.body.Logo != null ? req.body.Logo : "",
            Duration : req.body.Duration,
            Active : false,
            NumOfQuestions : req.body.NumOfQuestions,
            QuestionsBank : req.body.Question,
            Users : req.body.Users
        }
        const record = new Test(body);
        await record.save();
        res.send(passcode)
    }
    else{
        res.send("Error one of the items don't match the formats");
    }
})

app.patch("/test/active/:id/:testid/:testpassword",async(req,res) =>
{
    const record = await Test.findOne({_id :  req.params.testid,Password : req.params.testpassword});
    if(req.params.id in ADMIN){
        const record = await Test.findById(req.params.testid);
    }
    res.send("hello")
})

app.post("/create-test/",(req,res)=>
{
    res.json(req.bodym,);
})
