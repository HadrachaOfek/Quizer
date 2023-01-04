
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ServerAddress from "../assets/ServerAddress";
import { Paper, Box, Typography, Grid, TextField, Switch, Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Skeleton from '@mui/material/Skeleton';


function EditTest() {
	const { id, testid, password } = useParams();
	const [questions, setQuestions] = useState('loading');
	const [addQuestionScreen, setAddQuestionScreen] = useState(false);
	const [type, setType] = useState('');
	const [active, setActive] = useState(true);
	const [img, setImg] = useState('');
	const [question, setQuestion] = useState('');
	const [totalGrade, setTotalGrade] = useState();
	const [answers, setAnswers] = useState(new Array(10));
	const [currAnswers, setCurrAnswers] = useState([]);

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
		const res = await axios.get(ServerAddress(`question/get_linkes_questions/${testid}`));
		if (res.status === 200) {
			setQuestions(res.data);
			console.log(res.data);
		} else {
			console.log(res.data);
		}
	}

	const addQuestion = async () => {
		const res = await axios.post(ServerAddress(`question/create/${id}/${password}/${testid}`), {
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

	const addInput = () => {
		setCurrAnswers(s => {
			return [
				...s,
				{
					answer: '',
					grade: 0
				}

			];
		});
	};
	function questionStatus() {
		if (questions === 'loading') {
			return <React.Fragment>
				<Skeleton animation="wave" />
				<Skeleton animation="wave" />
				<Skeleton animation="wave" />
			</React.Fragment>
		} else if (questions) {
			return <React.Fragment>
				{questions.map((question, index) => {
					return <div key={index} sx={{ width: 'max-content' }}>{question.question}</div>
				})}
				<Button className="add-question" onClick={() => setAddQuestionScreen(true)}>הוספת שאלה</Button>
			</React.Fragment>
		} else {
			return <React.Fragment className="add-question">
				<h1>!נראה שאין כאן שאלות... בואו נוסיף כאלה</h1>
				<Button className="add-question" onClick={() => setAddQuestionScreen(true)}>הוספת שאלה</Button></React.Fragment>
		}
		
	}

	const addAnswer = async (value, index, type) => {
		let obj;
		if (type === 'grade') {
			obj = { grade: value }
		} else {
			obj = { answer: value }
		}
		answers[index] = { ...answers[index], ...obj };
		setAnswers(answers);
	}


	return (
		<React.Fragment>
			<Grid container spacing={1}>
				<Grid sm={3} item className="questions-menu" sx={{
					boxShadow: '13px 0px 4px 12px #a2aaad',
					backgroundColor: '#92b2f6', height: '600px', width: 'max-content', padding: '10px'
				}}>
					{questionStatus()}

				</Grid>

				<Grid sm={9} item>

					{
						addQuestionScreen ?
							<div><Typography variant='h4' sx={{ marginBottom: '20px' }}>
								הגדרות שאלה חדשה
							</Typography>
								<Grid container spacing={1}>
									<Grid item sx={12} sm={6}>
										<FormControl fullWidth>
											<InputLabel id="demo-simple-select-label">סטטוס שאלה</InputLabel>
											<Select
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												value={active}
												label="סטטוס שאלה"
												onChange={e => { setActive(e.target.value) }}
											>
												<MenuItem value={true}>שאלה פעילה</MenuItem>
												<MenuItem value={false}>שאלה לא פעילה</MenuItem>
											</Select>
										</FormControl>
									</Grid>
									<Grid item sx={12} sm={6}>
										<FormControl fullWidth>
											<InputLabel id="demo-simple-select-label">סוג שאלה</InputLabel>
											<Select
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												value={type}
												label="סוג שאלה"
												onChange={e => { setType(e.target.value) }}
											>
												<MenuItem value={0}>רב ברירה</MenuItem>
												<MenuItem value={1}>חד ברירה</MenuItem>
											</Select>
										</FormControl>
									</Grid>


									<Grid item sx={12} sm={5.6}>
										<TextField type='text' label='שאלה' onChange={e => setQuestion(e.target.value)}
											fullWidth />
									</Grid>
									<Grid item sx={12} sm={5.7}>
										<TextField type='number' label='ציון כולל לשאלה' fullWidth onChange={e => setTotalGrade(e.target.value)} />
									</Grid>

									{currAnswers.map((item, i) => {
										return (
											<React.Fragment key={i}>
												<Grid item xs={6}>
													<TextField type='text' label='יש להכניס תשובה' fullWidth onChange={e => addAnswer(e.target.value, i, 'answer')} multiline rows={2} />
												</Grid>
												<Grid item xs={6}>
													<TextField type='number' label='ציון' fullWidth onChange={e => addAnswer(e.target.value, i, 'grade')}></TextField>
												</Grid>
											</React.Fragment>
										);
									})}
									<Grid item sx={12}>
										<button className="add-answer" onClick={() => addInput()}>הוסף תשובה</button>
									</Grid>
									<Grid item sx={10} sm={3}>
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
							</div>
							: ''
					}
				</Grid>
			</Grid>
		</React.Fragment>
	)
}




export default EditTest;
