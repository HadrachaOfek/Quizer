import pkg from 'mongoose';

const { Schema } = pkg;

const TestSchema = new Schema({
	owner: { type: String, require: true },
	coOwner : {type : Array, require : true},
	title: { type: String, require: true },
	instructions: { type: String, require: true },
	logo: { type: String },
	duration: { type: Number },
	createAt : {type : Date,default : Date.now()},
	passingGrade : {type : Number , default : 60},
	numOfQuestions: { type: Number, require: true },
});

const Test = pkg.model('Test', TestSchema);
export default Test;
