import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import TaxAnalysis from './pages/TaxAnalysis.jsx';
import ITRFiling from './pages/ITRFiling.jsx';
import ITRDraft from './pages/ITRDraft.jsx';
import ProfileSettings from './pages/ProfileSettings.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<App />} />
        <Route path="/tax-analysis" element={<TaxAnalysis />} />
        <Route path="/itr" element={<ITRFiling />} />
        <Route path="/itr/draft" element={<ITRDraft />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/settings" element={<ProfileSettings />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
