import "./Polyfill.js"
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.min.css"
import 'react-virtualized/styles.css';
import App from './App.jsx';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<App />);
