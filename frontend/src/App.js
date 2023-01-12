import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import React, { createContext, useState } from 'react';
import { createTheme, makeStyles, recomposeColor } from '@mui/material/styles';
import Exam from './Exam/Exam';
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import LogsGate from './Logs/LogsGate';
import CreateTest from './Dashboard/CreateTest';
import Registry from './Logs/Registry';
import EditTest from './Dashboard/Edit test/EditTest';
import TestCloseScreen from './Exam/TestCloseScreen';
import ExamPage from './Exam/ExamPage';
import HomePage from './Logs/HomePage';
import EditUsers from './Dashboard/EditUsers';
import EditQuestionsBank from './Dashboard/EditQuestionsBank';
import ExamEntry from './Exam/ExamEntry';

export const SnackbarContext = createContext(null);

function App() {
	const userId = sessionStorage.getItem("userId");
	const password = sessionStorage.getItem("password");
	const isValid = userId !== null && password != null;
	const [isSnackOpen, setIsSnackOpen] = useState(false);
	const [SnackMessege, setSnackMessege] = useState("");
	const [snackSeverity,setSnackSeverity] = useState('error')
	const popAlert = (severity, messege) => {
		setSnackSeverity(severity);
		setSnackMessege(messege);
		setIsSnackOpen(true);
	}

	const [isBackdrop, setIsBackdrop] = useState(false);
	const openBackdrop = () => setIsBackdrop(true);
	const closeBackdrop = () => setIsBackdrop(false);


	return (
		<React.Fragment>

			<ThemeProvider theme={theme}>
				<Snackbar open={isSnackOpen} onClose={e => setIsSnackOpen(false)} autoHide={5000}>
					<Alert severity={snackSeverity}>{ SnackMessege}</Alert>
				</Snackbar>
				<Backdrop open={isBackdrop} sx={{zIndex : 100}}>
					<CircularProgress color='secondary'/>
				</Backdrop>
				<SnackbarContext.Provider value={{ popAlert,openBackdrop,closeBackdrop }}>
					
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
						<Route path='/login' element={isValid ? <Navigate to={`/dashboard/${userId}/${password}`} /> : <LogsGate />}></Route>
						<Route path='/dashboard/edit_users/:id/:password/:testId' element={<EditUsers/>}/>
						<Route
							path='/register'
							element={<Registry />}></Route>
							<Route path='/exam/:userId/:testId/:testName' element={<ExamPage />}/>
							<Route path='/exam_entry/:userId/:testId' element={<ExamEntry/>}/>
						<Route path='/exam_test_close_screen' element={<TestCloseScreen />} />
						<Route path='/exam_log' element={<HomePage />} />
						<Route path='/' element={<Navigate to="/exam_log"/>}/>
					</Routes>
					</BrowserRouter>
				</SnackbarContext.Provider>
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
			fontSize: '54pt',
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