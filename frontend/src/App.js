import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import React from 'react';
import { createTheme } from '@mui/material/styles';
import Exam from './Exam/Exam';
import { colors } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import LogsGate from './Logs/LogsGate';
import CreateTest from './Dashboard/CreateTest';

function App() {
	return (
		<React.Fragment>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<Routes>
						<Route
							path='/dashboard/:id/:password'
							element={<Dashboard />}></Route>
					</Routes>
					<Routes>
						<Route
							path='/dashboard/create_test/:id/:password'
							element={<CreateTest />}></Route>
					</Routes>
					<Routes>
						<Route path='/login' element={<LogsGate />}></Route>
					</Routes>
					<Routes>
						<Route
							path='/register'
							element={<h1>hello</h1>}></Route>
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</React.Fragment>
	);
}

const theme = createTheme({
	direction: 'rtl',
	palette: {
		primary: {
			main: '#E8F3F9',
		},
		secondary: {
			main: '#F4A6CD',
		},
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					width: '80vw',
					height: '80vh',
					borderRadius: '25px',
					padding: '25px',
					boxSizing: 'border-box',
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					height: 'fit-content',
					width: 'fit-content',
				},
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					textAlign: 'center',
				},
			},
		},
	},
	typography: {
		h1: {
			textAlign: 'center',
			fontSize: '72pt',
		},
		h2: {
			textAlign: 'right',
			fontSize: '48pt',
		},
		h4: {
			textAlign: 'center',
			fontSize: '12pt',
			fontWeight: 'bolder',
		},
		h3: {
			fontSize: '16pt',
			fontWeight: 'bold',
			textAlign: 'right',
		},
		caption: {
			fontSize: '12pt',
			width: '100%',
		},
	},
});

export default App;
