// const express = require('express')
// const bodyParser = require('body-parser')
// const cors = require('cors')
// const app = express();
// const {default : Test} = require('./testSchema')
// const mongoose = require('mongoose');
// require('events').EventEmitter.prototype._maxListeners = 100;
// const DB_URL = "mongodb+srv://guidnace:<password>@cluster0.pch7bed.mongodb.net/?retryWrites=true&w=majority"

import express from 'express';
import cors from 'cors';
import pkg from 'mongoose';
import dbUrl, { ADMIN, PASSWORD, USERNAME } from './ENV.js';
import TestRouter from './Routers/TestRouter.js';
import QuestionRouter from './Routers/QuestionsRouter.js';
import UsersRouter from './Routers/UsersRouter.js';

const app = express();
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
pkg.set('strictQuery', false);

const PORT = 2001;
app.listen(PORT, async () => {
	try {
		console.log(dbUrl(USERNAME, PASSWORD));
		await pkg.connect(dbUrl(USERNAME, PASSWORD));
		console.log(`Hello I\'m running on port http://localhost:${PORT}/`);
	} catch (error) {
		console.log(error);
	}
});

app.get('/', async (req, res) => {
	try {
		console.log(await GeneratePasscode());
	} catch (error) { }
	res.send('hello');
});

app.use('/test', TestRouter);
app.use('/question', QuestionRouter);
app.use('/user', UsersRouter);
