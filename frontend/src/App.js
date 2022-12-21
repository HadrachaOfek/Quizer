import logo from './logo.svg';
import './App.css';
import CreateTestPage from './CreateTestPage';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/system';
import { red } from '@mui/material/colors';

function App() {
	return (
		<div className='App'>
			<CreateTestPage />
		</div>
	);
}

export default App;
