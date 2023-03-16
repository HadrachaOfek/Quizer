import {
	Autocomplete,
	Button,
	CircularProgress,
	Container,
	Divider,
	Grid,
	IconButton,
	LinearProgress,
	Paper,
	Skeleton,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { read, utils, write, writeFileXLSX } from 'xlsx';
import { Box } from '@mui/system';
import axios from 'axios';
import excelLogoIcon from '../assets/icons8-microsoft-excel.svg';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ServerAddress from '../assets/ServerAddress';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import { SnackbarContext } from '../App';

function GroupEdit({
	groupName,
	testId,
	userId,
	password,
	close,
	deleteGroup,
}) {
	const FILE_EXPLENETION =
		'הנכם מתבקשים להעלות קובץ excel עם 3 עמודות  עם הכותרות הבאות : id,firstName,LastName';
	const [examineeId, setExamineeId] = useState('');
	const [examineeFirstName, setExamineeFirstName] = useState('');
	const [examineeLastName, setExamineeLastName] = useState('');
	const [examineesMap, setExamineesMap] = useState(new Map());
	const [average, setAverage] = useState(0);
	const [maxGrade, setMaxGrade] = useState(0);
	const [uploadButton, setUploadButton] = useState(
		<React.Fragment>
			<img src={excelLogoIcon} width='24px' />
			<Typography fontSize='11pt' marginRight='5px' fontWeight={550}>
				העלאת קובץ
			</Typography>
		</React.Fragment>
	);
	const [load, setLoad] = useState(true);
	const [refresh, setRefresh] = useState(false);
	const [possibleExamineeList, setPossibleExamineeList] = useState([]);

	const fatchPossibleExamineeList = async () => {
		const res = await axios.get(
			ServerAddress(
				`users_test/get_all_possible_examinees/${userId}/${password}`
			)
		);
		if (res.data[0]) {
			setPossibleExamineeList(res.data[1]);
		}
	};
	const CreateExaminee = () => {
		CreateExamineeHelper(examineeId, examineeFirstName, examineeLastName);
		setExamineeId('');
		setExamineeFirstName('');
		setExamineeLastName('');
	};

	const CreateExamineeHelper = async (id, firstName, lastName) => {
		if (
			id.match('\\d{7,9}') &&
			firstName.trim() !== '' &&
			lastName.trim() !== '' &&
			!examineesMap.has(id)
		) {
			const res = await axios.post(
				ServerAddress(
					`users_test/build_pesonal_quiz/${userId}/${password}/${testId}`
				),
				{
					userId: id,
					firstName: firstName,
					lastName: lastName,
					group: groupName,
				}
			);
			console.log(res.data);
			if (res.data[0]) {
				examineesMap.set(id, {
					userId: id,
					firstName: firstName,
					lastName: lastName,
				});
				setRefresh(!refresh);
			}
		}
	};

	useEffect(() => {
		fatchData();
		fatchPossibleExamineeList();
	}, []);

	/**
	 * Fatch the group data from the server
	 */
	const fatchData = async () => {
		const res = await axios.get(
			ServerAddress(
				`users_test/get_all_examinees/${userId}/${password}/${testId}/${groupName}`
			)
		);
		const map = new Map();
		if (res.data[0]) {
			let av = 0,
				max = 0;
			res.data[1].forEach(element => {
				map.set(element.userId, {
					userId: element.userId,
					firstName: element.firstName,
					lastName: element.lastName,
					grade: element.grade,
					endTime: Date.parse(element.endTime),
				});
				max = Math.max(element.grade, max);
				av += element.grade;
			});
			setMaxGrade(max);
			setAverage(res.data[1].length !== 0 && av / res.data[1].length);
		}
		setExamineesMap(map);
		setLoad(false);
	};

	const createSheet = () => {
		const workBook = utils.book_new();
		const sheet = utils.aoa_to_sheet([]);
		utils.sheet_add_json(sheet, [...examineesMap.values()]);
		workBook.SheetNames.push('grades');
		workBook.Sheets['grades'] = sheet;
		writeFileXLSX(workBook, `גליון ציונים קורס ${groupName}.xlsx`);
	};

	const deleteExaminee = async id => {
		const res = await axios.patch(
			ServerAddress(
				`users_test/delete_examinee/${userId}/${password}/${testId}/${id}`
			)
		);
		const map = new Map();
		if (res.data[0]) {
			res.data[1].forEach(element => {
				map.set(element.userId, {
					userId: element.userId,
					firstName: element.firstName,
					lastName: element.lastName,
				});
			});
		}
		setExamineesMap(map);
	};

	//handle excel upload
	const filePicker = document.createElement('input');
	filePicker.type = 'file';
	filePicker.onchange = e => {
		setUploadButton(<LinearProgress />);
		fileReader.readAsBinaryString(e.target.files[0]);
	};

	const fileReader = new FileReader();
	fileReader.onload = e => {
		const word = read(fileReader.result, { type: 'binary' });
		utils.sheet_to_json(word.Sheets[word.SheetNames[0]]).forEach(row => {
			CreateExamineeHelper(
				row.id.toString(),
				row.firstName,
				row.lastName
			);
		});
		setUploadButton(
			<React.Fragment>
				<img src={excelLogoIcon} width='24px' />
				<Typography fontSize='11pt' marginRight='5px' fontWeight={550}>
					העלאת קובץ
				</Typography>
			</React.Fragment>
		);
	};
	return (
		<Container
			component={Paper}
			sx={{
				margin: '5vh auto',
				position: 'relative',
				height: '90vh',
			}}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant='h2' align='center'>
						{groupName}
					</Typography>
				</Grid>
				<Grid item xs={12} md={3}>
					<Stack spacing={2}>
						<TextField
							value={examineeId}
							label='מספר מזהה'
							onChange={e => setExamineeId(e.target.value)}
						/>
						<TextField
							label='שם פרטי'
							value={examineeFirstName}
							onChange={e =>
								setExamineeFirstName(e.target.value)
							}
						/>
						<TextField
							label='שם משפחה'
							value={examineeLastName}
							onChange={e => setExamineeLastName(e.target.value)}
						/>
						<Button
							variant='contained'
							onClick={e => CreateExaminee()}>
							הוסף לרשימה
						</Button>
						<Divider />
						<Tooltip title={FILE_EXPLENETION}>
							<Button
								variant='outlined'
								onClick={e => filePicker.click()}>
								{uploadButton}
							</Button>
						</Tooltip>
					</Stack>
				</Grid>
				<Grid item xs={12} md={9}>
					{load ? (
						<Stack spacing={2}>
							<Skeleton variant='rounded' height='20px' />
						</Stack>
					) : (
						<Stack
							spacing={1}
							sx={{ overflowY: 'scroll', minHeight: '90%' }}>
							{[...examineesMap.values()].map(element => (
								<Paper
									variant='outlined'
									sx={{
										padding: '5px',
										display: 'grid',
										gridTemplateColumns:
											'2fr 2fr 2fr 2fr 1fr',
									}}
									key={element.userId}>
									<Typography variant='h5'>
										{element.firstName}
									</Typography>
									<Typography variant='h5'>
										{element.lastName}
									</Typography>
									<Typography variant='h5'>
										{element.userId}
									</Typography>
									<Typography variant='h5'>
										{element.grade}
									</Typography>
									<Box>
										<Tooltip title='צפייה במבחן'>
											<IconButton
												onClick={e =>
													(window.location.href = `/accounts/inspect/${userId}/${password}/${testId}?examinee=${element.userId}`)
												}>
												<DescriptionIcon />
											</IconButton>
										</Tooltip>
										<Tooltip title='מחיקת מבחן של משתמש'>
											<IconButton
												onClick={e =>
													deleteExaminee(
														element.userId
													)
												}>
												<DeleteIcon />
											</IconButton>
										</Tooltip>
									</Box>
								</Paper>
							))}
						</Stack>
					)}
				</Grid>
			</Grid>
			<Box
				sx={{
					position: 'absolute',
					bottom: '0px',
					left: '0px',
					right: '0px',
					padding: '10px',
				}}>
				<Divider sx={{ marginBottom: '10px' }} />
				<Stack direction='row' justifyContent='space-between'>
					<Button
						variant='outlined'
						onClick={e => deleteGroup(groupName)}>
						מחק קבוצה
					</Button>
					<TextField
						disabled={true}
						variant='outlined'
						value={average}
						label='ממוצע'
					/>
					<TextField
						disabled={true}
						variant='outlined'
						value={maxGrade}
						label='הציון הטוב ביותר'
					/>
					<Button variant='contained' onClick={e => createSheet()}>
						<Typography>הורדת גליון ציונים</Typography>{' '}
						<DownloadIcon />
					</Button>
					<Button variant='contained' onClick={e => close()}>
						סגור
					</Button>
				</Stack>
			</Box>
		</Container>
	);
}

export default GroupEdit;
