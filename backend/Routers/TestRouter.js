import { Router } from 'express';
import { ADMIN } from '../ENV.js';
import Test from '../Patterns/Test.js';

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
		users: [String]
 * }
 * the call will return the test passcode and id in success
 */
TestRouter.post('/create/:id', async (req, res) => {
	if (req.params.id != 0 && req.body.title != null) {
		const passcode = await GeneratePasscode();
		const body = {
			admin: [req.params.id],
			password: passcode,
			title: req.body.title,
			insturctions: req.body.insturctions,
			logo: req.body.logo != null ? req.body.logo : '',
			duration: req.body.duration,
			active: false,
			numOfQuestions: req.body.numOfQuestions,
			questionsBank: [],
			users: req.body.users,
		};
		const record = new Test(body);
		await record.save();
		res.send(passcode);
	} else {
		res.send("Error one of the items don't match the formats");
	}
});

TestRouter.patch('/update_users/:id/:testid', async (req, res) => {
	if (await Test.exists({ _id: req.params.testid })) {
		const record = await Test.findOne({ _id: req.params.testid });
		const admins = ADMIN.concat(record.admin);
		if (admins.indexOf(req.params.id.toString()) != -1) {
			await Test.findOneAndUpdate(
				{ _id: req.params.testid },
				{ users: record.users.concat(req.body.users) }
			);
			res.sendStatus(200);
		} else {
			res.send("This user don't have premission");
		}
	} else {
		res.send('Faild');
	}
});

TestRouter.patch('/delete_users/:id/:testid', async (req, res) => {
	if (await Test.exists({ _id: req.params.testid })) {
		const record = await Test.findOne({ _id: req.params.testid });
		const admins = ADMIN.concat(record.admin);
		if (admins.indexOf(req.params.id.toString()) != -1) {
			const users = [].concat(record.users);
			const newUsers = users.filter(
				e => req.body.users.indexOf(e) == -1
			);
			await Test.findOneAndUpdate(
				{ _id: req.params.testid },
				{ users: newUsers }
			);
			res.sendStatus(200);
		} else {
			res.send("This user don't have premission");
		}
	} else {
		res.send('Faild');
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
});

TestRouter.get('/', (req, res) => {
	res.send('hello');
});
export default TestRouter;
