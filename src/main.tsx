import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './tokens.css';
import './styles.css';
import './playlist.css';
import './prototype.css';
import './mobile-bar.css';
import './write-to-air.css';

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
