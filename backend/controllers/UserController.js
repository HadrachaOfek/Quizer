import authenticator from "../authenticationOracle.js";
import UserPrefrences, { levelEnum} from "../Schemes/UserPrefrences.js";
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
            return authenticator.setConnection(record._id, {
                firstName:firstName,
	            lastName: lastName,
	            userId: userId,
            });
        }
    }
}

/**
 * @description This function connect user to the server, pull his data and generate a unique key 
 *              for the user within the authenticator
 * @param {string} password the user password
 * @param {import("mongoose").ObjectId} userId the user id
 * @returns return the unique key of the user or  null if the user not exist
 */
export async function connectUser(password, userId) {
    if (isUserIdValid(userId) && isStringNotEmpty(password))
    //checkes for the inputs validation
    {
        let _id;
        if ({ _id } = await UserPrefrences.exists({ userId: userId, password: password })) {
            let key = authenticator.isExistUser(_id)
            if (!key) {
                const user = await UserPrefrences.findById(_id, { password : false });
                return authenticator.setConnection(_id, user);
                
            }
            else return key;
        }
    }
}

/**
 * @description this function allow to compuse a generic massage about users and embed the data
 *                  into the string
 * @param {string} format format massage. {varname}
 *                      ex : "hello {firstname} {lastname} this is a massage for you, the time is {time}"
 * @returns a massage with the requested format
 */
export function getConnectionMessage(key, format) {
    if (authenticator.isExistKey(key)) {
        const { firstName, lastName } = authenticator.getData(key);
        format = format.replace('{firstname}', firstName);
        format = format.replace('{lastname}', lastName);
        format = format.replace('{time}', new Date().toLocaleTimeString());
        return format;
    }
    return null
}

/**
 * @description The function return all the users in the database
 * @param {string } key of the requesting user
 * @returns return null if the user not connected or not an admin, ekse return list of users
 */
export async function getAllUsers(key) {
    if (authenticator.isExistKey(key)) {
        if (authenticator.getData(key).level === levelEnum.Admin) {
            return await UserPrefrences.find({}, {password : false})
        }
        return null;
    }
    return null
}

/**
 * @description The function set another user to admin only if the requesting user is an admin
 * @param {string} key of the requesting admin
 * @param {string} _id of the premoted user
 * @returns return true on success else return false
 */
export async function setAdmin(key, _id) {
    if (authenticator.isExistKey(key)) {
        if (authenticator.getData(key).level === levelEnum.Admin) {
            if (await UserPrefrences.exists({ _id: _id })) {
                await UserPrefrences.findByIdAndUpdate(_id, { level: levelEnum.Admin });
                return true;
            }
        }
    }
    return false
}

/**
 * @description The function delete user if the requesting user is an admin
 * @param {string} key of the requesting admin
 * @param {string} _id of the user to delete
 * @returns true if succeed else false
 */
export async function removeUser(key, _id) {
    if (authenticator.isExistKey(key)) {
        if (authenticator.getData(key).level === levelEnum.Admin) {
            if (await UserPrefrences.exists({ _id: _id })) {
                await UserPrefrences.findByIdAndDelete(_id);
                return true;
            }
        }
    }
    return false
}