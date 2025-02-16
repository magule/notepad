import React from 'react';
import './App.css';
import './fonts.css';
import LegalPad from './components/LegalPad';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div className="App">
      <LegalPad />
      <Analytics />
    </div>
  );
}

export default App;
