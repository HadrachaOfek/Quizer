import { Router } from 'express';
import { ADMIN } from '../ENV.js';
import Question from '../Patterns/Question.js';
import Test from '../Patterns/Test.js';

const QuestionRouter = Router();


/**
 * When we want to create a new question and link it to a existing test 
 * we'll call "/question/create/<admin id>/<test id>" and we need to provide a body
 * body:	type : 0 - one choice | 1 - multi choice
 * 			question : String
 * 			img : arraybuffer of the image as string
 * 			totalGrade : int
 * 			answers : [{answer : String,grade : int}] 
 * 			active : boolean
 * 
 */
QuestionRouter.post('/create/:id/:testid', async (req, res) => {
	console.log(req.body);
	if (await Test.exists({ _id: req.params.testid })) {
		const test = await Test.findOne({ _id: req.params.testid });
		if (ADMIN.concat(test.admin).indexOf(req.params.id.toString()) != -1) {
			const questionId = new Question({
				linkedTest: req.params.testid,
				type: req.body.type,
				question: req.body.question,
				img : req.body.img,
				active : req.body.active,
				totalGrade: req.body.totalGrade,
				answers: req.body.answers,
			});
			await questionId.save();
			await Test.findOneAndUpdate(
				{ _id: req.params.testid },
				{
					questionsBank: []
						.concat(test.questionsBank)
						.concat([questionId._id]),
				}
			);
			res.sendStatus(200);
		} else {
			res.send("This user don't have premission");
		}
	} else {
		res.send('Faild');
	}
});

/**
 * when we want to delete a question 
 * we'll call "question/delete/<admin id>/<test id>/<question id>"
 */
QuestionRouter.patch('/delete/:id/:testid/:questionid', async (req, res) => {
	if (await Test.exists({ _id: req.params.testid })) {
		const test = await Test.findOne({ _id: req.params.testid });
		if (ADMIN.concat(test.admin).indexOf(req.params.id.toString()) != -1) {
			if (test.questionsBank.indexOf(req.params.questionid) != -1) {
				await Question.deleteOne({ _id: req.params.questionid });
				const questionsBank = test.questionsBank.filter(
					id => id == req.params.testid
				);
				await Test.findOneAndUpdate(
					{ _id: req.params.testid },
					{ questionsBank: questionsBank }
				);
				res.sendStatus(200);
			} else {
				res.send('This question not found');
			}
		} else {
			res.send("This user don't have premission");
		}
	} else {
		res.send('Faild');
	}
});


/**
 * when we need to get question information
 * we'll call "question/get"
 * and we'll provide body with list of questions id's
 * body: 	questions : [_id,_id,...,_id]
 */
QuestionRouter.get('/get', async (req, res) => {
	console.log(req.body);
	const questions = [];
	for(let i = 0 ; i< req.body.questions.length ; i++){
		if (await Question.exists({ _id: req.params.questionid })) {
			questions.push(await Question.find({ _id: req.params.questionid }));
		}
	}
	if(questions.length == 0)
	{
		res.send("Faild");
	}
	else{
		res.json(questions);
	}
});

export default QuestionRouter;
