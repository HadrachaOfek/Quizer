
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ServerAddress from "../assets/ServerAddress";
import { Paper, Box, Typography, Grid, TextField, Switch, Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';


// const QuestionSchema = new Schema({
// 	linkedTest: { type: String, require: true },
// 	type: { type: Number, require: true },
//   	img : {type : String,default : ""},
//   	active : {type : Boolean,default : true},
// 	question: { type: String, require: true },
// 	totalGrade: { type: Number, require: true },
// 	answers: { type: Array, require: true },
// });
function EditTest() {
	const { id, testid, password } = useParams();
	const [questions, setQuestions] = useState();
	const [testHasQuestions, setTestHasQuestions] = useState(false);


	useEffect(_ => {
		getData();
	}, [])


	const getData = async () => {
		const res = await axios.get(ServerAddress(`get_linkes_questions/${testid}`));
		if (res.status === 200) {
			setQuestions(res.data);
			setTestHasQuestions(true);
		} else {
			setTestHasQuestions(false);
		}
	}


	return (
		<React.Fragment>
			<Grid columns={3}>
				<div className="questions-menu" style={{backgroundColor: 'red'}}>

				</div>
			</Grid>
			<Grid columns={9}>

			</Grid>
		</React.Fragment>
	)
}




export default EditTest;
