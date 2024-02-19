// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Feedback from './components/InstFormations';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Navbar from './components/NavBar';
import ManageUsers from './components/ManageUsers';
import ManageFormations from './components/ManageFormations';
import ManageFeedback from './components/ManageFeedback';
import Formations from './components/Formations';
import InstFormations from './components/InstFormations' 
import Trainers from './components/Trainers';
import { AuthProvider, useAuth } from './AuthContext';


const PrivateRoute = ({ element }) => {
    const { user } = useAuth();
    return user ? element : <Navigate to="/login" />;
  };
  
  const AdminRoute = ({ element }) => {
    const { user, userRole } = useAuth();
    return user && userRole === 'admin' ? element : <Navigate to="/home" />;
  };
  
  const InstitutionRoute = ({ element }) => {
    const { user, userRole } = useAuth();
    return user && userRole === 'institution' ? element : <Navigate to="/home" />;
  };
  
  const TrainerRoute = ({ element }) => {
    const { user, userRole } = useAuth();
    return user && userRole === 'trainer' ? element : <Navigate to="/home" />;
  };
const App = () => {
  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<PrivateRoute element={<HomePage />} />} />
        {/* Admin routes */}
        <Route path="/manage-users" element={<AdminRoute element={<ManageUsers />} />} />
        <Route path="/manage-formations" element={<AdminRoute element={<ManageFormations />} />} />
        <Route path="/manage-feedback" element={<AdminRoute element={<ManageFeedback />} />} />
        {/* Institution routes */}
        <Route path="/institution-formations" element={<InstitutionRoute element={<InstFormations />} />} />
        <Route path="/trainers" element={<InstitutionRoute element={<Trainers />} />} />
        {/* Trainer route */}
        <Route path="/formations" element={<TrainerRoute element={<Formations />} />} />
        <Route path="/feedback" element={<TrainerRoute element={<Feedback />} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </AuthProvider>
  );
};

export default App;
