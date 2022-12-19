import { Schema} from "mongoose";
import pkg from 'mongoose'

const QuestionSchema = new Schema({
    Admin : {type : Array , require : true},
    Password : {type : String },
    Title : {type : String , require : true},
    Insturctions : {type : String , require : true},
    Logo : {type : String},
    Duration : {type : Number},
    Active : {type : Boolean , default : false},
    NumOfQuestions : {type : Number , require : true},
    QuestionsBank : {type : Array , default : []},
    Users : {type : Array , default : []}
  });
  
  const Question = pkg.model('Question', QuestionSchema);
  export default Question;