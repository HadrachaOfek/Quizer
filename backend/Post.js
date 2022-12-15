import pkg from 'mongoose'

const { Schema } = pkg;

const Accounts_Schema = new Schema({
  firstname: String,
  lastname: String,
  gender: String,
  emailAddress: String,
  password: String,
  birthDate: Date,
  joinDate: { type: Date, default: Date.now() },
  isConnect: { type: Boolean, default: true },
  lastSeen: { type: Date, default: Date.now() },
  movements: [{ date: Date, name: String, value: Number, tags: String }],
});

const Accounts = pkg.model('Accounts', Accounts_Schema);
export default Accounts;