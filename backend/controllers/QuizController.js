

function isStringNotEmpty(str) {
    return str.trim() !== "";
}

async function createQuiz(image = null, title, Instructions, Owner, coOwners, minQuestion, grade = 80,key) {
    //check if the importent data is valid
    if (isStringNotEmpty(title) && isStringNotEmpty(Instructions) &&
        isStringNotEmpty(Owner) && minQuestion > 0 && grade < 101 && grade > -1)
    {
    }
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