// InstFormations.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../firebase';

const Trainers = () => {
  const { auth } = useAuth();
  const [trainers, setTrainers] = useState([]);
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
    const fetchTrainers = async () => {
      if (currentUser && currentUser.role === 'institution') {
        // Fetch trainers based on the institution's name
        const trainersCollection = collection(getFirestore(), 'users');
        const trainersQuery = query(
          trainersCollection,
          where('role', '==', 'trainer'),
          where('institution', '==', currentUser.institutionName)
        );

        try {
          const trainersSnapshot = await getDocs(trainersQuery);
          const trainersData = trainersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTrainers(trainersData);
        } catch (error) {
          console.error('Error fetching trainers:', error.message);
        }
      }
    };

    fetchTrainers();
  }, [currentUser]);

  return (
    <div>
      <h2>Institution Formations</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Trainer Name</th>
            <th scope="col">Email</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {trainers.map((trainer) => (
            <tr key={trainer.id}>
              <td>{`${trainer.name} ${trainer.lastName}`}</td>
              <td>{trainer.email}</td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Trainers;
