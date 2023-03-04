import { Button, Link, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import logo from '../assets/QuizAirPurpleLogo.png';
import CenterWhiteWindow from '../components/CenterWhiteWindow';
import PurpleBackground from '../components/PurpleBackground';
import NoteIcon from '@mui/icons-material/Note';
import axios from 'axios';
import ServerAddress from '../assets/ServerAddress';
import { SHA256 } from 'crypto-js';
import { SnackbarContext } from '../App';

function AccountGate() {
	const [userId, setUserId] = useState('');
	const [userPassword, setUserPassword] = useState('');
	const [isValid, setIsValid] = useState(false);
	const { popAlert } = useContext(SnackbarContext);

	const handleSubmit = async () => {
		const res = await axios.get(
			ServerAddress(
				`user/connect/${userId}/${SHA256(userPassword).toString()}`
			)
		);
		if (res.data[0]) {
			sessionStorage.setItem('connections', userId + ' ' + userPassword);
			window.location.href = `/accounts/dashboard/${userId}/${SHA256(
				userPassword
			).toString()}`;
		} else {
			popAlert('error', res.data[1]);
		}
	};

	useEffect(() => {
		setIsValid(
			userId.trim() !== '' &&
				userId.match('\\d{7,9}') !== null &&
				userPassword.trim() !== '' &&
				userPassword.match('[\\dA-Za-z]{8}') !== null
		);
	}, [userId, userPassword]);
	return (
		<PurpleBackground>
			<CenterWhiteWindow>
				<Stack justifyContent='center' alignItems='center'>
					<img src={logo} width='40%' />
					<Stack width='40%' gap='10px'>
						<Typography variant='h6'>התחברות</Typography>
						<TextField
							label='מספר מזהה'
							error={userId !== '' && !userId.match('\\d{7,9}')}
							helperText='מ.א לחיילים ת.ז לאזרחים'
							onChange={e => setUserId(e.target.value)}
						/>
						<TextField
							label='סיסמה'
							helperText=' '
							type='password'
							error={
								userPassword !== '' &&
								!userPassword.match('[\\dA-Za-z]{8}')
							}
							onChange={e => setUserPassword(e.target.value)}
						/>
						<Button
							variant='contained'
							size='large'
							onClick={_ => handleSubmit()}
							disabled={!isValid}>
							התחבר
						</Button>
						<Typography variant='body1'>
							עוד אין לכם חשבון?{' '}
							<Link href='/accounts/registration'>להרשמה</Link>
						</Typography>
					</Stack>
					<Button
						color='inherit'
						sx={{
							position: 'absolute',
							bottom: '10px',
							left: '20px',
						}}
						onClick={e => (window.location.href = '/exam/gate')}>
						<Stack alignItems='center'>
							<NoteIcon fontSize='large' />
							<Typography variant='caption'>
								כניסת נבחן
							</Typography>
						</Stack>
					</Button>
				</Stack>
			</CenterWhiteWindow>
		</PurpleBackground>
	);
}

export default AccountGate;
