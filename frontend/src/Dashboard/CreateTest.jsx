import { Paper, Box } from '@mui/material';
import { display } from '@mui/system';
import React from 'react';

export default function CreateTest() {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				width: '100vw',
			}}>
			<Paper variant='outlined'>hello</Paper>
		</Box>
	);
}
