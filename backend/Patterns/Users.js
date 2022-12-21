import { Schema } from 'mongoose';
import pkg from 'mongoose';

const UsersSchema = new Schema({
	linkedTest: { type: Array, default: [] },
	firstName: { type: String, require: true },
	lastName: { type: String, require: true },
	userId: { type: String, require: true },
	answers: { type: Array, default: [] },
});

const Users = pkg.model('Users', UsersSchema);
export default Users;
