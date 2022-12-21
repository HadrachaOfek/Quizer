import { Router } from 'express';
import { ADMIN } from '../ENV.js';
import Test from '../Patterns/Test.js';
import Users from '../Patterns/Users.js';

const UsersRouter = Router();

UsersRouter.get('/id/:id', async (req, res) => {
	if (
		!isNaN(req.params.id) &&
		(req.params.id.length == 7 || req.params.id.length == 9)
	) {
		res.json(await Users.find({ userId: req.params.id }));
	} else {
		res.sendStatus(404);
	}
});

UsersRouter.get('/', async (req, res) => {
	res.json(await Users.find());
});

UsersRouter.get('/ids', async (req, res) => {
	const respon = await Users.find();
	var ids = [];
	respon.map(user => (ids = ids.concat(user.userId)));
	res.json(ids);
});

UsersRouter.patch('/add/:userid/:testid', async (req, res) => {
	try {
		if (await Users.exists({ userId: req.params.userid })) {
			if (
				(await Users.exists({
					userId: req.params.userid,
					linkedTest: req.params.testid,
				})) == null
			) {
				await Users.findOneAndUpdate(
					{ userId: req.params.userid },
					{
						$push: { linkedTest: req.params.testid },
					}
				);
			}
			res.sendStatus(200);
		} else {
			res.sendStatus(403);
		}
	} catch (error) {
		res.sendStatus(500);
	}
});

UsersRouter.post('/create', async (req, res) => {
	const { firstName, lastName, userId, linkedTest } = req.body;
	if (
		firstName != null &&
		firstName.trim().length > 0 &&
		lastName != null &&
		lastName.trim().length > 0 &&
		userId != null &&
		!isNaN(userId) &&
		(userId.length == 9 || userId.length == 7)
	) {
		if ((await Users.exists({ userId: userId })) == null) {
			const user = new Users({
				linkedTest: linkedTest == undefined ? [] : linkedTest,
				firstName: firstName,
				lastName: lastName,
				userId: userId,
				answers: [],
			});
			try {
				await user.save();
				res.send('signd');
			} catch (error) {
				res.sendStatus(500);
			}
		} else {
			res.send('There is account with the same user id');
		}
	} else {
		res.send('Invalid inputs');
	}
});

UsersRouter.get('/test/:testid', async (req, res) => {});
export default UsersRouter;
