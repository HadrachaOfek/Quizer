import { Router } from 'express';
import { ADMIN } from '../ENV.js';
import Test from '../Patterns/Test.js';
import Users from '../Patterns/Users.js';

/**
 * #######################################################
 *
 * 				Users collection doc
 *
 * #######################################################
 *
 * All the users of this platform have to be registed in the user
 *  collection, when admin user create a test it can create a new
 * user in the users collection
 *
 * we can get all the user's ids in the user collection
 * by callign : GET user/ids
 *
 * we can get all the user information
 * by calling : GET user/connect/<user id>/<user password>
 *
 * we can set admin premission to a user by another admin user
 * by calling : PATCH /set_admin/<user id>/<admin id>/<admin password>
 *
 * we can link test to a user
 * by calling : PATCH /add/<user id>/<test id>
 *
 * we can add a user to the collection
 * by calling : POST /create
 * body :
 * {
 * 	firstName : String,
 * 	lastName : String,
 * 	userId : String with (7 or 9 digits)
 * 	linkedList : [String]
 * 	password : [String]
 * }
 *
 */

const ID_PATTERN = RegExp('[0-9]{7,9}');
const UsersRouter = Router();

UsersRouter.get('/connect/:userId/:userPassword', async (req, res) => {
	const { userId, userPassword } = req.params;
	if (!isNaN(userId) && (userId.length == 7 || userId.length == 9)) {
		if (await Users.exists({ userId: userId, password: userPassword }))
			res.json(
				await Users.findOne({ userId: userId, password: userPassword })
			);
		else res.send("User don't found");
	} else {
		res.sendStatus(404);
	}
});

UsersRouter.get('/get_all/:userid/:password', async (req, res) => {
	try {
		if ((new RegExp("[0-9]{7,9}")).test(req.params.userid)) {
			if (Users.exists({ userId: req.params.userid, password: req.params.password, admin: true })) {
				res.send(await Users.find());
			}
			else res.send(false);
		}
		else res.send(false)
	} catch (error) {
		res.send(false);
	}
});

UsersRouter.get('/ids', async (req, res) => {
	try{
	const respon = await Users.find();
	var ids = [];
	respon.map(user => (ids = ids.concat(user.userId)));
	res.json(ids);
	}
	catch(error) {
		res.sendStatus(403);
	}
});

UsersRouter.patch('/set_admin/:adminId/:adminPassword/:userId',
	async (req, res) => {
		try {
			const { userId, adminId, adminPassword } = req.params;
			if (ID_PATTERN.test(userId) && ID_PATTERN.test(adminId)) {
				if (
					await Users.exists({
						userId: adminId,
						password: adminPassword,
						admin: true,
					})
				) {
					if (await Users.exists({ userId: userId })) {
						await Users.findOneAndUpdate(
							{ userId: userId },
							{ admin: true }
						);
						res.json([true, "user deleted"]);
					} else {
						res.json([false, "user not found"]);
					}
				}
				else res.json([false, "admin not found"]);
			} else res.json([false, "invalid ids"]);
		} catch (e) {
			res.sendStatus(404);
		}
	}
);

UsersRouter.delete('/delete/:adminId/:adminPassword/:userId', async (req, res) => {
	try {
		const { adminId, adminPassword, userId } = req.params;
		if (ID_PATTERN.test(userId) && ID_PATTERN.test(adminId)) {
			if (await Users.exists({ admin: true, userId: adminId, password: adminPassword }))
			{
				if (await Users.exists({ userId: userId })) {
					await Users.findOneAndDelete({ userId: userId });
					res.json([true,"user deleted"])
				}
				else res.json([false, "User not found"]);
			}
			else res.json([false,"Admin not found"])
		}
	} catch (error) {
		res.statusCode(404);
	}
});


UsersRouter.post('/create', async (req, res) => {
	const { firstName, lastName, userId, password } = req.body;
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
				firstName: firstName,
				lastName: lastName,
				password: password,
				userId: userId,
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

UsersRouter.get('/exist/:id', async (req, res) => {
	res.send((await Users.exists({ userId: req.params.id })) !== null);
});

UsersRouter.get('/exist/:id/:password', async (req, res) => {
	res.send(
		(await Users.exists({
			userId: req.params.id,
			password: req.params.password,
		})) !== null
	);
});

UsersRouter.patch('/reset_password/:adminId/:adminPassword/:userId/:userPassword', async (req, res) => {
	const { adminId, adminPassword, userId, userPassword } = req.params;
	try {
		if (await Users.exists({ userId: adminId, password: adminPassword, admin: true })) {
			if (await Users.exists({ userId: userId })) {
				await Users.findOneAndUpdate({ userId: userId }, { password: userPassword });
				res.send([true,"User password updated"])
			}
			else {
				res.json([false,"User not found"])
			}
		} else {
			res.json([false,"Admin not found"])
		}
	} catch (e) {
		res.sendStatus(404);
	}
	
})

UsersRouter.get('/test/:testid', async (req, res) => {});
export default UsersRouter;
