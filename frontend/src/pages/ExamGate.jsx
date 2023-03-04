import { Button, Paper, TextField, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/QuizAirBlueLogo.png';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useState } from 'react';
import BlueBackground from '../components/BlueBackground';
import CenterWhiteWindow from '../components/CenterWhiteWindow';
import { useEffect } from 'react';
import axios from 'axios';
import ServerAddress from '../assets/ServerAddress';
import { useContext } from 'react';
import { SnackbarContext } from '../App';

function ExamGate() {
	const [examineeId, setExamineeId] = useState('');
	const [testPassword, setTestPassword] = useState('');
	const [isValid, setIsValid] = useState(false);
	const { popAlert } = useContext(SnackbarContext);

	useEffect(
		_ => {
			setIsValid(
				examineeId.match('\\d{7,9}') &&
					testPassword.match('[A-Z\\d]{8}')
			);
		},
		[examineeId, testPassword]
	);

	const handleSubmit = async () => {
		const res = await axios.get(
			ServerAddress(
				`users_test/is_not_tested/${testPassword}/${examineeId}`
			)
		);
		console.log(res.data);
		if (res.data[0]) {
			if (res.data[1]) {
				window.location.href = `/exam/instructions/${examineeId}/${res.data[2]}`;
			} else {
				popAlert('error', 'נכנסת למבחן בעבר');
			}
		} else {
			popAlert('info', res.data[1]);
		}
	};
	return (
		<BlueBackground>
			<CenterWhiteWindow>
				<Stack justifyContent='center' alignItems='center'>
					<img src={logo} width='40%' />
					<Stack width='40%' gap='10px'>
						<Typography variant='caption'>כניסה למבחן</Typography>
						<TextField
							label='מספר מזהה'
							error={
								(examineeId !== '') &
								!examineeId.match('\\d{7,9}')
							}
							helperText='מ.א לחיילים ת.ז לאזרחים'
							onChange={e => setExamineeId(e.target.value)}
						/>
						<TextField
							label='קוד מבחן'
							helperText=' '
							error={
								(testPassword !== '') &
								!testPassword.match('[\\dA-Z]{8}')
							}
							onChange={e => setTestPassword(e.target.value)}
						/>
						<Button
							disabled={!isValid}
							variant='contained'
							size='large'
							onClick={e => handleSubmit()}>
							התחבר
						</Button>
					</Stack>
					<Button
						color='inherit'
						sx={{
							position: 'absolute',
							bottom: '10px',
							left: '20px',
						}}
						onClick={e =>
							(window.location.href = '/accounts/gate')
						}>
						<Stack alignItems='center'>
							<ManageAccountsIcon fontSize='large' />
							<Typography variant='caption'>
								כניסת מנהל
							</Typography>
						</Stack>
					</Button>
				</Stack>
			</CenterWhiteWindow>
		</BlueBackground>
	);
}

export default ExamGate;
