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
QuestionRouter.post('/create/:id/:password/:testid', async (req, res) => {
	try{
		const {id,password,testid} = req.params;
		if (await Users.exists({ userId: id, password: password })) {
			if (await Test.exists({ _id: testid, admin: id })) {
				var question = new Question({
					...req.body,
					linkedTest: testid,
				})
				await question.save();
				res.send(question._id);
			}
			else res.send(false);
		}
		else res.send(false);
	}
	catch (error) {
		res.send(fasle);
	}
});

/**
 * when we want to delete a question
 * we'll call "question/delete/<admin id>/password/<test id>/<question id>"
 */
QuestionRouter.patch('/delete/:id/:password/:testid/:questionid', async (req, res) => {
	try{
		const { id, password, testid, questionid } = req.params;
		if (await Users.exists({ userId: id, password: password })) {
			if (await Test.exists({ _id: testid, admin: id })) {
				await Question.findByIdAndDelete(questionid);
				res.send(true);
			}
			else res.send(false);
		}
		else res.send(false);
	}
	catch (error) {
		res.send(fasle);
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
			res.json(await Question.find({ linkedTest: req.params.testid }));
		} else {
			res.send(false);
		}
	} catch (error) {
		res.send(false);
	}
});

export default QuestionRouter;
