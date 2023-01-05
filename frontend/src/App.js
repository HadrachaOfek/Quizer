import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import React from 'react';
import { createTheme, makeStyles } from '@mui/material/styles';
import Exam from './Exam/Exam';
import { colors } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import LogsGate from './Logs/LogsGate';
import CreateTest from './Dashboard/CreateTest';
import Registry from './Logs/Registry';
import EditTest from './Dashboard/EditTest';
import TestCloseScreen from './Exam/TestCloseScreen';
import ExamPage from './Exam/ExamPage';


function App() {
	
	return (
		<React.Fragment>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<Routes>
						<Route
							path='/dashboard/:id/:password'
							element={<Dashboard />}></Route>
						<Route
							path='/dashboard/create_test/:id/:password'
							element={<CreateTest />}></Route>
						<Route
							path='/dashboard/edit_questions/:id/:password/:testid'
							element={<EditTest/>}></Route>
						<Route path='/login' element={<LogsGate />}></Route>
						<Route
							path='/register'
							element={<Registry />}></Route>
						<Route path='/exam/:userId/:testId' element={<ExamPage />}>
							
						</Route>
						<Route path='/exam_test_close_screen' element={<TestCloseScreen />} />
						<Route path='/exam_entry' element={<TestCloseScreen/>}/>
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
			main: '#2b7dab',
		},
		secondary: {
			main: '#F4A6CD',
		},
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
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
    MuiGrid : {
      styleOverrides:
      {
        container : {
          justifyContent : 'center',
        }
      },
    },
    MuiTableCell : {
      defaultProps : 
      {
      }
    }
		,
		MuiTableCell: {
			styleOverrides: {
				root: {
					textAlign : 'center',
				}
			}
		
	},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					textAlign: 'right',
          fontSize : '10pt'
				},
			},
		},
    MuiButton : {
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

const paperPageStyle = {
    width: '90vw',
    height: '90vh',
    borderRadius: '25px',
	padding: '25px',
	margin : '10px auto',
};

export {paperPageStyle}


export default App;
