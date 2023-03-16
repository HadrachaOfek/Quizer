import { Schema } from 'mongoose';
import pkg from 'mongoose';

const UsersSchema = new Schema({
	firstName: { type: String, require: true },
	password: { type: String, default: 123456 },
	admin: { type: Boolean, default: false },
	lastName: { type: String, require: true },
	userId: { type: String, require: true },
	createdAt : {type : Date , default : Date.now()},
});

const Users = pkg.model('Users', UsersSchema);
export default Users;
