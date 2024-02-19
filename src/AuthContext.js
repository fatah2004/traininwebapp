// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, collection, getDoc, getDocs,query, getFirestore, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setUser(authUser);
  
      if (authUser) {
        // Fetch user role from Firestore when the user is logged in
        const usersCollectionRef = collection(getFirestore(), 'users');
        const querySnapshot = await getDocs(query(usersCollectionRef, where('email', '==', authUser.email)));
  
        if (!querySnapshot.empty) {
          // Since email should be unique, we assume there's only one document
          const userDocSnap = querySnapshot.docs[0];
          setUserRole(userDocSnap.data().role);
        }
      } else {
        // Reset user role when the user is logged out
        setUserRole(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  

  const login = async (email, password) => {
    const authInstance = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      const loggedInUser = userCredential.user;
      setUser(loggedInUser);

      // Fetch user role from Firestore when the user is logged in
      const usersCollectionRef = collection(getFirestore(), 'users');
      const query = where('email', '==', loggedInUser.email);
      const userDocRef = doc(usersCollectionRef, loggedInUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUserRole(userDocSnap.data().role);
      }

      return loggedInUser;
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      throw error;
    }
  };

  const logout = async () => {
    const authInstance = getAuth();
    try {
      await signOut(authInstance);
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error.code, error.message);
    }
  };

  const value = {
    user,
    userRole,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
