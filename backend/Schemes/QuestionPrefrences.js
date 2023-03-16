import { model, Schema } from "mongoose";

export const questionTypeEnum = { MultipleChoice: "multiple choice", SingleChoice: "single choice", OpenText: "open text" };
const questionType = ["multiple choice",  "single choice", "open text" ];
const SCHEMA = new Schema({
    linkedTest: { type: String, require: true },
	type: { type: String,enum :questionType , require: true },
  	img : {type : String,default : ""},
  	active : {type : Boolean,default : true},
    question: { type: String, require: true },
    note : {type : String,default : ""},
	totalGrade: { type: Number, require: true },
	answers: { type: Array, require: true },
    correctAnswers: { type: Array, require: true },
    createAt : {type : Date,default : Date.now()},
})

export default model('QuestionPrefrences', SCHEMA);