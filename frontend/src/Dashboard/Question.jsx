import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import ServerAddress from "../assets/ServerAddress";
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Question(props) {
    const { id, testid, password } = useParams();

    const question = props.question;
    console.log(props);
    // const QuestionSchema = new Schema({
    //     linkedTest: { type: String, require: true },
    //     type: { type: Number, require: true },
    //       img : {type : String,default : ""},
    //       active : {type : Boolean,default : true},
    //     question: { type: String, require: true },
    //     totalGrade: { type: Number, require: true },
    //     answers: { type: Array, require: true },
    // });


    const deleteQuestion = async () => {
        const res = await axios.patch((ServerAddress(`question/delete/${id}/${password}/${testid}/${question._id}`)));
        if (res.data) {
            alert('השאלה נמחקה בהצלחה !');
            setTimeout(_ => window.location.replace(`/dashboard/edit_questions/${id}/${password}/${testid}`));
        }
    }


    return (<React.Fragment>
        <Card sx={{ maxWidth: 400 }}>
            <Card sx={{ maxWidth: 400 }}>
                {question.img ? <CardMedia
                    sx={{ height: 140 }}
                    image={question.img}
                /> : ''}

                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {question.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        סוג- {question.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        מבחן משויך- {question.linkedTest}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        סטטוס {question.active}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ציון כולל לשאלה {question.totalGrade}
                    </Typography>
                    {/* {question.answers.map((answer, i) => {
                        return <div>{answer.answer} | {answer.grade}</div>
                    })} */}
                </CardContent>
                <CardActions>
                    <Button size="Medium" onClick={() => deleteQuestion()}>מחיקת שאלה</Button>
                </CardActions>
            </Card>
        </Card>
    </React.Fragment>);
}