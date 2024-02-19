// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../firebase'; // Import the Firebase configuration
import { createUserWithEmailAndPassword } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Attempt a regular login
      await login(email, password);
      navigate('/home'); // Redirect to home page on successful login
    } catch (loginError) {
      // If regular login fails, check if the user exists in the users collection
      const userExists = await checkIfUserExists(email, password);

      if (userExists) {
        // If the user exists, create an authentication account and then login
        await createAuthAccountAndLogin(email, password);
        navigate('/home'); // Redirect to home page on successful login
      } else {
        // If the user doesn't exist, handle the error
        setError(`Login error: ${loginError.code} - ${loginError.message}`);
      }
    }
  };

  const checkIfUserExists = async (email, password) => {
    try {
      const usersCollection = collection(getFirestore(), 'users');
      const userQuery = query(usersCollection, where('email', '==', email), where('password', '==', password));
      const userSnapshot = await getDocs(userQuery);
  
      // Return true if there is at least one matching user
      return !userSnapshot.empty;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  };
  const createAuthAccountAndLogin = async (email, password) => {
    try {
      // Create Firebase authentication account
      await createUserWithEmailAndPassword(auth, email, password);

      // Add the user to the Firestore collection
      
      // Login after creating the account
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  return (
    // ... rest of your component remains the same
    <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h1 className="card-title text-center mb-4">Login</h1>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;

  