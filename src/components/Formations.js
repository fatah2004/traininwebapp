// Formations.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../firebase';

const Formations = () => {
  const { auth } = useAuth();
  const [userFormations, setUserFormations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (auth.currentUser) {
        // Fetch current user based on email
        const usersCollection = collection(getFirestore(), 'users');
        const userQuery = query(usersCollection, where('email', '==', auth.currentUser.email));
        try {
          const userSnapshot = await getDocs(userQuery);
          if (!userSnapshot.empty) {
            setCurrentUser(userSnapshot.docs[0].data());
          }
        } catch (error) {
          console.error('Error fetching current user:', error.message);
        }
      }
    };

    fetchCurrentUser();
  }, [auth.currentUser]);

  useEffect(() => {
    const fetchUserFormations = async () => {
      if (currentUser) {
          // Fetch user formations based on the current user's name
        const fullName = currentUser.name + " " + currentUser.lastName;
        const formationsCollection = collection(getFirestore(), 'formations');
        const userFormationsQuery = query(
          formationsCollection,
          where('trainers', 'array-contains', fullName) // Update to use name instead of email
        );
        console.log(currentUser.name,currentUser.lastName);
        try {
          const userFormationsSnapshot = await getDocs(userFormationsQuery);
          const userFormationsData = userFormationsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserFormations(userFormationsData);
        } catch (error) {
          console.error('Error fetching user formations:', error.message);
        }
      }
    };
  
    fetchUserFormations();
  }, [currentUser]);

 

  return (
    <div className='container'>
      <h2>User Formations</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            <th scope="col">Subject</th>
            <th scope="col">Trainers</th>
          </tr>
        </thead>
        <tbody>
          {userFormations.map((formation) => (
            <tr key={formation.id}>
              <td>{formation.startDate}</td>
              <td>{formation.endDate}</td>
              <td>{formation.subject}</td>
              <td>
                <ul>
                  {formation.trainers.map((trainer) => (
                    <li key={trainer}>{trainer}</li>
                  ))}
                </ul>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Formations;
