// InstFormations.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../firebase';

const InstFormations = () => {
  const { auth } = useAuth();
  const [formations, setFormations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [trainersDetails, setTrainersDetails] = useState([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (auth.currentUser) {
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
    const fetchTrainersDetails = async () => {
      if (currentUser && currentUser.role === 'institution') {
        const trainersCollection = collection(getFirestore(), 'users');
        const trainersQuery = query(trainersCollection, where('institution', '==', currentUser?.institutionName || ''));

        try {
          const trainersSnapshot = await getDocs(trainersQuery);
          const trainersDetailsData = [];
          trainersSnapshot.forEach((doc) => {
            const { name, lastName, email } = doc.data();
            trainersDetailsData.push({ name, lastName, email });
          });
          setTrainersDetails(trainersDetailsData);
        } catch (error) {
          console.error('Error fetching trainers details:', error.message);
        }
      }
    };

    fetchTrainersDetails();
  }, [currentUser]);

  useEffect(() => {
    const fetchFormations = async () => {
      if (currentUser && currentUser.role === 'institution') {
        const trainersNames = trainersDetails.map((trainer) => `${trainer.name} ${trainer.lastName}`);
        
        if (trainersNames.length > 0) {
          const formationsCollection = collection(getFirestore(), 'formations');
          const formationsQuery = query(
            formationsCollection,
            where('trainers', 'array-contains-any', trainersNames)
          );

          try {
            const formationsSnapshot = await getDocs(formationsQuery);
            const formationsData = formationsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setFormations(formationsData);
          } catch (error) {
            console.error('Error fetching formations:', error.message);
          }
        }
      }
    };

    fetchFormations();
  }, [currentUser, trainersDetails]);
  console.log(trainersDetails)
  console.log(currentUser)

  return (
    <div>
      <h2>Institution Formations</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            <th scope="col">Subject</th>
            <th scope="col">Attendance</th>
            <th scope="col">Trainers</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {formations.map((formation) => (
            <tr key={formation.id}>
              <td>{formation.startDate}</td>
              <td>{formation.endDate}</td>
              <td>{formation.subject}</td>
              <td>{formation.attendance}</td>
              <td>
                <ul>
                  {formation.trainers.map((trainerName) => (
                    <li key={trainerName}>
                      {trainersDetails.find((trainer) => `${trainer.name} ${trainer.lastName}` === trainerName)
                        ? `${trainersDetails.find((trainer) => `${trainer.name} ${trainer.lastName}` === trainerName).name} ${trainersDetails.find((trainer) => `${trainer.name} ${trainer.lastName}` === trainerName).lastName}`
                        : 'Unknown Trainer'}
                    </li>
                  ))}
                </ul>
              </td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstFormations;
