import logo from './logo.svg';
import './App.css';
import EntryGate from './EntryGate';
import React from 'react';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@mui/styles';

function App() {
	return (
		<div>
			<StylesProvider jss={jss}>
				<ThemeProvider theme={theme}>
					<BrowserRouter>
						<Routes>
							<Route path='/' element={<EntryGate />} />
							<Route
								path='/test'
								element={<TextField variant='filled' />}
							/>
						</Routes>
					</BrowserRouter>
				</ThemeProvider>
			</StylesProvider>
		</div>
	);
}

const jss = create({
	plugins: [...jssPreset().plugins, rtl()],
});

const theme = createTheme({
	palette: {
		primary: {
			main: '#5a96d6',
		},
		secondary: {
			main: '#9246D9',
		},
	},
	typography: {
		h4: {
			fontWeight: 'bolder',
			fontSize: '14pt',
			color: '#9246D9',
		},
	},
	direction: 'rtl',
	components: {
		MuiTextField: {
			defaultProps: {
				size: 'small',
				dir: 'rtl',
			},
		},
		MuiPaper: {
			defaultProps: {
				elevation: 7,
			},
			styleOverrides: {
				root: {
					borderRadius: '25px',
					padding: '25px',
					boxSizing: 'border-box',
				},
			},
		},
	},
});

export default App;
