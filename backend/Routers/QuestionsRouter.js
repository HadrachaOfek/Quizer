import { Router } from 'express';
import { ADMIN } from '../ENV.js';
import Question from '../Patterns/Question.js';
import Test from '../Patterns/Test.js';
import Users from '../Patterns/Users.js';

const QuestionRouter = Router(); 

/**
 * When we want to create a new question and link it to a existing test
 * we'll call "/question/create/<admin id>/<admin password>/<test id>" and we need to provide a body
 * body:	type : 0 - one choice | 1 - multi choice
 * 			question : String
 * 			img : arraybuffer of the image as string
 * 			totalGrade : int
 * 			answers : [{answer : String,grade : int}]
 * 			active : boolean
 *
 * return false upon error else return the question id
 */
QuestionRouter.post('/new_questions/:userId/:userPassword/:testid', async (req, res) => {
	try{
		const {userId,userPassword,testid} = req.params;
		if (await Users.exists({ userId: userId, password: userPassword })) {
			if (await Test.exists({ _id: testid, $or: [{coOwner : userId}, {owner : userId}] })) {
				var question = new Question({
					...req.body,
					linkedTest: testid,
				})
				await question.save();
				res.json([true,question._id]);
			}
			else res.json([false,"Test not exists or the user isn't associate"]);
		}
		else res.json([false,"User not exists"]);
	}
	catch (error) {
		res.json([false,"Server error"]);
		console.log(error)
	}
});

QuestionRouter.patch('/edit_questions/:userId/:userPassword/:testid/:questionid', async (req, res) => {
	try{
		const {userId,userPassword,testid,questionid} = req.params;
		if (await Users.exists({ userId: userId, password: userPassword })) {
			if (await Test.exists({ _id: testid, $or: [{ coOwner: userId }, { owner: userId }] })) {
				if (await Question.exists({ _id: questionid })) {
					await Question.findByIdAndUpdate(questionid, {
						...req.body,
						linkedTest: testid,
					})
					res.json([true, question._id]);
				} res.json([false, "Question not found"]);
			}
			else res.json([false,"Test not exists or the user isn't associate"]);
		}
		else res.json([false,"User not exists"]);
	}
	catch (error) {
		res.json([false,"Server error"]);
		console.log(error)
	}
});

/**
 * when we want to delete a question
 * we'll call "question/delete/<admin id>/password/<test id>/<question id>"
 */
QuestionRouter.patch('/delete/:id/:password/:testId/:questionid', async (req, res) => {
	try{
		const { id, password, testid, questionid,testId } = req.params;
		if (await Users.exists({ userId: id, password: password })) {
			if (Question.exists({ _id: questionid })) {
				if (Test.exists({ _id: testId, $or: [{ owner: id }, { coOwner: id }] })) {
					await Question.findByIdAndDelete(questionid);
					res.json([true, "question deleted"]);
				}
				else res.json([false, "User not associate with the test"]);
			}
			else res.json([false, "question no found"]);
		}
		else res.json([false,"user not exists"]);
	}
	catch (error) {
		res.send(false);
	}
});

/**
 * when we need to get question information
 * we'll call "question/get_linkes_questions/<test id>"
 * and we'll provide the test id
 */
QuestionRouter.get('/get_linkes_questions/:testid', async (req, res) => {
	try {
		if (await Test.exists({ _id: req.params.testid })) {
			res.json([true,await Question.find({ linkedTest: req.params.testid })]);
		} else {
			res.send([false,"Test not exists"]);
		}
	} catch (error) {
		res.send([false,"Server Error"]);
	}
});

export default QuestionRouter;
