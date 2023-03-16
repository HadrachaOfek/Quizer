import authenticator from "../authenticationOracle.js";
import UserPrefrences from "../Schemes/UserPrefrences.js";
import { isUserIdValid,isStringNotEmpty } from "./utils.js";


export async function createUser(firstName, lastName, password, userId) {
    if (isStringNotEmpty(firstName) && isStringNotEmpty(lastName)
        && isUserIdValid(userId) && isStringNotEmpty(password))
    //checkes for the inputs validation
    {
        if (!(await UserPrefrences.exists({ userId: userId }))) {
            const record = new UserPrefrences({
                firstName:firstName,
	            lastName: lastName,
	            password: password,
	            userId: userId,
            })
            await record.save();
            return authenticator.setConnection(record._id);
        }
    }
}


// firstName: { type: String, require: true },
// 	lastName: { type: String, require: true },
// 	password: { type: String, default: 123456 },
// 	level: { type: String,enum : level, default: false },
// 	userId: { type: String, require: true },
// 	createdAt : {type : Date , default : Date.now()},