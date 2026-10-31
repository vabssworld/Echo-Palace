// Root Entry Point for Reverie
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/game.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
