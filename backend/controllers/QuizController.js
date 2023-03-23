import authenticator from "../authenticationOracle.js";
import QuizPrefrences from '../Schemes/QuizPrefrences.js';


function isStringNotEmpty(str) {
    return str.trim() !== "";
}

/**
 * @description The function crate new Quiz preference
 * @param {string} image 
 * @param {string} title 
 * @param {string} Instructions 
 * @param {string} Owner 
 * @param {string} coOwners 
 * @param {number} minQuestion 
 * @param {number} grade 
 * @param {string} key 
 * @returns true upon success else false
 */
async function createQuiz(image = null, title, Instructions, Owner, coOwners, minQuestion, grade = 80,key) {
    //check if the importent data is valid
    if (isStringNotEmpty(title) && isStringNotEmpty(Instructions) &&
        isStringNotEmpty(Owner) && minQuestion > 0 && grade < 101 && grade > -1)
    {
        if (authenticator.isExistKey(key)) {
            const quiz = new QuizPrefrences(
                {
                    title: title,
                    Instructions: Instructions,
                    Owner: authenticator.getId(key),
                    coOwners: coOwners,
                    minQuestion: minQuestion,
                    grade: grade,
                    image : image,
                }
            )
            await quiz.save()
            return quiz._id;
        }
    }
    return null;
}


/**
 * @description The function update existing Quiz preference
 * @param {string} _id of the quiz to update
 * @param {string} image 
 * @param {string} title 
 * @param {string} Instructions 
 * @param {string} Owner 
 * @param {string} coOwners 
 * @param {number} minQuestion 
 * @param {number} grade 
 * @param {string} key 
 * @returns true upon success else false
 */
async function updateQuiz(_id,image = null, title, Instructions, Owner, coOwners, minQuestion, grade = 80,key) {
    //check if the importent data is valid
    if (isStringNotEmpty(title) && isStringNotEmpty(Instructions) &&
        isStringNotEmpty(Owner) && minQuestion > 0 && grade < 101 && grade > -1)
    {
        if (authenticator.isExistKey(key)) {
            let owner_id = authenticator.getId(key);
            if (await QuizPrefrences.exists({ $or: [{ _id: _id, Owner: owner_id }, { _id: _id, coOwners: owner_id }] }))
            {
                await QuizPrefrences.findByIdAndUpdate({ _id }, {
                    title: title,
                    Instructions: Instructions,
                    Owner: authenticator.getId(key),
                    coOwners: coOwners,
                    minQuestion: minQuestion,
                    grade: grade,
                    image : image,
                })
                return _id;
            }
        }
    }
    return null;
}


// image: { type: String },
//     creationDate: { type: Date, default: Date.now(), },
//     lastEditDate: { type: Date, default: Date.now() },
//     title: { type: String, require: true },
//     Instructions: { type: String },
//     Owner: { type: String, require: true },
//     coOwners: { type: Array, default: [] },
//     minQuestion: { type: Number, require: true },
//     grade : {type : Number,default : 80},