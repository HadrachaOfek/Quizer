import pkg from 'mongoose';

const { Schema } = pkg;

const TestSchema = new Schema({
	admin: { type: Array, require: true },
	password: { type: String },
	title: { type: String, require: true },
	insturctions: { type: String, require: true },
	logo: { type: String },
	duration: { type: Number },
	active: { type: Boolean, default: false },
	passingGrade : {type : Number , default : 60},
	numOfQuestions: { type: Number, require: true },
	questionsBank: { type: Array, default: [] },
	users: { type: Array, default: [] },
});

const Test = pkg.model('Test', TestSchema);
export default Test;
