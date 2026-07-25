import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TaxEstimator from './pages/TaxEstimator';
import Chatbot from './pages/Chatbot';
import ReportDownload from './pages/ReportDownload';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/tax" element={<PrivateRoute><TaxEstimator /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
        <Route path="/report" element={<PrivateRoute><ReportDownload /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}