import './App.css';
import EnterPage from './Test/EnterPage/EnterPage';
import RunTest from './Test/RunTest/RunTest';

import { Route, Routes, Link, Router } from 'react-router-dom';


function App() {
  return (
    <div className="App">

      <header className="App-header">

          <Routes>
              <Route path="/run" exact element={<RunTest test={'מבחן בהלבנות'} />} />
              <Route path="*" exact element={<EnterPage />} />
              <Route path="/" exact element={<EnterPage />} />
          </Routes>
    




      </header>
    </div>
  );
}

export default App;
