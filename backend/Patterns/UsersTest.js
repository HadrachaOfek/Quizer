import pkg from 'mongoose';

const { Schema } = pkg;

const UsersTestSchema = new Schema({
    linkedTest: { type: String, require: true },
    firstName: { type: String, require: true },
	lastName: { type: String , require : true},
	userId: { type: String, require: true },
    startTime: { type: Date, default: null },
    endTime : {type : Date , default : null},
    questions: { type: Array, default: [] },
    answers : {type : Array , default : []},
    grade: {type : Number,default : null},
});

const UsersTest = pkg.model('UsersTest', UsersTestSchema);
export default UsersTest;
