import { Schema } from 'mongoose';
import pkg from 'mongoose';

const QuestionSchema = new Schema({
	linkedTest: { type: String, require: true },
	type: { type: Number, require: true },
  	img : {type : String,default : ""},
  	active : {type : Boolean,default : true},
	question: { type: String, require: true },
	totalGrade: { type: Number, require: true },
	answers: { type: Array, require: true },
});

/**
 * Type can be :
 *          0 - choice
 *          1 - mult choice
 *
 * Structure of the Answers array:
 *    {answer :String , grade : number }
 */

const Question = pkg.model('Question', QuestionSchema);
export default Question;
