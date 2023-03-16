import { model, Schema } from "mongoose";


const SCHEMA = new Schema({
    image: { type: String },
    creationDate: { type: Date, default: Date.now(), },
    lastEditDate: { type: Date, default: Date.now() },
    title: { type: String, require: true },
    Instructions: { type: String },
    Owner: { type: String, require: true },
    coOwners: { type: Array, default: [] },
    minQuestion: { type: Number, require: true },
    grade : {type : Number,default : 80},
})

export default model('QuizPrefrences', SCHEMA);