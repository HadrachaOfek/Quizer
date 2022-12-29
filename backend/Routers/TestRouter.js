import { Router } from 'express';
import { ADMIN } from '../ENV.js';
import Test from '../Patterns/Test.js';
import Users from '../Patterns/Users.js';
import Question from '../Patterns/Question.js';

const TestRouter = Router();

const GeneratePasscode = async () => {
	var passcode = '';
	for (let i = 0; i < 8; i++) {
		passcode += String.fromCharCode(65 + Math.floor(Math.random() * 26));
	}
	const res = await Test.findOne({ Password: passcode });
	if (res == null) {
		return passcode;
	}
	GeneratePasscode();
};

/**
 * When we want to config a new test.
 * we need to call /test/create/<admin id> 
 * and pass a body with:
 * {
		title: String,
		insturctions: String,
		logo: String,
		duration: Int,
		numOfQuestions: Int,
		passingGrade : Int,
		users: [String]
 * }
 * the call will return the test passcode and id in success
 */
TestRouter.post('/create/:id/:password', async (req, res) => {
	try{
		const {id,password} = req.params;
		if(Users.exists({userId : id, password : password})){
			const test = new Test({
				admin: req.body.admin,
				title:  req.body.title,
				insturctions:  req.body.instructions,
				logo:  req.body.logo,
				duration:  req.body.duration,
				passingGrade :  req.body.passingGrade,
				numOfQuestions:  req.body.numOfQuestions,
				password : await GeneratePasscode(),
			})
			console.log("hello");
			await test.save()
			res.send(test._id);
		}
		else{
			res.send(false);
		}
	}catch(e){
		console.log(e);
		res.send(false);
	}
});


TestRouter.patch('/delete_admins/:id/:testid', async (req, res) => {
	if (await Test.exists({ _id: req.params.testid })) {
		const record = await Test.findOne({ _id: req.params.testid });
		if (
			ADMIN.concat(record.admin).indexOf(req.params.id.toString()) != -1
		) {
			const admins = record.admin;
			const newAdmins = admins.filter(
				e => req.body.admins.indexOf(e) == -1
			);
			await Test.findOneAndUpdate(
				{ _id: req.params.testid },
				{ admin: newAdmins.length > 0 ? newAdmins : admins }
			);
			res.sendStatus(200);
		} else {
			res.send("This user don't have premission");
		}
	} else {
		res.send('Faild');
	}
});

TestRouter.patch('/update_admins/:id/:testid', async (req, res) => {
	try {
		if (await Test.exists({ _id: req.params.testid })) {
			const record = await Test.findOne({ _id: req.params.testid });
			const admins = ADMIN.concat(record.admin);
			if (admins.indexOf(req.params.id.toString()) != -1) {
				await Test.findOneAndUpdate(
					{ _id: req.params.testid },
					{ admin: record.users.concat(req.body.admins) }
				);
				res.sendStatus(200);
			} else {
				res.send("This user don't have premission");
			}
		} else {
			res.send('Faild');
		}
	} catch (error) {
		res.send('Something goes wrong');
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

TestRouter.patch('/activate_test/:adminId/:adminPassword/:testId', async (req, res) => {
	try {
		const { testId, adminId, adminPassword } = req.params;
		if (await Users.exists({ userId: adminId, password: adminPassword })) {
			if (await Test.exists({ _id: testId, admin: adminId })) {
				if (
					(await Test.findById(testId)).numOfQuestions <=
					(await Question.find({ linkedTest: testId })).length
				) {
					await Test.findByIdAndUpdate(testId, { active: true });
					res.send([true,'Test is active']);
				} else res.json([false, 'Test not completed']);
			} else res.json([false, 'Test not found or you are not an admin']);
		}
		else res.json([false, 'wrong admin password or admin do not exists']);
	} catch (error) {
		res.json([false,"Error"]);
	}
});

TestRouter.patch('/is_test_active/:testId', async (req, res) => {
	try {
		const { testId } = req.params;
		if (await Test.exists({ _id: testId })) {
			res.send((await Test.findById(testId)).active);
		} else res.send('Test not found');
	} catch (error) {
		res.send('Someting went wrong');
	}
});


TestRouter.patch('/deactivate_test/:adminId/:adminPassword/:testId', async (req, res) => {
	try {
		const { testId, adminId, adminPassword } = req.params;
		if (await Users.exists({ userId: adminId, password: adminPassword })) {
			if (await Test.exists({ _id: testId, admin: adminId })) {
				if (
					(await Test.findById(testId)).numOfQuestions <=
					(await Question.find({ linkedTest: testId })).length
				) {
					await Test.findByIdAndUpdate(testId, { active: false });
					res.send([true,'Test is deactive']);
				} else res.json([false, 'Test not completed']);
			} else res.json([false, 'Test not found or you are not an admin']);
		}
		else res.json([false, 'wrong admin password or admin do not exists']);
	} catch (error) {
		res.json([false,"Error"]);
	}
});

TestRouter.delete("/delete_test/:adminId/:adminPassword/:testId",async (req, res) => {
	try {
		const { testId, adminId, adminPassword } = req.params;
		if (await Users.exists({ userId: adminId, password: adminPassword })) {
			if (await Test.exists({ _id: testId, admin: adminId })) {
				await Test.findByIdAndRemove(testId);
				res.send([true, 'delete test']);
			} else res.json([false, 'Test not found or you are not an admin']);
		}
		else res.json([false, 'wrong admin password or admin do not exists']);
	} catch (error) {
		res.json([false,"Error"]);
	}
});

TestRouter.get('/get_all/:id/:password', async (req, res) => {
	try{
		const {id,password} = req.params;
		if(await Users.exists({userId : id,password : password})){
			res.json(await Test.find({admin : id}));
		}
		else res.send(false);
	}
	catch(e)
	{
		res.send(false);
	}
});
export default TestRouter;
