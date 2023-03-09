import {
	Typography,
	Stack,
	Stepper,
	Step,
	StepLabel,
	Grid,
	TextField,
	Chip,
	Divider,
	Collapse,
	Box,
	Button,
	Autocomplete,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import React, { useContext, useEffect } from 'react';
import DefaultBackground from '../components/DefaultBackground';
import logo from '../assets/QuizAirPurpleLogo.png';
import { Container } from '@mui/system';
import useQuery from '../assets/useQuery';
import { useState } from 'react';
import QuestionEdit from '../components/QuestionEdit';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ServerAddress from '../assets/ServerAddress';
import imagePlaceholder from '../assets/imagePlaceholder.jpg';
import { SnackbarContext } from '../App';

const TestSettings = ({
	nextPage,
	testId,
	data,
	optionalCoOnwers = new Map(),
}) => {
	const { openBackdrop, closeBackdrop } = useContext(SnackbarContext);
	const [refresh, setRefresh] = useState(true);
	const [coOwnerList, setCoOwnerList] = useState(
		new Set(data && data.coOwner)
	);
	const [title, setTitle] = useState(data !== null ? data.title : '');
	const [instructions, setinstructions] = useState(
		data !== null ? data.instructions : ''
	);
	const [logo, setLogo] = useState(data !== null ? data.logo : '');
	const [duration, setDuration] = useState(
		data !== null ? data.duration : 60
	);
	const [passingGrade, setPassingGrade] = useState(
		data !== null ? data.passingGrade : 60
	);
	const [numOfQuestions, setNumOfQuestions] = useState(
		data !== null ? data.numOfQuestions : 0
	);
	const { password, userId } = useParams();
	const [isValid, setIsValid] = useState(false);
	useEffect(() => {
		setIsValid(
			title.trim() !== '' &&
				instructions.trim() !== '' &&
				duration > 0 &&
				passingGrade >= 0 &&
				passingGrade <= 100 &&
				numOfQuestions > 0
		);
	}, [
		coOwnerList,
		title,
		instructions,
		logo,
		duration,
		passingGrade,
		numOfQuestions,
	]);

	const handleSubmit = async () => {
		if (testId !== null) {
			const res = await axios.patch(
				ServerAddress(
					`test/edit_test/${userId}/${password}/${testId}`
				),
				{
					owner: userId,
					coOwner: [...coOwnerList.values()],
					title: title,
					instructions: instructions,
					logo: logo,
					duration: duration,
					passingGrade: passingGrade,
					numOfQuestions: numOfQuestions,
				}
			);
			if (res.data[0]) {
				nextPage();
			}
			console.log(res.data);
		} else {
			const res = await axios.post(
				ServerAddress(`test/new_test/${userId}/${password}`),
				{
					owner: userId,
					coOwner: [...coOwnerList.values()],
					title: title,
					instructions: instructions,
					logo: logo,
					duration: duration,
					passingGrade: passingGrade,
					numOfQuestions: numOfQuestions,
				}
			);
			if (res.data[0]) {
				window.location.href = `/accounts/edit_test/${userId}/${password}?stg=1&id=${res.data[1]}`;
			}
		}
	};

	const fileReader = new FileReader();

	fileReader.onload = () => setLogo(fileReader.result);
	return (
		<Grid container component={Container} spacing={2} margin={'10px auto'}>
			<Grid item xs={12}>
				<Typography variant='h3' align='center'>
					הגדרות מבחן
				</Typography>
			</Grid>
			<Grid item xs={12} md={6}>
				<TextField
					label='שם המבחן'
					value={title}
					fullWidth
					onChange={e => setTitle(e.target.value)}
				/>
			</Grid>
			<Grid item xs={12} md={5}>
				<TextField
					type='file'
					label='העלאת סמל מבחן'
					fullWidth
					onChange={e => fileReader.readAsDataURL(e.target.files[0])}
					inputProps={{
						accept: 'image/png,image/jpeg',
						multiple: false,
					}}
					helperText='ניתן להעלות תמונות מסוג jpg או png  בלבד'
				/>
			</Grid>
			<Grid item xs={12} md={1}>
				<img
					src={logo || imagePlaceholder}
					alt='logo'
					style={{
						width: '100%',
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					minRows={5}
					maxRows={7}
					fullWidth
					multiline
					value={instructions}
					onChange={e => setinstructions(e.target.value)}
					label='הנחיות למבחן'
					placeholder='דוגמא: נבחן יקר לפניך מבחן ב________ עם __ שאלות עליך לענות לפחות על __ שאלות על מנת לעבור, לרשותכם עומדים __ דקות'
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<TextField
					type='number'
					value={numOfQuestions}
					label='מספר שאלות נדרשות'
					fullWidth
					onChange={e => setNumOfQuestions(e.target.valueAsNumber)}
				/>
			</Grid>
			<Grid item xs={12} md={6}>
				<TextField
					type='number'
					value={duration}
					label='משך מבחן'
					helperText='נא להזין משך בדקות'
					onChange={e => setDuration(e.target.valueAsNumber)}
					fullWidth
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<TextField
					type='number'
					label='ציון עובר'
					value={passingGrade}
					fullWidth
					onChange={e => setPassingGrade(e.target.valueAsNumber)}
				/>
			</Grid>
			<Grid item xs={12}>
				<Autocomplete
					multiple
					options={[...optionalCoOnwers.keys()]}
					getOptionLabel={option =>
						`${option} | ${
							optionalCoOnwers.has(option) &&
							optionalCoOnwers.get(option).firstName
						} ${
							optionalCoOnwers.has(option) &&
							optionalCoOnwers.get(option).lastName
						}`
					}
					ChipProps={{ sx: { padding: '10px' } }}
					filterSelectedOptions={true}
					onChange={(e, val, res) => {
						console.log(val);
						setCoOwnerList(new Set(val));
						console.log(coOwnerList);
					}}
					defaultValue={[...coOwnerList.values()]}
					renderInput={params => (
						<TextField {...params} label='עורכים שותפים' />
					)}
				/>
			</Grid>
			<Grid item xs={12} sx={{ textAlign: 'center' }}>
				<Button
					onClick={e => handleSubmit()}
					variant='contained'
					disabled={!isValid}>
					המשך
				</Button>
			</Grid>
		</Grid>
	);
};

export default TestSettings;
