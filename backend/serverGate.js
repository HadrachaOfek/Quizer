// const express = require('express')
// const bodyParser = require('body-parser')
// const cors = require('cors')
// const app = express();
// const {default : Test} = require('./testSchema')
// const mongoose = require('mongoose');
// require('events').EventEmitter.prototype._maxListeners = 100;
// const DB_URL = "mongodb+srv://guidnace:<password>@cluster0.pch7bed.mongodb.net/?retryWrites=true&w=majority"

import express, { json } from 'express';
import cors from 'cors';
import pkg from 'mongoose';
import dbUrl, { ADMIN, PASSWORD, USERNAME } from './ENV.js';
import TestRouter from './Routers/TestRouter.js';
import QuestionRouter from './Routers/QuestionsRouter.js';
import UsersRouter from './Routers/UsersRouter.js';
import UsersTestRouter from './Routers/UsersTestRouter.js';
import { LocalStorage } from 'node-localstorage';
const app = express();
app.use(cors());

const activeTestsCache = new LocalStorage('./activeTestCache');
const examineeCache = new LocalStorage('./examineeCache');
export const activeTests = new Map();
export const activeTestsIdToPassword = new Map();
const examineeList = new Set();

const GeneratePasscode = () => {
	var passcode = '';
	for (let i = 0; i < 8; i++) {
		if (Math.random() > 0.5) {
			passcode += String.fromCharCode(
				65 + Math.floor(Math.random() * 26)
			);
		} else {
			passcode += String.fromCharCode(
				48 + Math.floor(Math.random() * 10)
			);
		}
	}
	if (activeTests.has(passcode)) {
		return GeneratePasscode();
	}
	return passcode;
};

export const writeExaminee = (id, firstName, lastName) => {
	!examineeCache.getItem(id) &&
		examineeCache.setItem(id, `${firstName}|${lastName}`);
	examineeList.add({
		id: id,
		firstName: firstName,
		lastName: lastName,
	});
};

const loadExamineeFromCache = (id, firstName, lastName) => {
	for (let i = 0; i < examineeCache.length; i++) {
		let key = examineeCache.key(i);
		examineeList.add({
			id: key,
			firstName: examineeCache.getItem(key).split('|')[0],
			lastName: examineeCache.getItem(key).split('|')[0],
		});
	}
};

export const getExamineesList = () => [...examineeList];

export const activateTest = async testInfo => {
	activeTestsCache.setItem(testInfo._id, JSON.stringify(testInfo));
	const password = GeneratePasscode();
	activeTests.set(password, testInfo);
	activeTestsIdToPassword.set(testInfo._id.toString(), password);
	console.log('#################### active tests ####################');
	activeTestsIdToPassword.forEach((password, id) => {
		console.log(id, password, activeTests.get(password).title);
	});
	return password;
};

export const deactivateTest = testId => {
	const password = activeTestsIdToPassword.get(testId);
	if (activeTests.has(password)) {
		activeTests.delete(password);
	}
	activeTestsIdToPassword.delete(testId);
	activeTestsCache.removeItem(testId);
};

export const isTestActive = key => {
	return activeTestsIdToPassword.has(key.toString());
};

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
pkg.set('strictQuery', false);

const PORT = 2001;
app.listen(PORT, async () => {
	try {
		for (let i = 0; i < activeTestsCache.length; i++) {
			var password = GeneratePasscode();
			var testInfo = JSON.parse(
				activeTestsCache.getItem(activeTestsCache.key(i))
			);
			activeTests.set(password, testInfo);
			activeTestsIdToPassword.set(testInfo._id.toString(), password);
		}
		loadExamineeFromCache();
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
	} catch (error) {}
	res.send('hello');
});

app.use('/test', TestRouter);
app.use('/question', QuestionRouter);
app.use('/user', UsersRouter);
app.use('/users_test', UsersTestRouter);
