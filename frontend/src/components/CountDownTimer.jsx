import { Box, CircularProgress, Typography } from '@mui/material';
import { width } from '@mui/system';
import React, { useState } from 'react';
import { useEffect } from 'react';

function CountDownTimer({ duration, endTime, onEnd, run }) {
	const [currentTime, setCurrentTime] = useState(Date.now());
	useEffect(
		_ => {
			if (endTime - currentTime < 1000) {
				onEnd();
			} else {
				setTimeout(
					_ => (run ? setCurrentTime(Date.now()) : undefined),
					1000
				);
			}
		},
		[currentTime, run]
	);

	return (
		<Box
			sx={{
				width: { lg: '80%', md: '85%', sm: '90%', xs: '100%' },
				margin: '10px auto',
				position: 'relative',
			}}>
			<CircularProgress
				variant='determinate'
				value={
					((endTime - currentTime) / (duration * 60 * 1000)) * 100
				}
				size='100%'
			/>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%,-50%)',
				}}>
				<Typography variant='h2' align='center'>
					{endTime - currentTime < 60 * 1000
						? Math.floor(((endTime - currentTime) % 60000) / 1000)
						: Math.floor((endTime - currentTime) / (60 * 1000))}
				</Typography>
				<Typography variant='h3' align='center'>
					{endTime - currentTime < 60 * 1000 ? 'שניות' : 'דקות'}
				</Typography>
			</Box>
		</Box>
	);
}

export default CountDownTimer;
