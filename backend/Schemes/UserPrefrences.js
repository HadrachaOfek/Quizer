import { model, Schema } from "mongoose";

export const levelEnum = { Admin: "admin", User: 'user' };
const level = ["admin", "user"];
const SCHEMA = new Schema({
    firstName: { type: String, require: true },
	lastName: { type: String, require: true },
	password: { type: String, default: 123456 },
	level: { type: String,enum : level, default: false },
	userId: { type: String, require: true },
	createdAt : {type : Date , default : Date.now()},
})

export default model('UserPrefrences', SCHEMA);