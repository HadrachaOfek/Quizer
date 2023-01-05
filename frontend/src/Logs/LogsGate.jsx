import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
	Alert,
	Button,
	Link,
	Modal,
	Paper,
	Slide,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material';
import { paperPageStyle } from '../App';
import { Box } from '@mui/system';
import axios from 'axios';
import { SHA256 } from 'crypto-js';
import React from 'react';
import { useState } from 'react';
import ServerAddress from '../assets/ServerAddress';

export default function LogsGate() {
	const [userId, setUserId] = useState('');
	const [state, setState] = useState(false);
	const [password, setPassword] = useState('');
	const [errorSnackBar, setErrorSnackBar] = useState(false);
	const [infoSnackbar, setInfoSnackbar] = useState(false);

	document.title = "כניסה"

	const checkIfExist = async () => {
		const res = await axios.get(ServerAddress(`user/exist/${userId}`));
		console.log(res.data);
		if (res.data) {
			setState(true);
		} else {
			setInfoSnackbar(true);
		}
	};

	const checkAndRedirect = async () => {
		const res = await axios.get(
			ServerAddress(`user/exist/${userId}/${password}`)
		);
		console.log(res.data);
		if (res.data) {
			window.location.replace(`/dashboard/${userId}/${password}`);
		} else {
			setErrorSnackBar(true);
		}
	};
	return (
		<React.Fragment>
		<Snackbar
				open={errorSnackBar}
				autoHideDuration={3000}
				onClose={_ => setErrorSnackBar(false)}>
				<Alert variant='filled' severity='error'>
					סיסמה לא מתאימה לשם המשתמש
				</Alert>
			</Snackbar>
			<Snackbar
				open={infoSnackbar}
				autoHideDuration={3000}
				onClose={_ => setInfoSnackbar(false)}>
				<Alert variant='filled' severity='info'>
					מספר מזהה לא רשום במערכת, 
					<Button color='secondary' onClick={e=> window.location.replace('/register?userid=' + userId)}>
						למעבר להרשמה
					</Button>
				</Alert>
			</Snackbar>
			<Box sx={{display:'flex',justifyContent:'center',alignContent:'center',width:'100vw',height:'100vh'}}>
				{!state ? (
					<Paper variant='outlined' sx={inputPaperStyle} >
					<Box sx={inputBoxStyle}>
						<TextField
							type='number'
							label='מספר מזהה'
							fullWidth
							color='secondary'
							helperText={
								userId.length === 9 || userId.length === 7
									? ''
									: 'יש להזין מספר אישי או תעודת זהות'
							}
							onChange={e => setUserId(e.target.value)}
						/>
						<Button
							variant='contained'
							fullWidth
							color='secondary'
							onClick={e => checkIfExist()}
							size='large'>
							המשך
							<ArrowBackIosIcon color='primary' />
						</Button>
						</Box>
						</Paper>
				) : (
						<Slide in={state} direction='up'>
							<Paper variant='outlined' sx={inputPaperStyle} >
					<Box sx={inputBoxStyle}>
						<TextField
							type='number'
							label='מספר מזהה'
							fullWidth
							disabled
							value={userId}
							color='secondary'
						/>
						<TextField
							type='password'
							onChange={e =>
								setPassword(SHA256(e.target.value).toString())
							}
							label='סיסמה'
							fullWidth
						/>
						<Button
							variant='contained'
							fullWidth
							color='secondary'
							onClick={e => checkAndRedirect()}
							size='large'>
							התחבר
							<ArrowBackIosIcon color='primary' />
						</Button>
							</Box>
							</Paper>
							</Slide>
				)}
				</Box>
			</React.Fragment>
	);
}

const inputBoxStyle = {
	width: '300px',
	height: 'fit-content',
	display: 'flex',
	flexDirection: 'column',
	gap: '10px',
	margin: '10px auto',
	justifyContent: 'center',
	alignItems: 'center',
};

const inputPaperStyle = {
	display: 'flex',
	width: 'fit-content',
	padding: '15px',
	margin: 'auto'
}
