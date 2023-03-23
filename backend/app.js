

// import pkg from 'mongoose';
// import dbUrl, { ADMIN, PASSWORD, USERNAME } from './ENV.js';
// import TestRouter from './Routers/TestRouter.js';
// import QuestionRouter from './Routers/QuestionsRouter.js';
// import UsersRouter from './Routers/UsersRouter.js';
// import UsersTestRouter from './Routers/UsersTestRouter.js';
// import { LocalStorage } from 'node-localstorage';
// import UsersTest from './Patterns/UsersTest.js';

import express from 'express';
import cors from 'cors';
import authenticator from './authenticationOracle.js';
import pkg, { connect } from 'mongoose';
import { connectUser, createUser, getAllUsers, getConnectionMessage, removeUser } from './controllers/UserController.js';

const app = express();
app.use(cors());
pkg.set('strictQuery', false);
/**
 * This function run the server and open it for outter requests
 */
app.listen(2000, async () => {
  const pass = "xvwt1BNm42DRFZG0";
  const us = "webSite"
  
  await pkg.connect(`mongodb+srv://${us}:${pass}@cluster0.pch7bed.mongodb.net/QuizAir?retryWrites=true&w=majority`);
  console.log(`Hello I\'m running on port http://localhost:${2000}/`);
  const key = await connectUser("password", 208230474);
  await connectUser("password", "208230474");
  authenticator.print();

});