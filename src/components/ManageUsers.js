// ManageUsers.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, where, query, getDocs,addDoc,doc,deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword,useDeviceLanguage } from 'firebase/auth';
import { auth } from '../firebase';

const ManageUsers = () => {
  useDeviceLanguage(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // 'trainer' or 'institution'
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [institutionName, setInstitutionName] = useState('');
  const [Institution, setInstitution] = useState('');
  const [success, setSuccess] = useState(false);


  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState('');
  useEffect(() => {
    // Fetch institution names when the component mounts
    const fetchInstitutionNames = async () => {
      const usersCollection = collection(getFirestore(), 'users');
      const institutionUsersQuery = query(usersCollection, where('role', '==', 'institution'));

      try {
        const institutionUsersSnapshot = await getDocs(institutionUsersQuery);
        const institutionNames = institutionUsersSnapshot.docs.map((doc) => doc.data().institutionName);
        setInstitutionOptions(institutionNames);
      } catch (error) {
        console.error('Error fetching institution names:', error.message);
      }
    };

    fetchInstitutionNames();
  }, []); // Empty dependency array ensures the effect runs only once

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleInstitutionChange = (event) => {
    setSelectedInstitution(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create user using Firebase Authentication
      // await createUserWithEmailAndPassword(auth, email, password);

      // Step 2: Add user details to Firestore
      const firestore = getFirestore();
      if (role === 'trainer') {
        await addDoc(collection(firestore, 'users'), {
          email,
          password, // Note: Storing passwords in plain text is not recommended. This is just for illustration.
          role,
          name,
          lastName,
          institution: selectedInstitution,
        });
      } else if (role === 'institution') {
        await addDoc(collection(firestore, 'users'), {
          email,
          password: '', // Note: Storing passwords in plain text is not recommended. This is just for illustration.
          role,
          institutionName: Institution,
        });
      }


      // Set success status to true and clear form inputs
      setSuccess(true);
      setEmail('');
      setPassword('');
      setRole('');
      setName('');
      setLastName('');
      setSelectedInstitution('');
      setInstitutionName('');
      setInstitution('');

      // Reset success status after a delay (e.g., 3 seconds)
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const firestore = getFirestore();
      const usersCollection = collection(firestore, 'users');
      let usersQuery = usersCollection;

      // Apply filter based on role
      if (filteredRole) {
        const roleQuery = query(usersCollection, where('role', '==', filteredRole));
        usersQuery = roleQuery;
      }

      try {
        const usersSnapshot = await getDocs(usersQuery);
        const userList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, [filteredRole]);

  const handleDeleteUser = async (userId) => {
    const firestore = getFirestore();
    const userDocRef = doc(firestore, 'users', userId);
  
    try {
      await deleteDoc(userDocRef);
      // Update the local state after successful deletion
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  
  return (
    <div>
      <form className='container' onSubmit={handleSubmit}>
      <h2>Manage Users</h2>
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
        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Role:
          </label>
          <select
            className="form-control"
            id="role"
            value={role}
            onChange={handleRoleChange}
            required
          >
            <option value="" disabled>Select role</option>
            <option value="trainer">Trainer</option>
            <option value="institution">Institution</option>
          </select>
        </div>
        {role === 'trainer' && (
          <>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </>
        )}
         {role === 'institution' && (
          <>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Institution Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={Institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
              />
            </div>
            
          </>
        )}
        {role === 'trainer' && (
          <div className="mb-3">
            <label htmlFor="institution" className="form-label">
              Institution:
            </label>
            <select
              className="form-control"
              id="institution"
              value={selectedInstitution}
              onChange={handleInstitutionChange}
              required
            >
              <option value="" disabled>Select institution</option>
              {institutionOptions.map((institutionName) => (
                <option key={institutionName} value={institutionName}>
                  {institutionName}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      {success && (
        <div className="alert alert-success mt-3" role="alert">
          User created successfully! Form has been cleared.
        </div>
      )}



      <div className='container'>
      <label htmlFor="roleFilter">Filter by Role:</label>
      <select
        id="roleFilter"
        onChange={(e) => setFilteredRole(e.target.value)}
        value={filteredRole}
      >
        <option value="">All Roles</option>
        <option value="trainer">Trainer</option>
        <option value="institution">Institution</option>
      </select>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Name</th>
            <th>Last Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.name}</td>
              <td>{user.lastName}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(user.id)}
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

export default ManageUsers;
