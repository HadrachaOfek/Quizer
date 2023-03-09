import {
	Autocomplete,
	Box,
	Container,
	Fab,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ServerAddress from '../assets/ServerAddress';
import useQuery from '../assets/useQuery';
import DefaultBackground from '../components/DefaultBackground';
import logo from '../assets/QuizAirPurpleLogo.png';
import QuestionCard from '../components/QuestionCard';

function InspectTestPage() {
	const { userId, password, testId } = useParams();
	const examinee = useQuery().get('examinee');
	const [data, setData] = useState(null);
	const [options, setOptions] = useState(new Map());
	const [questions, setQuestions] = useState(new Map());
	const [selectedExaminee, setSelectedExaminee] = useState();

	useEffect(() => {
		fatchData();
	}, []);

	const fatchData = async () => {
		const res = await axios.get(
			ServerAddress(
				`users_test/inspect_tests/${userId}/${password}/${testId}?${
					examinee && 'examinee=' + examinee
				}`
			)
		);
		console.log(res.data);
		if (res.data[0]) {
			if (res.data[1].length === 0) {
				window.location.href = '/';
			}
			setData(res.data[1]);
			const temp = new Map();
			for (const e of res.data[1]) {
				temp.set(e.userId, e);
			}
			setOptions(temp);
			const temp2 = new Map();
			for (const question of res.data[2]) {
				temp2.set(question._id, question);
			}
			setQuestions(temp2);
			setSelectedExaminee(examinee || res.data[1][0].userId);
		}
	};

	return (
		<DefaultBackground>
			<Stack width='99vw' boxSizing='border-box' padding='20px'>
				<Stack direction='row' justifyContent='space-between'>
					<a href={`/accounts/dashboard/${userId}/${password}`}>
						<img src={logo} alt='Quiz Air' height='55px' />
					</a>
					<Tooltip title='התנתקות'>
						<Fab
							color='primary'
							variant='extended'
							onClick={e =>
								(window.location.href = '/accounts/gate')
							}>
							התנתקות
						</Fab>
					</Tooltip>
				</Stack>
				<Typography overflow='hidden' variant='h1'>
					צפייה במבחן
				</Typography>
				{data && (
					<Stack
						rowGap={2}
						sx={{ marginTop: '2rem' }}
						component={Container}>
						<Box
							sx={{
								display: 'grid',
								gap: '2rem',
								gridTemplateColumns: '2fr 1fr',
							}}>
							<Autocomplete
								options={[...options.keys()]}
								getOptionLabel={option =>
									`${options.get(option).firstName} ${
										options.get(option).lastName
									}  |  ${option}`
								}
								disableClearable
								ChipProps={{ sx: { padding: '10px' } }}
								filterSelectedOptions={true}
								groupBy={option => options.get(option).group}
								onChange={(e, val, res) => {
									{
										setSelectedExaminee(val);
									}
								}}
								clearIcon={null}
								value={selectedExaminee}
								renderInput={params => (
									<TextField {...params} label='בחר נבחן' />
								)}
							/>
							<TextField
								fullWidth
								value={options.get(selectedExaminee).grade}
								label='ציון במבחן'
							/>
						</Box>

						{options
							.get(selectedExaminee)
							.questions.map(({ answers, linkedQuestion }) => {
								return (
									<QuestionCard
										readOnly={true}
										key={linkedQuestion}
										selected={answers}
										id={linkedQuestion}
										answers={
											questions.get(linkedQuestion)
												.answers
										}
										question={
											questions.get(linkedQuestion)
												.question
										}
										type={
											questions.get(linkedQuestion).type
										}
										img={questions.get(linkedQuestion).img}
									/>
								);
							})}
					</Stack>
				)}
			</Stack>
		</DefaultBackground>
	);
}

/**
 * return (
									<QuestionCard
										selected={answers}
										id={linkedQuestion}
										answers={
											questions.get(linkedQuestion)
												.answers
										}
										question={
											questions.get(linkedQuestion)
												.question
										}
										type={
											questions.get(linkedQuestion).type
										}
										img={questions.get(linkedQuestion).img}
									/>
								);
 */
export default InspectTestPage;
