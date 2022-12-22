import React, { useState } from 'react';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import {
	Box,
	Button,
	Grid,
	InputAdornment,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import { AccountCircle, ArrowBack } from '@mui/icons-material';
function EntryGate() {
	const [stage, setStage] = useState(0);
	const [userId, setUserId] = useState('');
	const stageMapping = () => {
		switch (stage) {
			case 0:
				return (
					<UserIdInput
						setStage={setStage}
						setUserId={setUserId}
						userId={userId}
					/>
				);
				break;
			case 1:
				return (
					<RegiserInput
						setStage={setStage}
						stage={stage}
						userId={userId}
					/>
				);
			case 2:
				return (
					<PasswordInput
						setStage={setStage}
						setUserId={setUserId}
						userId={userId}
					/>
				);
				break;
			default:
				break;
		}
	};
	return (
		<Paper
			component='div'
			sx={{
				width: '80vw',
				height: '80vh',
				minHeight: '500px',
				minWidth: '750px',
				margin: '10vh 10vw',
				overflow: 'hidden',
			}}>
			<Typography variant='h2' paddingRight={'10vw'} textAlign='right'>
				ברוכים הבאים
			</Typography>
			<Typography variant='h1' textAlign='center'>
				אתר המבחנים
			</Typography>
			{stageMapping()}
		</Paper>
	);
}

const UserIdInput = ({ setStage, setUserId, userId }) => {
	return (
		<Box
			sx={{
				rowGap: 2,
				display: 'flex',
				flexDirection: 'column',
				width: '300px',
				margin: '100px auto 0px',
			}}>
			<Typography variant='h4' textAlign='right'>
				התחברות למערכת
			</Typography>
			<TextField
				variant='outlined'
				label='מספר מזהה'
				onChange={e => setUserId(e.target.value)}
			/>
			<Button variant='contained' onClick={e => setStage(1)}>
				המשך
			</Button>
		</Box>
	);
};

const RegiserInput = ({ setStage, userId }) => {
	const [password, setPassword] = useState('');
	const [lastName, setLastName] = useState('');
	const [firstName, setFirstName] = useState('');
	return (
		<Grid
			container
			spacing={1}
			sx={{
				width: '500px',
				margin: '100px auto 0px',
				direction: 'rtl',
			}}>
			<Grid item xs={12}>
				<Typography variant='h4' textAlign='right'>
					הרשמה למערכת
				</Typography>
			</Grid>
			<Grid item xs={6}>
				<TextField
					variant='outlined'
					label='מספר מזהה'
					value={userId}
					disabled
					fullWidth
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField
					variant='outlined'
					label='סיסמה'
					value={password}
					onChange={e => setPassword(e.target.value)}
					type='password'
					fullWidth
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField
					variant='outlined'
					label='שם פרטי'
					value={firstName}
					onChange={e => setFirstName(e.target.value)}
					fullWidth
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField
					variant='outlined'
					label='שם משפחה'
					value={lastName}
					onChange={e => setLastName(e.target.value)}
					fullWidth
				/>
			</Grid>
			<Grid item xs={6}>
				<Button
					variant='outlined'
					color='secondary'
					onClick={e => setStage(0)}>
					חזור
				</Button>
			</Grid>
			<Grid item xs={6} textAlign='left'>
				<Button variant='contained' onClick={e => setStage(2)}>
					המשך
				</Button>
			</Grid>
		</Grid>
	);
};

const PasswordInput = ({ setStage, userId }) => {
	const [password, setPassword] = useState('');
	return (
		<Box
			sx={{
				rowGap: 2,
				display: 'flex',
				flexDirection: 'column',
				width: '300px',
				margin: '100px auto 0px',
			}}>
			<Typography variant='h4' textAlign='right'>
				היי ישראל ישראלי
			</Typography>
			<TextField
				variant='outlined'
				label='סיסמה'
				onChange={e => setPassword(e.target.value)}
				type='password'
			/>
			<Button variant='contained' onClick={e => setStage(3)}>
				המשך
			</Button>
		</Box>
	);
};

export default EntryGate;
