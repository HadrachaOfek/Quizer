import { model, Schema } from "mongoose";

const SCHEMA = new Schema({
    linkedTest: { type: String, require: true },
    firstName: { type: String, require: true },
	lastName: { type: String , require : true},
	userId: { type: String, require: true },
    startTime: { type: Date, default: null },
    endTime : {type : Date , default : null},
    questions: { type: Array, default: [] },
    grade: { type: Number, default: null },
    group : {type : String, require : true},
})

export default model('ExamineePrefrences', SCHEMA);