import pkg from 'mongoose'

const { Schema } = pkg;

const TestSchema = new Schema({
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

const Test = pkg.model('Test', TestSchema);
export default Test;