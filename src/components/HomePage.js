// HomePage.js
import React from 'react';
import { useAuth } from '../AuthContext';

const HomePage = () => {
  const { user, userRole } = useAuth();

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">Welcome to the Home Page</h1>
      <div className="card mx-auto" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <p className="lead">Email: {user ? user.email : 'N/A'}</p>
          <p className="lead">Role: {userRole || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
