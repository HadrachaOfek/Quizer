import { deepmerge } from '@mui/utils';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import React, { createContext, useState } from 'react';
import { createTheme } from '@mui/material/styles';
import {
	Alert,
	Backdrop,
	Modal,
	responsiveFontSizes,
	Snackbar,
} from '@mui/material';

import { ThemeProvider } from '@emotion/react';
import '@fontsource/assistant';
import BlueBackground from './components/BlueBackground';
import TestClose from './pages/TestClose';
import ExamGate from './pages/ExamGate';
import AccountGate from './pages/AccountGate';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import EditTest from './pages/EditTest';
import purpleLoadingSymbol from './assets/purple_gif.gif';
import blueLoadingSymbol from './assets/gif_transperentBg.gif';
import InstructionsPage from './pages/InstructionsPage';
import ExamPage from './pages/ExamPage';
import InspectTestPage from './pages/InspectTestPage';
export const SnackbarContext = createContext(null);

function App() {
	const [isSnackOpen, setIsSnackOpen] = useState(false);
	const [backdropSymbol, setBackdropSymbol] = useState(purpleLoadingSymbol);
	const [SnackMessege, setSnackMessege] = useState('');
	const [snackSeverity, setSnackSeverity] = useState('error');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalChild, setModalChild] = useState('');
	const popAlert = (severity, messege) => {
		setSnackSeverity(severity);
		setSnackMessege(messege);
		setIsSnackOpen(true);
	};

	const popModal = child => {
		setModalChild(child);
		setIsModalOpen(true);
	};

	const [isBackdrop, setIsBackdrop] = useState(false);
	const openBackdrop = (variant = 'purple') => {
		setBackdropSymbol(
			variant === 'purple' ? purpleLoadingSymbol : blueLoadingSymbol
		);
		setIsBackdrop(true);
	};
	const closeBackdrop = () => setIsBackdrop(false);
	const closeModal = () => setIsModalOpen(false);

	return (
		<React.Fragment>
			<ThemeProvider theme={theme}>
				<Snackbar
					open={isSnackOpen}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					onClose={e => setIsSnackOpen(false)}
					autoHide={5000}>
					<Alert severity={snackSeverity}>{SnackMessege}</Alert>
				</Snackbar>
				<Backdrop
					open={isBackdrop}
					sx={{ zIndex: 100, background: 'rgba(255,255,255,0.4)' }}>
					<img src={backdropSymbol} width='30%' />
				</Backdrop>
				<SnackbarContext.Provider
					value={{
						popAlert,
						openBackdrop,
						closeBackdrop,
						popModal,
						closeModal,
					}}>
					<BrowserRouter>
						<ThemeProvider theme={BlueTheme}>
							<Routes>
								<Route
									path='/'
									element={<Navigate to='/exam/gate' />}
								/>
								<Route
									path='/exam/gate'
									element={<ExamGate />}
								/>
								<Route
									path='/exam/instructions/:userId/:testId'
									element={<InstructionsPage />}
								/>
								<Route
									path='/exam/exam_page/:userId/:testId'
									element={<ExamPage />}
								/>
								<Route
									path='/exam/test_close'
									element={
										<BlueBackground>
											<TestClose />
										</BlueBackground>
									}
								/>
							</Routes>
						</ThemeProvider>
						<ThemeProvider theme={PurpleTheme}>
							<Modal
								open={isModalOpen}
								onClose={e => setIsModalOpen(false)}>
								<React.Fragment>{modalChild}</React.Fragment>
							</Modal>
							<Routes>
								<Route
									path='/accounts/gate'
									element={<AccountGate />}
								/>
								<Route
									path='/accounts/registration'
									element={<Registration />}
								/>
								<Route
									path='/accounts/dashboard/:userId/:password'
									element={<Dashboard />}
								/>
								<Route
									path='/accounts/edit_test/:userId/:password'
									element={<EditTest />}
								/>
								<Route
									path='/accounts/inspect/:userId/:password/:testId'
									element={<InspectTestPage />}
								/>
							</Routes>
						</ThemeProvider>
					</BrowserRouter>
				</SnackbarContext.Provider>
			</ThemeProvider>
		</React.Fragment>
	);
}

let theme = createTheme({
	direction: 'rtl',
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
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: '15px',
				},
			},
		},
		MuiGrid: {
			styleOverrides: {
				container: {
					justifyContent: 'center',
				},
			},
		},
		MuiTableCell: {
			defaultProps: {},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					textAlign: 'center',
				},
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					textAlign: 'right',
					fontSize: '10pt',
				},
			},
		},
		MuiButton: {},
	},
	typography: {
		fontFamily: 'assistant',
		h1: {
			textAlign: 'center',
			fontSize: '48pt',
		},
		h2: {
			textAlign: 'right',
			fontSize: '36pt',
			fontWeight: 'bold',
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
		h6: {
			fontSize: '20pt',
			fontWeight: 'bold',
			textAlign: 'center',
		},
		caption: {
			fontSize: '12pt',
			width: '100%',
			textAlign: 'center',
		},
	},
});

const PurpleTheme = responsiveFontSizes(
	createTheme(
		deepmerge(theme, {
			palette: {
				primary: {
					main: '#AC73E1',
					dark: '#7b1fa2',
					light: '#ba68c8',
				},
			},
		})
	)
);

const BlueTheme = responsiveFontSizes(
	createTheme(
		deepmerge(theme, {
			palette: {
				primary: {
					main: '#498ce6',
				},
			},
		})
	)
);

const paperPageStyle = {
	width: '90vw',
	height: '90vh',
	borderRadius: '25px',
	padding: '25px',
	margin: '10px auto',
};

export { paperPageStyle };

export default App;
