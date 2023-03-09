import {
	Button,
	Fab,
	Grid,
	Skeleton,
	Tooltip,
	Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import logo from '../assets/QuizAirPurpleLogo.png';
import DefaultBackground from '../components/DefaultBackground';
import GridInContainer from '../components/GridInContainer';
import TestSummeryCard from '../components/TestSummeryCard';
import LogoutIcon from '@mui/icons-material/Logout';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useParams, useSearchParams } from 'react-router-dom';
import ServerAddress from '../assets/ServerAddress';
import axios from 'axios';
import { AuthenticationContext, SnackbarContext } from '../App';

function Dashboard() {
	const { password, userId } = useParams();
	const [helloMsg, setHelloMsg] = useState('ברוכים הבאים');
	const [testList, setTestList] = useState([]);
	const { closeModal, openBackdrop, closeBackdrop } =
		useContext(SnackbarContext);

	const logout = () => {
		window.location.href = '/accounts/gate';
	};
	useEffect(() => {
		getData();
		getHelloMsg();
	}, []);
	const getHelloMsg = async () => {
		const res = await axios.get(
			ServerAddress(`user/get_hello/${userId}/${password}`)
		);
		if (res.data[0]) {
			setHelloMsg(
				'שלום ' + res.data[1].firstName + ' ' + res.data[1].lastName
			);
		}
	};

	const getData = async () => {
		openBackdrop();
		const res = await axios.get(
			ServerAddress(`test/get_all/${userId}/${password}`)
		);
		if (res.data[0]) {
			setTestList(res.data[1]);
			closeBackdrop();
		}
	};

	const deleteTest = async id => {
		closeModal();
		console.log(id);
		const res = await axios.delete(
			ServerAddress(`test/delete_test/${userId}/${password}/${id}`)
		);
		if (res.data[0]) {
			setTestList(testList.filter(test => test._id !== id));
		}
		console.log(res.data);
	};

	const testActivation = async (id, isActive) => {
		var res;
		if (isActive) {
			res = await axios.patch(
				ServerAddress(
					`test/deactivate_test/${userId}/${password}/${id}`
				)
			);
		} else {
			res = await axios.patch(
				ServerAddress(`test/activate_test/${userId}/${password}/${id}`)
			);
		}
		console.log(res.data);
		getData();
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
							onClick={e => logout()}>
							{helloMsg}
						</Fab>
					</Tooltip>
				</Stack>
				<Typography overflow='hidden' variant='h1'>
					מערכת ניהול מבחנים
				</Typography>
				<GridInContainer sx={{ marginTop: '3vh' }}>
					{testList &&
						testList.map(test => (
							<TestSummeryCard
								data={test}
								key={test._id}
								deleteTest={deleteTest}
								testActivation={testActivation}
							/>
						))}
				</GridInContainer>
			</Stack>
			<Button
				sx={{ position: 'absolute', left: '2%', bottom: '2%' }}
				color='inherit'
				onClick={_ =>
					(window.location.href = `/accounts/edit_test/${userId}/${password}`)
				}>
				<Stack alignItems='center'>
					<NoteAddIcon />
					<Typography variant='caption'>מבחן חדש</Typography>
				</Stack>
			</Button>
		</DefaultBackground>
	);
}

export default Dashboard;
