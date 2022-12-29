import { Paper, Box, Typography, Grid, TextField, Autocomplete, makeStyles, Button, Chip, Snackbar, Alert } from '@mui/material';
import { display } from '@mui/system';
import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {useParams } from 'react-router-dom';
import { paperPageStyle } from '../App';
import ServerAddress from '../assets/ServerAddress';
import useQuery from '../assets/useQuery';

export default function CreateTest() {
	const [testId,setTestId] = useState(useQuery().get("testid"))
	const [testData,setTestData] = useState(null);
	const [title,setTitle] = useState(null);
	const [duration,setDuration] = useState(60);
	const [numOfQuestions,setNumOfQuestions] = useState(20);
	const [instructions,setInstructions] = useState(null);
	const [logo,setLogo] = useState(null);
	const [passingGrade,setPassingGrade] = useState(80);
	const [SnackbarOpen,setSnackbarOpen] = useState(false);
    const [snackbarSeverity,setSnackbarSeverity] = useState('succes');
    const [snackbarMessage,setSnackbarMessage] = useState("");

	const {id,password} = useParams();
	const [admins,setAdmins] = useState([id]);
	const [avilableAdmins,setAvilableAdmins] = useState([id]);
	const filePicker = document.createElement('input')
	filePicker.type='file';
	filePicker.accept='image/*';
	filePicker.onchange = (e) =>{
		console.log(e.target.files[0]);
		if(e.target.files[0]){
			reader.readAsDataURL(e.target.files[0]);
		}
	}

	const reader = new FileReader();
	reader.addEventListener('loadend',() =>
	{
		setLogo(reader.result)
	});
	
	useEffect(_ => {
		fetchAvilableAdmins();
	},[])

	const fetchAvilableAdmins = async() =>
	{
		const res = await axios.get(ServerAddress("user/ids"));
		if(res.status === 200)
		{
			setAvilableAdmins(res.data);
		}
	}

	const handleSubmit = async() =>{
		if(validForm()){
			const res = await axios.post(ServerAddress(`test/create/${id}/${password}`),{
				admin: admins,
				title: title.trim(),
				insturctions: instructions.trim(),
				logo: logo,
				duration: duration,
				passingGrade : passingGrade,
				numOfQuestions: numOfQuestions,
			});
			console.log(res.data);
			if(res.data)
			{
				setSnackbarMessage('המבחן נרשם');
				setSnackbarSeverity('success');
				setSnackbarOpen(true);
				setTimeout(_ => window.location.replace(`/dashboard/edit_questions/${id}/${password}/${res.data}`));
			}
		}else{
			setSnackbarMessage('אחד מהקלטים לא תקין');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	}

	const validForm = () => {
		return !(title === null || title.trim() === "" ||
		 duration === null || duration <= 0 || numOfQuestions === null ||
		  numOfQuestions <= 0 || instructions === null ||
		  instructions.trim() === "" || passingGrade === null ||
		  passingGrade < 0 || passingGrade > 100 ||admins.length >1);
	}


	return (
		<React.Fragment>
			<Snackbar open={SnackbarOpen} onClose={e=>setSnackbarOpen(false)} autoHideDuration={5000}>
				<Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
			</Snackbar>
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				width: '100vw',
			}}>
			<Paper variant='outlined' sx={paperPageStyle}>
				<Typography variant='h4' sx={{marginBottom : '20px'}}>
							הגדרות מבחן
				</Typography>
				<Grid container spacing={1}>
					<Grid item sx={12} sm={6}>
						<TextField type={'text'} label='שם המבחן' value={title} onChange={e => setTitle(e.target.value)}  fullWidth/>
					</Grid>
					<Grid item sx={12} sm={6}>
						<TextField type='number' label='מספר שאלות במבחן' value={numOfQuestions} onChange={e=>setNumOfQuestions(e.target.valueAsNumber)}   fullWidth/>
					</Grid>
					<Grid item sx={12} sm={6}>
						<TextField type='number' label='משך המבחן בדקות' value={duration} onChange={e=>setDuration(e.target.valueAsNumber)}
						 helperText={Math.floor(duration/60) + ":" + (duration%60 < 10 ? "0" + duration%60 : duration%60 )}  fullWidth/>
					</Grid>
					<Grid item sx={12} sm={6}>
						<TextField type='number' label='ציון עובר' value={passingGrade} onChange={e=>setPassingGrade(e.target.valueAsNumber)} helperText='נדרש ציון בין 0-100'  fullWidth/>
					</Grid>
					<Grid item sx={12} sm={2}>
						<Button fullWidth size='large' sx={{height : '100%'}}  variant='outlined' onClick={e => filePicker.click()}>
							{logo ? <img src={logo} width='100' height='100'/> : 'הוספת תמונה'}
						</Button>
					</Grid>
					<Grid item sx={12} sm={10}>
						<TextField type='text' label='הנחיות' value={instructions} onChange={e=>setInstructions(e.target.value)} fullWidth multiline rows={4}/>
					</Grid>
					<Grid item sx={12} sm={12}>
					<Autocomplete
						disablePortal
						onChange={(e,newValue)=> admins.indexOf(newValue) === -1 && newValue !== null ? setAdmins(admins.concat(newValue)) : undefined}
						options={avilableAdmins}
						renderInput={(params) => <TextField {...params} fullWidth label='בעלי הרשאות' />}
						/>
						<Box>
							{
								admins.map((record)=> <Chip label={record} onDelete={e=>setAdmins(admins.filter(item => item!==record))} size='small'/>)
							}
						</Box>
					</Grid>
					<Grid item xs={12} sx={{textAlign:'center'}}>
						<Button variant='contained' onClick={e=> handleSubmit()}>
							הוסף מבחן
						</Button>
					</Grid>
				</Grid>
				

			</Paper>
		</Box>
		</React.Fragment>
	);
}
  
