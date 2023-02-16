import { Router } from 'express';
import { ADMIN } from '../ENV.js';
import Test from '../Patterns/Test.js';
import Users from '../Patterns/Users.js';
import Question from '../Patterns/Question.js';

const TestRouter = Router();

const activeTests = new Map();
const activeTestsIdToPassword = new Map();

const GeneratePasscode = () => {
	var passcode = '';
	for (let i = 0; i < 8; i++) {
		if (Math.random() > 0.5) {
			passcode += String.fromCharCode(65 + Math.floor(Math.random() * 26));
		}
		else {
			passcode += String.fromCharCode(48 + Math.floor(Math.random() * 10));
		}
	}
	if (activeTests.has(passcode)) {
		return GeneratePasscode();
	}
	return passcode;
};

/**
 * When we want to config a new test.
 * we need to call /test/new_test/<user id>/<user pssword>
 * and pass a body with:
 * {
		owner: automaticly set the creator,
		coOwner : {type : Array, require : true},
		title: { type: String, require: true },
		instructions: { type: String, require: true },
		logo: { type: String },
		duration: { type: Number },
		passingGrade : {type : Number , default : 60},
		numOfQuestions: { type: Number, require: true },
 * }
 * the call will return the test passcode and id in success
 */
TestRouter.post('/new_test/:userId/:userPassword', async (req, res) => {
	try{
		const { userId, userPassword } = req.params;
		const { coOwner, title, instructions, logo, duration, passingGrade, numOfQuestions } = req.body;
		if(Users.exists({userId : userId, password : userPassword})){
			const test = new Test({
				owner : userId,
				coOwner: coOwner,
				title:  title,
				instructions:  instructions,
				logo:  logo,
				duration:  duration,
				passingGrade :  passingGrade,
				numOfQuestions:  numOfQuestions,
			})
			await test.save()
			res.json([true,test._id]);
		}
		else{
			res.send([false,"User not found"]);
		}
	} catch (e) {
		console.log("######### ERROR IN NEW TEST #########")
		console.log(e);
		res.send([false,"server error"]);
	}
});


/**
 * When we want to edit an existing test.
 * we need to call /test/edit_test/<user id>/<user pssword>
 * and pass a body with:
 * {
		owner: automaticly set the creator,
		coOwner : {type : Array, require : true},
		title: { type: String, require: true },
		instructions: { type: String, require: true },
		logo: { type: String },
		duration: { type: Number },
		passingGrade : {type : Number , default : 60},
		numOfQuestions: { type: Number, require: true },
 * }
 * the call will return the test passcode and id in success
 */
TestRouter.patch('/edit_test/:userId/:userPassword/:testId', async (req, res) => {
	try {
		const { userId, userPassword, testId } = req.params;
		const { coOwner, title, instructions, logo, duration, passingGrade, numOfQuestions } = req.body;
		//Cheking if the user is exists
		if (await Users.exists({ userId: userId, password: userPassword })) {
			console.log(await Test.exists({ $or: [{ coOwner: userId , _id : testId}, { owner: userId , _id : testId }] }));
			//Checking if the user is an owner or co owner of the test
			if (await Test.exists({ $or: [{ coOwner: userId , _id : testId}, { owner: userId , _id : testId }] })) {
				await Test.findByIdAndUpdate(testId, {
					owner : userId,
					coOwner: coOwner,
					title:  title,
					instructions:  instructions,
					logo:  logo,
					duration:  duration,
					passingGrade :  passingGrade,
					numOfQuestions:  numOfQuestions,
				});
				res.json([true, "Test updated"]);
			} else res.json([false, "The test may not be exists or the user isn't associate"]);
		}
		else res.json([false, "This user not exists"]);
	} catch (error) {
		res.json([false, "Server Error"]);
	}
});

TestRouter.patch('/start_quiz/:testPasscode/:userId', async (req, res) => {
	const { userId, testPasscode } = req.params;
	if (await Test.exists({ password: testPasscode, active: true })) {
		const testObject = await Test.findOne({ password: testPasscode });
		if (
			await Users.exists({ userId: userId, linkedTest: testObject._id })
		) {
			if (
				await Users.exists({ userId: userId, answers: testObject._id })
			) {
				const user = await Users.findOne({
					userId: userId,
					answers: testObject._id,
				});

				res.json(
					user.answers.filter(e => e.testId == testObject._id)[0]
				);
			} else {
				const test = [];
				const questions = (
					await Question.find({
						linkedTest: testObject._id,
					})
				).sort((a, b) => Math.random() - 0.5);
				for (let i = 0; i < testObject.numOfQuestions; i++) {
					if (questions[i].active) {
						test.push({
							...questions[i],
							choose: [],
						});
					} else {
						i--;
					}
				}
				const answersConfigs = {
					testId: testObject._id,
					startTime: Date.now(),
					finalEndTime: new Date(
						Date.now() + testObject.duration * 60 * 1000
					),
					endTime: undefined,
					questions: test,
				};
				await Users.findOneAndUpdate(
					{ userId: userId },
					{ $push: { answers: answersConfigs } }
				);
				res.json(answersConfigs);
			}
		} else {
			res.send('User not allowd');
		}
	} else {
		res.send('The tese not found or not active');
	}
});

/**
 * allow us to activate the test iff the test is completed
 */
TestRouter.patch('/activate_test/:ownerId/:ownerPassword/:testId', async (req, res) => {
	try {
		const { testId, ownerId, ownerPassword } = req.params;
		if (activeTestsIdToPassword.has(testId)) {
			res.json([true, "test already activated"]);
		}
		//checks if the owner is a real user
		if (await Users.exists({ userId: ownerId, password: ownerPassword })) {
			//checks if the test is real
			if (await Test.exists({ _id: testId, $or: [{ owner: ownerId }, {coOwner : ownerId}] })) {
				//checks if there is enough questions to open the test
				if (
					(await Test.findById(testId)).numOfQuestions <=
					(await Question.find({ linkedTest: testId })).length
				) {
					const password = GeneratePasscode();
					activeTests.set(password, await Test.findById(testId));
					activeTestsIdToPassword.set(testId, password);
					res.send([true,'Test is active']);
				} else res.json([false, 'Test not completed']);
			} else res.json([false, 'Test not found or you are not an owner']);
		}
		else res.json([false, 'wrong user password or user not exists']);
	} catch (error) {
		res.json([false,"Server Error"]);
	}
});

TestRouter.get("/get_instructions/:testId", async (req, res) => {
	try {
		const { testId } = req.params;
		if (activeTestsIdToPassword.has(testId)) {
			if (activeTests.has(activeTestsIdToPassword.get(testId))) {
				res.json([true, activeTests.get(activeTestsIdToPassword.get(testId)).instructions]);
			}
			else	res.json([false,"error"]);
		}
		else {
			res.json([false,"test not exist"])
		}
	} catch (error) {
		res.json([false, "server error"]);
	}
})

TestRouter.patch('/is_test_active/:testId', async (req, res) => {
	try {
		const { testId } = req.params;
		if (activeTestsIdToPassword.has(testId)) {
			res.json([true, true]);
		}
		else {
			res.json([true,false])
		}
	} catch (error) {
		res.json([false,"Server Error"]);
	}
});


TestRouter.patch('/deactivate_test/:ownerId/:ownerPassword/:testId', async (req, res) => {
	try {
		const { testId, ownerId, ownerPassword } = req.params;
		if (!activeTestsIdToPassword.has(testId)) {
			res.json([true, "test not active"]);
		}
		//checks if the owner is a real user
		if (await Users.exists({ userId: ownerId, password: ownerPassword })) {
			//checks if the test is real
			if (await Test.exists({ _id: testId, $or: [{ owner: ownerId }, {coOwner : ownerId}] })) {
					const password = activeTestsIdToPassword.get(testId);
					if (activeTests.has(password)) {
						activeTests.delete(password);
					}
					activeTestsIdToPassword.delete(password);
					res.send([true,'Test is deactivate']);
			} else res.json([false, 'Test not found or you are not an owner']);
		}
		else res.json([false, 'wrong user password or user not exists']);
	} catch (error) {
		res.json([false,"Server Error"]);
	}
});

TestRouter.delete("/delete_test/:ownerId/:ownerPassword/:testId",async (req, res) => {
	try {
		const { testId, ownerId, ownerPassword } = req.params;
		if (await Users.exists({ userId: ownerId, password: ownerPassword })) {
			if (await Test.exists({ _id: testId, owner: ownerId })) {
				if (activeTestsIdToPassword.has(testId)) {
					if (activeTests.has(activeTestsIdToPassword.get(testId))) {
						activeTests.delete(activeTestsIdToPassword.get(testId));
					}
					activeTestsIdToPassword.delete(testId);
				}
				await Question.deleteMany({ linkedTest: testId });
				await Test.findByIdAndRemove(testId);
				res.send([true, 'delete test']);
			} else res.json([false, 'Test not found or you are not the owner']);
		}
		else res.json([false, 'wrong admin password or admin do not exists']);
	} catch (error) {
		res.json([false,"Error"]);
	}
});

TestRouter.get('/get_all/:ownerId/:ownerPassword', async (req, res) => {
	try{
		const { ownerId, ownerPassword } = req.params;
		//checks if the user exists 
		if (await Users.exists({ userId: ownerId, password: ownerPassword })) {
			const tests = await Test.find({ $or: [{ coOwner: ownerId }, { owner: ownerId }] });
			const toReturn = [];
			tests.forEach(test => {
				toReturn.push({_id : test._id,title : test.title,active : activeTestsIdToPassword.has(test._id)})
			})
			res.json([true,toReturn]);
		}
		else res.json([false,"User not exists"]);
	}
	catch(e)
	{
		res.json([false,"Server Error"]);
	}
});

TestRouter.get('/get_test_info/:ownerId/:ownerPassword/:testId', async (req, res) => {
	try{
		const { ownerId, ownerPassword,testId } = req.params;
		if (await Users.exists({ userId: ownerId, password: ownerPassword })) {
			const tests = await Test.findOne({_id : testId, $or: [{ coOwner: ownerId }, { owner: ownerId }] });
			res.json([true,tests]);
		}
		else res.json([false,"User not exists"]);
	}
	catch(e)
	{
		res.json([false,"Server Error"]);
	}
});


export default TestRouter;
