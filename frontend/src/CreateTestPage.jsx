import React from 'react';
import {
	Box,
	Button,
	Step,
	StepLabel,
	Stepper,
	Typography,
	Input,
	TextField,
	TextareaAutosize,
	Paper,
	Snackbar,
	Chip,
} from '@mui/material';
import { useState } from 'react';
import BaseServerUrl from './Assets/BaseServerUrl.jsx';
import axios from 'axios';

export default function CreateTestPage() {
	const [activeStep, setActiveStep] = useState(0);
	const steps = ['הגדרות מבחן', 'עריכת בנק שאלות', 'עריכת נבחנים'];
	return (
		<React.Fragment>
			<Paper
				variant='elevation'
				style={{
					padding: '10px',
					margin: '10px auto',
					width: '80vw',
				}}>
				<Stepper activeStep={activeStep} style={{ direction: 'rtl' }}>
					{steps.map((label, index) => {
						return (
							<Step key={index}>
								<StepLabel>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				{activeStep === 0 ? (
					<TestConfigs setActiveStep={setActiveStep} />
				) : (
					<QuestionsConfig />
				)}
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
	const [admins, setAdmins] = useState([]);
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
				admins: admins.length > 0 ? admins : ['8476889'],
				users: [],
			};
			const res = await axios.post(
				BaseServerUrl('test/create/8476889'),
				body
			);
			console.log(res.data);
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

const QuestionsConfig = () => {
	return <Box>hello 2</Box>;
};
