import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const ManageFormations = () => {
  const [formations, setFormations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [subject, setSubject] = useState('');
  const [trainerOptions, setTrainerOptions] = useState([]);
  const [selectedTrainers, setSelectedTrainers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch trainers and formations when the component mounts
  useEffect(() => {
    const fetchTrainersAndFormations = async () => {
      const usersCollection = collection(getFirestore(), 'users');
      const trainerQuery = query(usersCollection, where('role', '==', 'trainer'));

      try {
        const trainerSnapshot = await getDocs(trainerQuery);
        const trainers = trainerSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          lastName: doc.data().lastName,
        }));
        setTrainerOptions(trainers);

        const formationsCollection = collection(getFirestore(), 'formations');
        const formationsSnapshot = await getDocs(formationsCollection);
        const formationsData = formationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFormations(formationsData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchTrainersAndFormations();
  }, []); // Empty dependency array ensures the effect runs only once

  const handleTrainerChange = (event) => {
    const selectedTrainerId = event.target.value;
    setSelectedTrainers((prevTrainers) => {
      if (!prevTrainers.some((trainer) => trainer.id === selectedTrainerId)) {
        const selectedTrainer = trainerOptions.find(
          (trainer) => trainer.id === selectedTrainerId
        );
        return [...prevTrainers, { id: selectedTrainerId, ...selectedTrainer }];
      }
      return prevTrainers;
    });
  };

  const handleRemoveTrainer = (trainerId) => {
    setSelectedTrainers((prevTrainers) =>
      prevTrainers.filter((trainer) => trainer.id !== trainerId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const firestore = getFirestore();
      await addDoc(collection(firestore, 'formations'), {
        startDate,
        endDate,
        subject,
        trainers: selectedTrainers.map(
          (trainer) => `${trainer.name} ${trainer.lastName}`
        ),
      });
      setStartDate('');
      setEndDate('');
      setSubject('');
      setSelectedTrainers([]);

      // Display success message
      setSuccessMessage('Formation created successfully');

      // Fetch updated formations after submitting
      const updatedFormationsSnapshot = await getDocs(
        collection(firestore, 'formations')
      );
      const updatedFormationsData = updatedFormationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFormations(updatedFormationsData);
    } catch (error) {
      console.error('Error creating formation:', error);
      setSuccessMessage('Error creating formation. Please try again.');
    }
  };

  const handleDeleteFormation = async (formationId) => {
    try {
      const firestore = getFirestore();
      await deleteDoc(doc(firestore, 'formations', formationId));

      // Fetch updated formations after deleting one
      const updatedFormationsSnapshot = await getDocs(
        collection(firestore, 'formations')
      );
      const updatedFormationsData = updatedFormationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFormations(updatedFormationsData);

      // Display success message
      setSuccessMessage('Formation deleted successfully');
    } catch (error) {
      console.error('Error deleting formation:', error);
    }
  };

  return (
    <div>
      <form className='container' onSubmit={handleSubmit}>
      <h2>Manage Formations</h2>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">
            Start Date:
          </label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">
            End Date:
          </label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="subject" className="form-label">
            Subject:
          </label>
          <input
            type="text"
            className="form-control"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="trainers" className="form-label">
            Trainers:
          </label>
          <select
            multiple
            className="form-control"
            id="trainers"
            value={selectedTrainers.map((trainer) => trainer.id)}
            onChange={handleTrainerChange}
            required
          >
            {trainerOptions.map((trainer) => (
              <option key={trainer.id} value={trainer.id}>
                {`${trainer.name} ${trainer.lastName}`}
              </option>
            ))}
          </select>
          <small className="form-text text-muted">
            Hold down the Ctrl (Windows) / Command (Mac) button to select multiple trainers.
          </small>
        </div>
        <div>
          <label>Selected Trainers:</label>
          <ul>
            {selectedTrainers.map((trainer) => (
              <li key={trainer.id}>
                {`${trainer.name} ${trainer.lastName}`}
                <button type="button" onClick={() => handleRemoveTrainer(trainer.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <div className="container">
        <h3>Formations List</h3>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Subject</th>
              <th scope="col">Trainers</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formations.map((formation) => (
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
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteFormation(formation.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageFormations;
