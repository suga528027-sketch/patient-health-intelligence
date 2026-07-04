import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import ChatPage from './pages/ChatPage';
import TimelinePage from './pages/TimelinePage';
import TrendsPage from './pages/TrendsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/patient/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patient/dashboard" element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/assistant" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          <Route path="/patient/timeline" element={
            <ProtectedRoute>
              <TimelinePage />
            </ProtectedRoute>
          } />
          <Route path="/patient/trends" element={
            <ProtectedRoute>
              <TrendsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
