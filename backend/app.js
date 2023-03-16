

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
import AuthenticationOracle from './authenticationOracle.js';
import authenticator from './authenticationOracle.js';

const app = express();
app.use(cors());


/**
 * This function run the server and open it for outter requests
 */
app.listen(2000, async () => {
    authenticator.setConnection("1111111111111111");
    authenticator.print()
		console.log(`Hello I\'m running on port http://localhost:${2000}/`);
});