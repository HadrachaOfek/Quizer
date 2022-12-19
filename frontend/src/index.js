import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import EnterPage from './Test/EnterPage/EnterPage';
import RunTest from './Test/RunTest/RunTest';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter>
      <Routes>

        <Route path="/" component={EnterPage} exact />
        <Route path="*" component={App} exact />
        <Route path="/run" component={RunTest} exact />


      </Routes>
    </BrowserRouter> */}

    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
