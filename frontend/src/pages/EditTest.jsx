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
import TestSettings from '../components/TestSettings';
import QuestionBank from '../components/QuestionBank';
import Examinees from '../components/Examinees';

function EditTest() {
	const [stage, setStage] = useState(useQuery().get('stg') | 0);
	const [testId, setTestId] = useState(useQuery().get('id') || null);
	const [questionList, setQuestionsList] = useState([]);
	const [testData, setTestData] = useState(null);
	const { password, userId } = useParams();
	const { openBackdrop, popAlert, closeBackdrop, closeModal } =
		useContext(SnackbarContext);
	const [isTestValid, setIsTestValid] = useState(false);

	useEffect(() => {
		if (testId !== null) {
			openBackdrop();
			fatchQuestionsList();
			fatchData();
		}
	}, []);

	useEffect(() => {
		if (testData && questionList) {
			setIsTestValid(
				testData.numOfQuestions <=
					questionList.filter(e => e.active).length
			);
		}
	}, [questionList, testData]);

	const fatchData = async () => {
		const res = await axios.get(
			ServerAddress(`test/get_test_info/${userId}/${password}/${testId}`)
		);
		if (res.data[0]) {
			setTestData(res.data[1]);
			closeBackdrop();
		}
	};

	const newGroup = async groupName => {
		openBackdrop();
		const res = await axios.patch(
			ServerAddress(
				`test/add_group/${userId}/${password}/${testId}/${groupName}`
			)
		);
		console.log(res.data);
		if (res.data[0]) {
			await fatchData();
			closeBackdrop();
		}
	};

	const deleteGroup = async groupName => {
		const res = await axios.patch(
			ServerAddress(
				`test/delete_group/${userId}/${password}/${testId}/${groupName}`
			)
		);
		console.log(res.data);
		if (res.data[0]) {
			openBackdrop();
			await fatchData();
			closeModal();
		}
	};

	const fatchQuestionsList = async () => {
		const res = await axios.get(
			ServerAddress(
				`question/get_linkes_questions/${userId}/${password}/${testId}`
			)
		);
		if (res.data[0]) {
			setQuestionsList(res.data[1]);
		}
	};
	/**
	 * The function update an existing question or create new when not _id supplide
	 * @param {String} _id the id of the question to update
	 * @param {Object} body
	 */
	const handleQuestionSubmit = async (_id, body) => {
		const res = await (_id
			? axios.patch(
					ServerAddress(
						`question/edit_questions/${userId}/${password}/${testId}/${_id}`
					),
					body
			  )
			: axios.post(
					ServerAddress(
						`question/new_questions/${userId}/${password}/${testId}`
					),
					body
			  ));
		console.log(res.data[0]);
		if (res.data[0]) {
			openBackdrop();
			await fatchQuestionsList();
			closeBackdrop();
		}
	};

	const deleteQuestion = async _id => {
		const res = await axios.delete(
			ServerAddress(
				`question/delete/${userId}/${password}/${testId}/${_id}`
			)
		);
		if (res.data[0]) {
			openBackdrop();
			await fatchQuestionsList();
			closeBackdrop();
		}
	};
	return (
		<DefaultBackground>
			<Stack position='fixed' width='100vw' padding='20px'>
				<img src={logo} alt='Quiz Air' width='10%' />
				<Typography variant='h1' sx={{ paddingBottom: '20px' }}>
					עריכת מבחן
				</Typography>
				<Stepper
					activeStep={stage}
					alternativeLabel
					sx={{ direction: 'ltr' }}>
					<Step key={0}>
						<StepLabel>הגדרת מבחן</StepLabel>
					</Step>
					<Step key={1}>
						<StepLabel>בנק שאלות</StepLabel>
					</Step>
					<Step key={2}>
						<StepLabel>הרשאות</StepLabel>
					</Step>
				</Stepper>
				<Container>
					<Collapse in={stage === 0}>
						{testId && testData === null ? undefined : (
							<TestSettings
								data={testData}
								testId={testId}
								nextPage={e => setStage(1)}
							/>
						)}
					</Collapse>
					<Collapse in={stage === 1}>
						{testId && testData === null ? undefined : (
							<QuestionBank
								data={questionList}
								testId={testId}
								numberOfQuestionsRequired={
									testData ? testData.numOfQuestions : 0
								}
								submitQuestion={handleQuestionSubmit}
								deleteQuestion={deleteQuestion}
								isTestValid={isTestValid}
								nextPage={e =>
									isTestValid
										? setStage(2)
										: (window.location.href = `/accounts/dashboard/${userId}/${password}`)
								}
								previousPage={e => setStage(0)}
							/>
						)}
					</Collapse>
					<Collapse in={stage === 2}>
						{testId && testData === null ? undefined : (
							<Examinees
								isTestValid={isTestValid}
								testId={testId}
								groups={testData ? testData.groups : []}
								addGroup={newGroup}
								deleteGroup={deleteGroup}
								nextPage={e =>
									(window.location.href = `/accounts/dashboard/${userId}/${password}`)
								}
								previousPage={e => setStage(1)}
							/>
						)}
					</Collapse>
				</Container>
			</Stack>
		</DefaultBackground>
	);
}

/**
const Examinees = () => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" align="center">
            הגדירו למי יש גישה להשיב למבחן
          </Typography>
        </Grid>
        <Grid item xs={12} md={3.5}>
          <TextField label="שם פרטי" size="small" fullWidth />
        </Grid>
        <Grid item xs={12} md={3.5}>
          <TextField label="שם משפחה" size="small" fullWidth />
        </Grid>
        <Grid item xs={12} md={3.5}>
          <TextField label="מספר אישי" size="small" fullWidth />
        </Grid>
        <Grid item xs={12} md={1.5}>
          <Button variant="contained" size="medium" fullWidth>
            <PersonAddIcon />
            <Typography variant="caption">הוספה</Typography>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
*/
export default EditTest;
