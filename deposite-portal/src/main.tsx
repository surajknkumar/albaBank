import React from 'react';
import ReactDOM from 'react-dom/client';
import 'src/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'regenerator-runtime';
import { ReactAAD } from './reactAAD';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactAAD />
  </React.StrictMode>
);
