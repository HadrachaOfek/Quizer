import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
	Alert,
	Button,
	Paper,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material';
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

	const checkIfExist = async () => {
		const res = await axios.get(ServerAddress(`user/exist/${userId}`));
		console.log(res.data);
		if (res.data) {
			setState(true);
		} else {
			window.location.replace('/register');
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
		<Box
			sx={{
				width: '100vw',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
			<Snackbar
				open={errorSnackBar}
				autoHideDuration={3000}
				onClose={_ => setErrorSnackBar(false)}>
				<Alert variant='filled' severity='error'>
					סיסמה לא מתאימה לשם המשתמש
				</Alert>
			</Snackbar>
			<Paper variant='outlined'>
				<Typography variant='h2' sx={{ paddingRight: '20%' }}>
					ברוכים הבאים
				</Typography>
				<Typography variant='h1'>אתר המבחנים</Typography>
				{!state ? (
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
				) : (
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
				)}
			</Paper>
		</Box>
	);
}

const inputBoxStyle = {
	width: '300px',
	height: '300px',
	display: 'flex',
	flexDirection: 'column',
	gap: '10px',
	margin: '10px auto',
	justifyContent: 'center',
	alignItems: 'center',
};
