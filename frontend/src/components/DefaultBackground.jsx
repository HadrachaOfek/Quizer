import { Box } from '@mui/material';
import React from 'react';

function DefaultBackground({ children }) {
	return (
		<Box
			id='defaultbackground'
			sx={{ width: '100vw', height: '100vh', overflowY: 'auto' }}>
			{children}
		</Box>
	);
}

export default DefaultBackground;
