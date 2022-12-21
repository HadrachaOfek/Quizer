import React, { useEffect } from 'react';
import {
	Box,
	Button,
	Step,
	StepLabel,
	Stepper,
	Typography,
	TextField,
	Paper,
	Chip,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	FormControlLabel,
	Checkbox,
	Grid,
	CircularProgress,
	Autocomplete,
} from '@mui/material';
import { useState } from 'react';
import BaseServerUrl from './Assets/BaseServerUrl.jsx';
import axios from 'axios';

export default function CreateTestPage() {
	const [activeStep, setActiveStep] = useState(1);
	const steps = ['הגדרות מבחן', 'עריכת בנק שאלות', 'עריכת נבחנים'];
	const window = () => {
		if (activeStep === 0) {
			return <TestConfigs setActiveStep={setActiveStep} />;
		} else if (activeStep === 1) {
			return <QuestionsConfig setActiveStep={setActiveStep} />;
		} else if (activeStep === 2) {
			console.log('hello');
			return <UsersConfig setActiveStep={setActiveStep} />;
		}
	};
	return (
		<React.Fragment>
			<Paper
				variant='elevation'
				style={{
					padding: '10px',
					margin: '10px auto',
					width: '80vw',
				}}>
				<Stepper
					activeStep={activeStep}
					style={{ direction: 'rtl', marginBottom: '20px' }}>
					{steps.map((label, index) => {
						return (
							<Step key={index}>
								<StepLabel>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				{window()}
			</Paper>
		</React.Fragment>
	);
}

const TestConfigs = ({ setActiveStep }) => {
	const [title, setTitle] = useState(null);
	const [passingGrade, setPassingGrade] = useState(80);
	const [duration, setDuration] = useState(60);
	const [numOfQuestions, setNumOfQuestions] = useState(0);
	const [imgBuffer, setImgBuffer] = useState();
	const [instructions, setInstructions] = useState();
	const [errorMess, setErrorMess] = useState();
	const [admins, setAdmins] = useState([sessionStorage.getItem('userid')]);
	const picker = document.createElement('input');
	picker.type = 'file';
	picker.accept = 'image/*';
	picker.onchange = e => loadFile(e.target.files[0]);

	const loadFile = file => {
		const reader = new FileReader();
		reader.addEventListener('load', _ => {
			setImgBuffer(`${reader.result}`);
		});
		reader.readAsDataURL(file);
	};

	const validAndNext = async () => {
		if (
			title === null ||
			title.trim() === '' ||
			duration <= 0 ||
			numOfQuestions <= 0 ||
			passingGrade > 100 ||
			passingGrade < 0 ||
			instructions === null ||
			instructions.trim == ''
		) {
			setErrorMess('אחד מהשדות שגוי');
			setTimeout(_ => setErrorMess(''), 10000);
		} else {
			let body = {
				title: title,
				insturctions: instructions,
				logo: imgBuffer,
				duration: duration,
				numOfQuestions: numOfQuestions,
				passingGrade: passingGrade,
				admins:
					admins.length > 0
						? admins
						: [sessionStorage.getItem('userid')],
				users: [],
			};
			const res = await axios.post(
				BaseServerUrl(
					'test/create/' + sessionStorage.getItem('userid')
				),
				body
			);
			sessionStorage.setItem('testid', res.data);
			setActiveStep(1);
		}
	};

	const addAdmin = adminWrapper => {
		let admin = adminWrapper.value.trim();
		adminWrapper.value = '';
		if (
			admin !== null &&
			admin.trim() !== '' &&
			(admin.length === 7 || admin.length === 9)
		) {
			if (admins.indexOf(admin) === -1)
				setAdmins(admins.concat([admin.trim()]));
		}
	};

	const deleteAdmin = toDelete => {
		setAdmins(admins.filter(e => e !== toDelete));
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				direction: 'rtl',
				alignItems: 'center',
				gap: '10px',
			}}>
			<Typography variant='h4'>הגדרות מבחן</Typography>
			<Typography
				variant='body1'
				color={'red'}
				sx={{ color: 'red', direction: 'rtl' }}>
				{errorMess}
			</Typography>
			<TextField
				variant='outlined'
				required
				helperText='מומלץ לספק שם מתאים'
				error={title === ''}
				fullWidth
				onChange={e => setTitle(e.target.value)}
				label='שם המבחן'
			/>
			<TextField
				variant='outlined'
				required
				helperText={`${Math.floor(duration / 60)}:${
					duration % 60 < 10 ? '0' + (duration % 60) : duration % 60
				}`}
				fullWidth
				value={duration}
				onChange={e => setDuration(e.target.valueAsNumber)}
				type={'number'}
				label='משך המבחן (בדקות)'
			/>
			<Button
				variant='outlined'
				size='large'
				fullWidth
				onClick={_ => picker.click()}>
				בחר לוגו למבחן
			</Button>
			{imgBuffer !== undefined ? (
				<img src={imgBuffer} width={64} height={64} alt='preview' />
			) : undefined}
			<TextField
				variant='outlined'
				fullWidth
				required
				type='number'
				onChange={e => setNumOfQuestions(e.target.valueAsNumber)}
				label='מספר שאלות'
			/>
			<TextField
				variant='outlined'
				fullWidth
				type='number'
				value={80}
				onChange={e => setPassingGrade(e.target.value)}
				label='ציון עובר'
			/>
			<TextField
				variant='outlined'
				fullWidth
				multiline
				rows={5}
				label='הוראות'
				onChange={e => setInstructions(e.target.value)}
			/>
			<TextField
				variant='outlined'
				fullWidth
				label='מנהלי מבחן'
				onKeyDown={e =>
					e.key == 'Enter' ? addAdmin(e.target) : undefined
				}
				helperText={admins.map((val, index) => (
					<Chip
						variant='outlined'
						color='success'
						sx={{ padding: '10px' }}
						key={index}
						label={val}
						onDelete={e => deleteAdmin(val)}
					/>
				))}
			/>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}>
				<Button variant='contained' onClick={() => validAndNext()}>
					הבא
				</Button>
			</Box>
		</Box>
	);
};

const QuestionsConfig = ({ setActiveStep }) => {
	const [questions, setQuestions] = useState([]);
	const load = async () => {
		const temp = await axios.get(
			BaseServerUrl(`question/get/${sessionStorage.getItem('testid')}`)
		);
		const data = await temp.data;
		console.log(data);
		if (data != 'Faild') {
			setQuestions(data);
		}
	};
	useEffect(() => {
		load();
	}, []);
	return (
		<Grid container spacing={0.5}>
			{questions.map((element, index) => (
				<Grid item xs={12}>
					<QuestionConfig
						key={index}
						status={2}
						answers={element.answers}
						question={element.question}
						totalGrade={element.totalGrade}
						correctAnswer={
							element.answers.filter(e => e.grade > 0).length
						}
						image={element.img}
						id={element._id}
						refresh={_ => load()}
					/>
				</Grid>
			))}

			<Grid item xs={12}>
				<QuestionConfig refresh={_ => load()} status={0} />
			</Grid>
			<Grid item xs={12}>
				<Button variant='contained' onClick={() => setActiveStep(2)}>
					הבא
				</Button>
			</Grid>
		</Grid>
	);
};

const QuestionConfig = prop => {
	const [question, setQuestion] = useState(prop.question);
	const [answers, setAnswers] = useState(
		prop.answers !== undefined ? prop.answers : []
	);
	const [grade, setGrade] = useState(prop.totalGrade);
	const [status, setStatus] = useState(prop.status);
	const [imageStream, setImageStream] = useState(
		prop.image === '' ? undefined : prop.image
	);
	const [correctAnswer, setCorrectAnswer] = useState(
		prop.correctAnswer === undefined ? 0 : prop.correctAnswer
	);
	const [errorMessage, setErrorMessage] = useState('');

	const addAnswer = element => {
		let val = element.value.trim();
		element.value = '';
		if (val != '' && answers.indexOf(val) === -1) {
			setAnswers(answers.concat([{ answer: val, grade: 0 }]));
		}
	};

	const removeAnswer = value => {
		if (value.grade > 0) {
			checkEvent(false, value);
		}
		setAnswers(answers.filter(v => v.answer !== value.answer));
	};

	const checkEvent = (element, value) => {
		if (element) {
			value.grade = grade / (correctAnswer + 1);
			answers.map(ele =>
				ele.grade > 0
					? (ele.grade = grade / (correctAnswer + 1))
					: undefined
			);
			setCorrectAnswer(correctAnswer + 1);
		} else {
			value.grade = 0;
			if (correctAnswer !== 1) {
				answers.map(ele =>
					ele.grade > 0
						? (ele.grade = grade / (correctAnswer - 1))
						: (ele.grade = 0)
				);
			}
			setCorrectAnswer(correctAnswer - 1);
		}
	};

	const loadImage = file => {
		let reader = new FileReader();
		reader.addEventListener('load', _ => setImageStream(reader.result));
		reader.readAsDataURL(file);
	};

	const saveQuestion = async () => {
		if (
			question === undefined ||
			question.trim() === '' ||
			answers.length <= 1 ||
			grade <= 0 ||
			correctAnswer <= 0
		) {
			setErrorMessage('אחד מהשדות אינם תקפים');
		} else {
			const body = {
				type: correctAnswer == 1 ? 0 : 1,
				question: question,
				img: imageStream,
				totalGrade: grade,
				answers: answers,
				active: true,
			};
			console.log(body);
			setStatus(1);
			const resp = await axios.post(
				BaseServerUrl(
					`question/create/${sessionStorage.getItem(
						'userid'
					)}/${sessionStorage.getItem('testid')}`
				),
				body
			);
			if (resp.data === 'OK') {
				setStatus(2);
				if (prop.id !== undefined) {
					deleteQuestion(prop.id);
				} else {
					prop.refresh();
				}
			} else {
				setErrorMessage('לא הצליח להתחבר לשרת');
			}
		}
	};

	const deleteQuestion = async id => {
		const res = await axios.patch(
			BaseServerUrl(
				`question/delete/${sessionStorage.getItem(
					'userid'
				)}/${sessionStorage.getItem('testid')}/${prop.id}`
			)
		);
		console.log(res.data);
		if (res.data === 'OK') {
			prop.refresh();
		}
	};
	return (
		<React.Fragment>
			<Accordion>
				<AccordionSummary>
					<Grid container>
						<Grid item xs={5}>
							<Typography variant='caption'>
								{question}
							</Typography>
						</Grid>
						<Grid item xs={5}>
							<Typography variant='caption'>{grade}</Typography>
						</Grid>
						<Grid item xs={2}>
							<Typography variant='caption'>
								{status === 0 ? (
									'לא שמור'
								) : status === 1 ? (
									<CircularProgress />
								) : (
									'שמור'
								)}
							</Typography>
						</Grid>
					</Grid>
				</AccordionSummary>
				<AccordionDetails>
					<Grid container spacing={2}>
						<Grid item xs={8}>
							<TextField
								fullWidth
								type='text'
								label='שאלה'
								value={question}
								size='small'
								onChange={e => setQuestion(e.target.value)}
							/>
						</Grid>
						<Grid item xs={2}>
							<TextField
								fullWidth
								value={grade}
								type='number'
								label='ניקוד'
								size='small'
								onChange={e =>
									setGrade(e.target.valueAsNumber)
								}
							/>
						</Grid>
						<Grid item xs={2}>
							{imageStream === undefined ? (
								<Button variant='contained' component='label'>
									הוסף תמונה
									<input
										hidden
										accept='image/*'
										type='file'
										onChange={e =>
											loadImage(e.target.files[0])
										}
									/>
								</Button>
							) : (
								<Button
									variant='contained'
									component='label'
									onClick={_ => setImageStream(undefined)}>
									הסר תמונה
								</Button>
							)}
						</Grid>
						{imageStream !== undefined ? (
							<Grid item xs={12}>
								<img src={imageStream} />
							</Grid>
						) : undefined}
						{answers.map((value, index) => (
							<React.Fragment key={index}>
								<Grid item xs={8} sx={{ textAlign: 'right' }}>
									<FormControlLabel
										control={
											<Checkbox
												checked={
													value.grade > 0
														? true
														: false
												}
												onChange={e =>
													checkEvent(
														e.target.checked,
														value
													)
												}
											/>
										}
										label={value.answer}
									/>
								</Grid>
								<Grid item xs={2}>
									<TextField
										variant='standard'
										disabled
										value={value.grade}
									/>
								</Grid>
								<Grid item xs={2}>
									<Button onClick={e => removeAnswer(value)}>
										הסר תשובה
									</Button>
								</Grid>
							</React.Fragment>
						))}
						<Grid item xs={12}>
							<TextField
								fullWidth
								size='small'
								type='text'
								placeholder='תשובה חדשה'
								onKeyDown={e =>
									e.key === 'Enter'
										? addAnswer(e.target)
										: undefined
								}
							/>
						</Grid>
						<Grid item xs={2}>
							<Button
								variant='contained'
								onClick={_ => saveQuestion()}>
								שמור שאלה
							</Button>
						</Grid>
						<Grid item xs={8}>
							<Typography variant='body1' color={'red'}>
								{errorMessage}
							</Typography>
						</Grid>
						<Grid item xs={2}>
							<Button
								variant='outlined'
								disabled={prop.id === undefined}
								onClick={e => deleteQuestion(prop.id)}>
								מחק שאלה
							</Button>
						</Grid>
					</Grid>
				</AccordionDetails>
			</Accordion>
		</React.Fragment>
	);
};
const UsersConfig = ({ setActiveStep }) => {
	const [options, setOptions] = useState([]);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [userId, setUserId] = useState('');

	useEffect(() => {
		loadOptions();
	}, []);

	const loadOptions = async () => {
		const res = await axios.get(BaseServerUrl(`user/ids`));
		if (res.status === 200) {
			setOptions(res.data);
		}
	};

	const handleChoose = async id => {
		setUserId(id);
		if (options.indexOf(id) != -1) {
			const res = await axios.get(BaseServerUrl(`user/id/${id}`));
			if (res.status === 200) {
				console.log(res.data);
				setFirstName(res.data[0].firstName);
				setLastName(res.data[0].lastName);
			}
		}
	};

	const addUser = async () => {
		if (options.indexOf(userId) != -1) {
			const res = await axios.patch(
				BaseServerUrl(
					`user/add/${userId}/${sessionStorage.getItem('testid')}`
				)
			);
			if (res.status == 200) {
				setLastName('');
				setFirstName('');
				setUserId('');
			}
		} else {
			const res = await axios.post(BaseServerUrl(`user/create`), {
				firstName: firstName,
				lastName: lastName,
				userId: userId,
				linkedTest: [sessionStorage.getItem('testid')],
			});
			if (res.data == 'signd') {
				setLastName('');
				setFirstName('');
				setUserId('');
			}
		}
	};
	return (
		<Grid container spacing={1}>
			<Grid item xs={3}>
				<Autocomplete
					freeSolo={true}
					options={options}
					size='small'
					renderInput={params => (
						<TextField
							{...params}
							label={'מספר אישי'}
							onChange={e => handleChoose(e.target.value)}
						/>
					)}
				/>
			</Grid>
			<Grid item xs={3}>
				<TextField
					size='small'
					value={firstName}
					onChange={e => setFirstName(e.target.value)}
					fullWidth
					label='שם פרטי'
				/>
			</Grid>
			<Grid item xs={3}>
				<TextField
					size='small'
					value={lastName}
					onChange={e => setLastName(e.target.value)}
					fullWidth
					label='שם משפחה'
				/>
			</Grid>
			<Grid item xs={3}>
				<Button variant='contained' fullWidth onClick={e => addUser()}>
					הוסף
				</Button>
			</Grid>
			<Grid item xs={6}></Grid>
		</Grid>
	);
};
