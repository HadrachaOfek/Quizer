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
	const [optionalCoOwners, setOptionalCoOwner] = useState(new Map());

	useEffect(() => {
		fatchUserFromTheServer();
		if (testId !== null) {
			openBackdrop();
			fatchQuestionsList();
			fatchData();
		}
	}, []);

	/**
	 * This function invoked when there is a change in the @questionList or @testData
	 * States, its checking if the number of the active question in the question bank
	 * match the minimum requierd to activate the test
	 */
	useEffect(() => {
		if (testData && questionList) {
			setIsTestValid(
				testData.numOfQuestions <=
					questionList.filter(e => e.active).length
			);
		}
	}, [questionList, testData]);

	/**
	 * This function fatch the testData frm the server
	 */
	const fatchData = async () => {
		const res = await axios.get(
			ServerAddress(`test/get_test_info/${userId}/${password}/${testId}`)
		);
		if (res.data[0]) {
			setTestData({ ...res.data[1], groupsCount: res.data[2] });
			closeBackdrop();
		}
	};

	/**
	 * This function sent to the exminees page, allow to add a new group to the test
	 * @param {String} groupName
	 */
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

	/**
	 * This function sent to the exminees page, allow to delete group from the test
	 * @param {String} groupName
	 */
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

	/**
	 * This function fatch all the question data from the server
	 */
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

	/**
	 * This function sent to the question bank page allow to delete question from the bank
	 * @param {String} _id
	 */
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

	const fatchUserFromTheServer = async () => {
		const res = await axios.get(
			ServerAddress(`user/ids/${userId}/${password}`)
		);
		if (res.data[0]) {
			const temp = new Map();
			for (const e of res.data[1]) {
				temp.set(e.userId, e);
			}
			setOptionalCoOwner(temp);
		}
	};
	return (
		<DefaultBackground>
			<Stack position='fixed' width='100vw' padding='20px'>
				<a href={`/accounts/dashboard/${userId}/${password}`}>
					<img
						src={logo}
						alt='Quiz Air'
						height='50px'
						style={{ width: 'fit-content' }}
					/>
				</a>
				<Typography variant='h1' sx={{ paddingBottom: '20px' }}>
					עריכת מבחן
				</Typography>
				<Stepper
					activeStep={stage}
					alternativeLabel
					sx={{ direction: 'ltr', marginBottom: '3vh' }}>
					<Step key={0}>
						<StepLabel onClick={_ => stage > 0 && setStage(0)}>
							הגדרת מבחן
						</StepLabel>
					</Step>
					<Step key={1} onClick={_ => stage > 1 && setStage(1)}>
						<StepLabel>בנק שאלות</StepLabel>
					</Step>
					<Step key={2} onClick={_ => isTestValid && setStage(2)}>
						<StepLabel>הרשאות</StepLabel>
					</Step>
				</Stepper>
				<Container>
					<Collapse in={stage === 0}>
						{testId && testData === null ? undefined : (
							<TestSettings
								optionalCoOnwers={optionalCoOwners}
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
							/>
						)}
					</Collapse>
					<Collapse in={stage === 2}>
						{testId && testData === null ? undefined : (
							<Examinees
								isTestValid={isTestValid}
								testId={testId}
								groups={testData ? testData.groups : []}
								groupsCount={
									testData ? testData.groupsCount : []
								}
								addGroup={newGroup}
								deleteGroup={deleteGroup}
								nextPage={e =>
									(window.location.href = `/accounts/dashboard/${userId}/${password}`)
								}
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
