import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


/*
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
); */

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<StrictMode>
    <App />
  </StrictMode>
  );

