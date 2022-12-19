import { Router } from 'express';
import { ADMIN } from '../ENV.js';
import Question from '../Patterns/Question.js';
import Test from '../Patterns/Test.js';

const QuestionRouter = Router();

QuestionRouter.post('/create/:id/:testid', async (req, res) => {
	console.log(req.body);
	if (await Test.exists({ _id: req.params.testid })) {
		const test = await Test.findOne({ _id: req.params.testid });
		if (ADMIN.concat(test.admin).indexOf(req.params.id.toString()) != -1) {
			const questionId = new Question({
				linkedTest: req.params.testid,
				type: req.body.type,
				question: req.body.question,
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

QuestionRouter.get('/:questionid', async (req, res) => {
	console.log(req.body);
	if (await Question.exists({ _id: req.params.questionid })) {
		res.json(await Question.find({ _id: req.params.questionid }));
	} else {
		res.send('Faild');
	}
});

export default QuestionRouter;
