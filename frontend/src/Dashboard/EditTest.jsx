
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ServerAddress from "../assets/ServerAddress";
import { Grid, Button } from '@mui/material';
import './Dashboard.css';
import Skeleton from '@mui/material/Skeleton';
import AddQuestion from "./AddQuestion";
import Question from "./Question";


function EditTest() {
	const { id, testid, password } = useParams();
	const [questions, setQuestions] = useState('loading');
	const [addQuestionScreen, setAddQuestionScreen] = useState(false);
	const [currQuestionToShow, setCurrQuestionToShow] = useState();

	useEffect(_ => {
		getData();
	}, [])


	const getData = async () => {
		const res = await axios.get(ServerAddress(`question/get_linkes_questions/${testid}`));
		if (res.status === 200) {
			setQuestions(res.data);
			console.log(res.data);
		} else {
			console.log(res.data);
		}
	}


	function questionStatus() {
		if (questions === 'loading') {
			return <React.Fragment>
				<Skeleton animation="wave" />
				<Skeleton animation="wave" />
				<Skeleton animation="wave" />
			</React.Fragment>
		} else if (questions) {
			return <React.Fragment>
				<h4 className="menu-header">השאלות שלי</h4>
				{questions.map((question, index) => {
					return <div className="question" onClick={() => { setCurrQuestionToShow(question); setAddQuestionScreen(false) }} key={index}>{question.question}</div>
				})}
				<Button className="button" onClick={() => setAddQuestionScreen(true)}>הוספת שאלה</Button>
			</React.Fragment>
		} else {
			return <React.Fragment >
				<div>!נראה שאין כאן שאלות... בואו נוסיף כאלה</div>
				<Button className="button" onClick={() => setAddQuestionScreen(true)}>הוספת שאלה</Button></React.Fragment>
		}

	}



	return (
		<React.Fragment>
			<Grid container spacing={1}>
				<Grid sm={3} item className="questions-menu">
					{questionStatus()}
				</Grid>

				<Grid sm={9} item>
					{
						addQuestionScreen ?
							<AddQuestion></AddQuestion>
							: currQuestionToShow ? <React.Fragment>
								<Question question={currQuestionToShow} id={id} testId={testid} password={password} ></Question>
							</React.Fragment> : ''
					}
				</Grid>
			</Grid>
		</React.Fragment>
	)
}




export default EditTest;
