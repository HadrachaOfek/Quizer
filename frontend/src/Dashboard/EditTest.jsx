
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
	const [type, setType] = useState(0);
	const [active, setActive] = useState(true);
	const [img, setImg] = useState('');
	const [question, setQuestion] = useState('');
	const [totalGrade, setTotalGrade] = useState();
	const [answers, setAnswers] = useState(new Array(4));
	const [allQuestions, setAllQuestions] = useState([]);
	let testHasQuestions = false;

	const filePicker = document.createElement('input')
	filePicker.type = 'file';
	filePicker.accept = 'image/*';
	filePicker.onchange = (e) => {
		console.log(e.target.files[0]);
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
		}
	}

	const reader = new FileReader();
	reader.addEventListener('loadend', () => {
		setImg(reader.result);
	});

	useEffect(_ => {
		getData();
	}, [])

	const getData = async () => {
		const res = await axios.get(ServerAddress(`get_linkes_questions/${testid}`));
		if (res.status === 200) {
			setAllQuestions(res.data);
			testHasQuestions = true;
		} else {
			testHasQuestions = false;
		}
	}

	const addQuestion = async () => {
		const res = await axios.post(ServerAddress(`create/${id}/${password}/${testid}`), {
			linkedTest: testid,
			type: type,
			img: img,
			active: active,
			question: question.trim(),
			totalGrade: totalGrade,
			answers: answers
		});
		console.log(res.data);
		if (res.data) {
			alert('השאלה נוספה בהצלחה !')
			setTimeout(_ => window.location.replace(`/dashboard/edit_questions/${id}/${password}/${testid}`));
		}
	}

	function addAnswer(currAnswer, place) {
		setAnswers(answers[place - 1] = ({ answer: currAnswer.split(',')[0], grade: Number(currAnswer.split(',')[1]) }))
	}
	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
			{
				testHasQuestions ? <div className="edit-questions">edit</div>
					:
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '100vh',
							width: '100vw',
						}}>
						<Paper variant='outlined' >
							<Typography variant='h4' sx={{ marginBottom: '20px' }}>
								הגדרות שאלה חדשה
							</Typography>
							<Grid container spacing={1}>
								<Grid item sx={12} sm={6}>
									<FormControlLabel
										value="end"
										control={<Switch color="primary" onChange={e => setActive(e.target.checked)} />}
										label="שאלה פעילה"
										labelPlacement="end"
									/>
								</Grid>
								<Grid item sx={12} sm={6}>

									<TextField type='number' label='סוג השאלה '
										helperText="0 לשאלה חד בחירתית ו1 לשאלה רב בחירתית" onChange={e => setType(e.target.value)} fullWidth />
								</Grid>


								<Grid item sx={12} sm={5.6}>
									<TextField type='text' label='שאלה' onChange={e => setQuestion(e.target.value)}
										fullWidth />
								</Grid>
								<Grid item sx={12} sm={5.7}>
									<TextField type='number' label='ציון כולל לשאלה' fullWidth onChange={e => setTotalGrade(e.target.value)} />
								</Grid>

								<Grid item sx={12} sm={10}>
									<TextField type='text' label='תשובה וציון מופרדים בפסיק' fullWidth onChange={e => addAnswer(e.target.value, 1)} multiline rows={2} />
									<TextField type='text' label='תשובה וציון מופרדים בפסיק' fullWidth onChange={e => addAnswer(e.target.value, 2)} multiline rows={2} />
									<TextField type='text' label='תשובה וציון מופרדים בפסיק' fullWidth onChange={e => addAnswer(e.target.value, 3)} multiline rows={2} />
									<TextField type='text' label='תשובה וציון מופרדים בפסיק' fullWidth onChange={e => addAnswer(e.target.value, 4)} multiline rows={2} />

								</Grid>
								<Grid>
									<Button fullWidth size='large' sx={{ height: '100%' }} variant='outlined' onClick={e => filePicker.click()}>
										{img ? <img src={img} width='100' height='100' /> : 'הוספת תמונה'}
									</Button>
								</Grid>
								<Grid item xs={12} sx={{ textAlign: 'center' }}>
									<Button variant='contained' onClick={e => addQuestion()}>
										הוסף שאלה
									</Button>
								</Grid>
							</Grid>


						</Paper>
					</Box>

			}
		</Box>
	);
}

export default EditTest;
